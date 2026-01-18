// services/aiService.ts
// Google Gemini API Integration

interface AISettings {
  enabled: boolean;
  apiKey: string;
}

const getAISettings = (): AISettings => {
  const saved = localStorage.getItem('iply_ai_settings');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    enabled: false,
    apiKey: 'AIzaSyDOdH_ptqRPzlyPZUNa0BD54YnyYsLkg7E'
  };
};

// Rate limiting to prevent quota exhaustion
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 4000; // 4초 (분당 15회 제한 준수)

const checkRateLimit = (): boolean => {
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    return false;
  }
  lastRequestTime = now;
  return true;
};

export const aiService = {
  // AI 아이디어 분석
  analyzeIdea: async (title: string, problem: string, solution: string): Promise<string[]> => {
    const settings = getAISettings();
    
    // AI 비활성화 시 Mock 데이터 반환
    if (!settings.enabled) {
      return [
        `"${title}"에 대한 기술 분류 분석 중... (Mock)`,
        '선행 기술 DB 검색 (KIPRIS 연동)... (Mock)',
        '특허 등록 가능성 스코어링... (Mock)',
        '청구항(Claim) 자동 생성 알고리즘 가동... (Mock)',
        '분석 완료. (Mock 데이터)'
      ];
    }

    // Rate limit 체크
    if (!checkRateLimit()) {
      throw new Error('요청이 너무 빠릅니다. 4초 후 다시 시도해주세요.');
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${settings.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `당신은 특허 분석 전문가입니다. 다음 발명에 대해 단계별로 분석하세요:

발명 명칭: ${title}
해결하려는 문제: ${problem}
해결 방법: ${solution}

다음 5가지 단계를 순서대로 분석하세요:
1. 기술 분류 분석
2. 선행 기술 검색 필요성
3. 특허 등록 가능성 평가
4. 청구항 작성 전략
5. 최종 의견

각 단계를 한 줄씩 간결하게 작성하세요.`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '분석 실패';
      
      // AI 응답을 줄 단위로 분리
      const lines = text.split('\n').filter((line: string) => line.trim().length > 0);
      return lines.slice(0, 5); // 최대 5개 라인만 반환
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      // 에러 시 Mock 데이터로 fallback
      return [
        `AI 분석 실패 - Mock 데이터 사용`,
        `"${title}" 기술 분류 중...`,
        '선행 기술 검색 권장',
        '등록 가능성: 중간',
        '전문가 상담 권장'
      ];
    }
  },

  // 챗봇 응답 생성
  generateChatResponse: async (userMessage: string, context?: string): Promise<string> => {
    const settings = getAISettings();
    
    // AI 비활성화 시 Mock 응답
    if (!settings.enabled) {
      const mockResponses = [
        "말씀하신 부분은 특허법 제29조(신규성)와 관련하여 중요한 쟁점입니다. (Mock)",
        "도면을 추가하여 구체적인 실시예를 보여주는 것이 좋습니다. (Mock)",
        "청구항은 권리 범위를 결정하므로, 경쟁 회피 설계를 고려해야 합니다. (Mock)",
        "추가적인 질문이 있으시면 언제든지 말씀해주세요. (Mock)"
      ];
      return mockResponses[Math.floor(Math.random() * mockResponses.length)];
    }

    // Rate limit 체크
    if (!checkRateLimit()) {
      return '요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.';
    }

    try {
      const prompt = context 
        ? `당신은 특허 전문 변리사입니다. 다음 맥락을 고려하여 답변하세요:\n\n${context}\n\n사용자 질문: ${userMessage}\n\n전문적이고 친절하게 답변해주세요.`
        : `당신은 특허 전문 변리사입니다. 다음 질문에 전문적으로 답변하세요:\n\n${userMessage}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${settings.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '답변을 생성할 수 없습니다.';
      
    } catch (error) {
      console.error('AI Chat Error:', error);
      return '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  },

  // 명세서 초안 생성
  generateSpecification: async (title: string, problem: string, solution: string, effect: string): Promise<string> => {
    const settings = getAISettings();
    
    // AI 비활성화 시 Mock 명세서
    if (!settings.enabled) {
      return `[기술 분야]
본 발명은 ${title}에 관한 것이다.

[배경 기술]
종래에는 ${problem}

[해결하려는 과제]
본 발명은 상기 문제점을 해결하기 위하여 ${solution}을 제공하는 것을 목적으로 한다.

[발명의 효과]
${effect}

(Mock 데이터)`;
    }

    // Rate limit 체크
    if (!checkRateLimit()) {
      throw new Error('요청이 너무 빠릅니다. 4초 후 다시 시도해주세요.');
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${settings.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `특허 명세서 형식으로 다음 발명을 작성하세요:

발명의 명칭: ${title}
해결하려는 과제: ${problem}
해결 수단: ${solution}
발명의 효과: ${effect}

다음 구조로 작성하세요:
[기술 분야]
[배경 기술]
[해결하려는 과제]
[과제의 해결 수단]
[발명의 효과]

간결하고 명확하게 작성하세요.`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '명세서 생성 실패';
      
    } catch (error) {
      console.error('AI Specification Error:', error);
      // Fallback to mock
      return `[기술 분야]
본 발명은 ${title}에 관한 것이다.

[배경 기술]
종래에는 ${problem}

[해결하려는 과제]
본 발명은 상기 문제점을 해결하기 위하여 ${solution}을 제공하는 것을 목적으로 한다.

[발명의 효과]
${effect}

(AI 생성 실패 - Mock 데이터)`;
    }
  }
};
