import { Attorney } from '../types';
import { getAttorneysFromStorage, saveAttorneys } from './storage';
import { aiService } from './aiService';

// Default Data (Fallback)
const DEFAULT_ATTORNEYS: Attorney[] = [
  {
    id: 'at_1',
    name: '김시연 변리사',
    firm: '특허법인 IPLY',
    specialty: ['IT/SW', 'BM특허', 'AI모델'],
    career: ['KAIST 전산학 석사', '삼성전자 IP팀 5년', '제45회 변리사 시험 수석'],
    imageUrl: 'https://picsum.photos/200/200?random=1',
    status: 'online',
    rating: 4.9,
    reviewCount: 124,
    consultationOptions: [
      { type: 'chat', price: 30000, duration: 30 },
      { type: 'phone', price: 50000, duration: 20 },
      { type: 'visit', price: 150000, duration: 60 }
    ]
  },
  {
    id: 'at_2',
    name: '박동훈 변리사',
    firm: '특허법인 누리',
    specialty: ['기계', '회로', '반도체'],
    career: ['서울대 기계공학 박사', '특허청 심사관 출신 (7년)', '기술가치평가사'],
    imageUrl: 'https://picsum.photos/200/200?random=2',
    status: 'online',
    rating: 4.8,
    reviewCount: 89,
    consultationOptions: [
      { type: 'chat', price: 25000, duration: 30 },
      { type: 'phone', price: 40000, duration: 20 },
      { type: 'visit', price: 120000, duration: 60 }
    ]
  },
  {
    id: 'at_3',
    name: '최수민 변리사',
    firm: '이노베이션 IP',
    specialty: ['화학', '바이오', '신소재'],
    career: ['포스텍 화학공학 학사', 'LG화학 연구원 출신', '대한변리사회 이사'],
    imageUrl: 'https://picsum.photos/200/200?random=3',
    status: 'offline',
    rating: 4.7,
    reviewCount: 56,
    consultationOptions: [
      { type: 'chat', price: 30000, duration: 30 },
      { type: 'phone', price: 45000, duration: 20 },
      { type: 'visit', price: 130000, duration: 60 }
    ]
  }
];

// Helper to get current list (Storage > Default)
const getCurrentAttorneys = (): Attorney[] => {
  const stored = getAttorneysFromStorage();
  if (stored && stored.length > 0) return stored;
  return DEFAULT_ATTORNEYS;
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getAttorneys: async (): Promise<Attorney[]> => {
    await delay(300);
    return getCurrentAttorneys();
  },

  getAttorneyById: async (id: string): Promise<Attorney | undefined> => {
    await delay(200);
    const attorneys = getCurrentAttorneys();
    return attorneys.find(a => a.id === id);
  },

  addAttorney: async (attorneyData: Omit<Attorney, 'id'>): Promise<void> => {
    await delay(500);
    const attorneys = getCurrentAttorneys();
    const newAttorney: Attorney = {
      ...attorneyData,
      id: `at_${Date.now()}`
    };
    const updated = [newAttorney, ...attorneys];
    saveAttorneys(updated);
  },

  updateAttorneys: async (newList: Attorney[]): Promise<void> => {
    await delay(300);
    saveAttorneys(newList);
  },

  // AI 아이디어 분석 (실제 AI 또는 Mock)
  analyzeIdea: async (title: string, problem?: string, solution?: string): Promise<string[]> => {
    try {
      return await aiService.analyzeIdea(
        title, 
        problem || '문제점이 제공되지 않음', 
        solution || '해결책이 제공되지 않음'
      );
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to mock
      return [
        `"${title}"에 대한 기술 분류 분석 중... (Error Fallback)`,
        '선행 기술 DB 검색 권장',
        '특허 등록 가능성 평가 필요',
        '전문가 상담 권장',
        '분석 완료'
      ];
    }
  },

  // 챗봇 응답 생성 (실제 AI 또는 Mock)
  generateBotResponse: async (userMessage: string, context?: string): Promise<string> => {
    await delay(800);
    try {
      return await aiService.generateChatResponse(userMessage, context);
    } catch (error) {
      console.error('Chat error:', error);
      const responses = [
        "말씀하신 부분은 특허법 제29조(신규성)와 관련하여 중요한 쟁점입니다.",
        "도면을 추가하여 구체적인 실시예를 보여주는 것이 좋습니다.",
        "청구항은 권리 범위를 결정하므로, 경쟁 회피 설계를 고려해야 합니다.",
        "추가적인 질문이 있으시면 언제든지 말씀해주세요."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  },

  // 명세서 초안 생성 (실제 AI 또는 Mock)
  generateSpecification: async (title: string, problem: string, solution: string, effect: string): Promise<string> => {
    try {
      return await aiService.generateSpecification(title, problem, solution, effect);
    } catch (error) {
      console.error('Specification error:', error);
      return `[기술 분야]
본 발명은 ${title}에 관한 것이다.

[배경 기술]
종래에는 ${problem}

[해결하려는 과제]
본 발명은 상기 문제점을 해결하기 위하여 ${solution}을 제공하는 것을 목적으로 한다.

[발명의 효과]
${effect}

(Error Fallback - Mock 데이터)`;
    }
  }
};
