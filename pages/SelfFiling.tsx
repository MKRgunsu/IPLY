import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, HelpCircle, X, AlertTriangle, MessageSquare, ExternalLink, Send, FileText, AlertOctagon } from 'lucide-react';
import { getIdea } from '../services/storage';
import { api } from '../services/mockApi';

interface ChatMsg {
  sender: 'ai' | 'user';
  text: string;
}

export const SelfFiling: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [ideaData, setIdeaData] = useState<any>(null);
  const [claimText, setClaimText] = useState('');
  const [descText, setDescText] = useState('');
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { sender: 'ai', text: '안녕하세요! 명세서 작성 중 어려운 용어나 절차가 있다면 물어보세요.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = getIdea();
    if (data) {
      setIdeaData(data);
      // AI Draft Generation Mock
      setDescText(`[기술 분야]\n본 발명은 ${data.title}에 관한 것이다.\n\n[배경 기술]\n종래에는 ${data.problem}\n\n[해결하려는 과제]\n본 발명은 상기 문제점을 해결하기 위하여 ${data.solution}을 제공하는 것을 목적으로 한다.`);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  const handleNext = () => {
    if (step === 2 && claimText.trim().length < 20) {
      alert('권리 범위를 보호받기 위해 청구항을 더 구체적으로 작성해야 합니다 (최소 20자).');
      return;
    }
    if (step === 3) {
      // Final Warning before external link
      if(window.confirm('경고: 전문가 검토 없이 제출된 특허는 거절될 확률이 85% 이상입니다. 그래도 특허청 사이트로 이동하시겠습니까?')) {
         window.open('https://www.patent.go.kr/smart/we/main.do', '_blank');
      }
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/analysis');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    const response = await api.generateBotResponse(userMsg);
    setChatMessages(prev => [...prev, { sender: 'ai', text: response }]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in pb-32 flex flex-col md:flex-row gap-8 relative">
      
      {/* Persistent Warning Banner */}
      <div className="fixed bottom-0 left-0 w-full bg-red-600 text-white z-50 px-4 py-3 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
             <AlertTriangle className="mr-3 animate-pulse" size={24} />
             <div>
               <p className="font-bold text-sm md:text-base">경고: 셀프 출원은 거절 위험이 매우 높습니다.</p>
               <p className="text-xs md:text-sm text-red-200">김시연 변리사(IPLY)의 검토를 받고 안전하게 출원하세요.</p>
             </div>
          </div>
          <button 
             onClick={() => navigate('/attorneys')}
             className="px-4 py-2 bg-white text-red-600 text-xs md:text-sm font-bold rounded-lg hover:bg-red-50 transition-colors shadow-md whitespace-nowrap"
          >
             전문가 연결
          </button>
        </div>
      </div>

      {/* Left Panel: Document Editor */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
           <h2 className="text-2xl font-bold text-slate-900 flex items-center">
             <FileText className="mr-2 text-indigo-600"/> 
             셀프 명세서 작성
           </h2>
           <div className="text-sm font-bold text-slate-500">
             Step {step} / 3
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
          {/* Toolbar */}
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-400"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
             <div className="w-3 h-3 rounded-full bg-green-400"></div>
             <span className="ml-4 text-xs font-mono text-slate-500">New_Patent_Draft_2026.xml</span>
          </div>

          <div className="p-8 flex-1">
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">1. 발명의 상세한 설명</h3>
                <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-sm text-yellow-800 border border-yellow-100">
                  <strong>Tip:</strong> 앞서 입력하신 아이디어를 바탕으로 AI가 초안을 생성했습니다. 기술적 내용을 보강해주세요.
                </div>
                <textarea 
                  value={descText}
                  onChange={(e) => setDescText(e.target.value)}
                  className="w-full h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">2. 특허청구범위 (Claims)</h3>
                <div className="bg-red-50 p-4 rounded-lg mb-6 text-sm text-red-800 border border-red-100 flex items-start">
                  <AlertOctagon size={16} className="mr-2 mt-0.5 flex-shrink-0"/>
                  <span>
                    <strong>매우 중요:</strong> 청구항은 법적 권리 범위입니다. 잘못 작성하면 기술을 공개하고도 권리를 못 받을 수 있습니다.
                  </span>
                </div>
                <textarea 
                  value={claimText}
                  onChange={(e) => setClaimText(e.target.value)}
                  placeholder="[청구항 1] ...을 포함하는 반려동물 급식 장치."
                  className="w-full h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in text-center py-12">
                 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ExternalLink size={32} className="text-slate-400"/>
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">특허로(KIPO) 이동 준비</h3>
                 <p className="text-slate-500 mb-8 max-w-md mx-auto">
                   작성된 명세서를 복사하여 특허청 웹사이트 '특허로'의 서식 작성기에 붙여넣어야 합니다.
                 </p>
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left max-w-md mx-auto">
                    <h4 className="font-bold text-slate-900 mb-2">체크리스트</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center"><X size={14} className="text-red-500 mr-2"/> 선행 기술 조사 완료 여부</li>
                      <li className="flex items-center"><X size={14} className="text-red-500 mr-2"/> 청구항 기재 불비 검토</li>
                      <li className="flex items-center"><X size={14} className="text-red-500 mr-2"/> 도면 부호 일치 여부</li>
                    </ul>
                 </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between">
             <button onClick={handleBack} className="text-slate-500 font-bold hover:text-slate-800">이전</button>
             <button onClick={handleNext} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800">
               {step === 3 ? '특허로 이동 (외부)' : '다음 단계'}
             </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Advisor / Upsell */}
      <div className="w-full md:w-80 flex-shrink-0 space-y-6">
        {/* Warning Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={100}/></div>
           <h3 className="font-bold text-lg mb-2 relative z-10">혼자 하기 막막하신가요?</h3>
           <p className="text-indigo-200 text-sm mb-6 relative z-10">
             셀프 출원의 거절율은 대리인 선임 대비 4배 높습니다. 작성 중인 내용을 변리사에게 검토받으세요.
           </p>
           <button 
             onClick={() => navigate('/attorneys')}
             className="w-full py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg relative z-10 text-sm"
           >
             전문가 검토 요청 (유료)
           </button>
        </div>

        {/* AI Chat Bot */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-[400px]">
           <div className="p-4 border-b border-slate-100 flex items-center bg-indigo-50 rounded-t-2xl">
              <MessageSquare size={18} className="text-indigo-600 mr-2"/>
              <span className="font-bold text-slate-900">AI 작성 도우미</span>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`text-sm p-3 rounded-xl ${msg.sender === 'ai' ? 'bg-white border border-slate-200 text-slate-700' : 'bg-indigo-600 text-white self-end ml-auto'}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef}/>
           </div>
           <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-200">
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-sm outline-none"
                  placeholder="질문 입력..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                />
                <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg"><Send size={16}/></button>
              </div>
           </form>
        </div>
      </div>

    </div>
  );
};