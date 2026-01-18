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
    if (step === 2 && claimText.trim().length < 10) {
      alert('청구항을 더 구체적으로 작성해주세요 (최소 10자).');
      return;
    }
    if (step === 3) {
      // Final Warning before external link
      if(window.confirm('특허청 사이트로 이동하시겠습니까?')) {
         window.open('https://www.patent.go.kr/', '_blank');
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
      <div className="fixed bottom-0 left-0 w-full bg-orange-500 text-white z-50 px-4 py-2.5 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
             <AlertTriangle className="mr-2" size={20} />
             <p className="font-bold text-sm">전문가 검토를 권장합니다</p>
          </div>
          <button 
             onClick={() => navigate('/attorneys')}
             className="px-3 py-1.5 bg-white text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap"
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
             셀프 명세서 및 특허출원신청서 작성
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
                <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-sm text-yellow-800 border border-yellow-100 flex items-start">
                  <AlertOctagon size={16} className="mr-2 mt-0.5 flex-shrink-0"/>
                  <span>청구항은 법적 권리 범위를 결정하므로 신중하게 작성해야 합니다.</span>
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
                 <p className="text-slate-500 mb-6 max-w-md mx-auto">
                   작성된 명세서를 특허청 웹사이트에서 제출할 수 있습니다.
                 </p>
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
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
           <h3 className="font-bold text-lg mb-2">전문가 도움이 필요하신가요?</h3>
           <p className="text-indigo-100 text-sm mb-4">
             작성 중인 내용을 변리사에게 검토받으세요.
           </p>
           <button 
             onClick={() => navigate('/attorneys')}
             className="w-full py-2.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
           >
             전문가 검토 요청
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
