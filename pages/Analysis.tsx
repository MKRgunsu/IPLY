import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdea } from '../services/storage';
import { api } from '../services/mockApi';
import { Loader2, CheckCircle2, BrainCircuit, ChevronRight, Zap } from 'lucide-react';

export const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');

  useEffect(() => {
    const idea = getIdea();
    if (!idea) {
      navigate('/input');
      return;
    }
    setIdeaTitle(idea.title);

    const runAnalysis = async () => {
      const messages = await api.analyzeIdea(idea.title);
      for (let i = 0; i < messages.length; i++) {
        await new Promise(r => setTimeout(r, 800)); 
        setLogs(prev => [...prev, messages[i]]);
      }
      setIsComplete(true);
    };

    runAnalysis();
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center animate-fade-in">
      <div className="w-full bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-10 md:p-12">
        
        {!isComplete ? (
          <div className="flex flex-col items-center py-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-50"></div>
              <div className="relative p-6 bg-indigo-50 rounded-full text-indigo-600">
                <Loader2 size={48} className="animate-spin" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">AI 심층 분석 중</h2>
            <p className="text-slate-500 font-medium">"{ideaTitle}"의 기술적 특징을 추출하고 있습니다.</p>
          </div>
        ) : (
           <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-2xl mb-6 shadow-sm">
              <BrainCircuit size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">분석 완료</h2>
            <p className="text-slate-500 mb-8 font-medium">특허 출원을 위한 기초 데이터 생성이 완료되었습니다.</p>
          </div>
        )}

        {/* Log Window */}
        <div className="bg-slate-900 rounded-xl p-6 mb-10 h-64 overflow-y-auto font-mono text-sm text-green-400 shadow-inner">
          {logs.map((log, idx) => (
            <div key={idx} className="mb-3 flex items-start animate-fade-in">
              <span className="mr-3 opacity-50">➜</span>
              {log}
            </div>
          ))}
          {!isComplete && (
            <div className="animate-pulse">_</div>
          )}
        </div>

        {isComplete && (
          <div className="space-y-4 animate-slide-up">
            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-800 mb-8 flex items-start">
              <CheckCircle2 size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>분석 요약:</strong> 등록 가능성이 높음으로 판단되나, 청구항 제3항의 보정이 필요할 수 있습니다.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/nonstop-filing')}
                className="group relative flex flex-col items-start p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={80} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={18} className="text-yellow-300 fill-current" />
                  <span className="font-bold uppercase tracking-wider text-xs text-yellow-300">Recommended</span>
                </div>
                <span className="text-xl font-bold mb-1">논스탑 출원</span>
                <span className="text-sm text-indigo-100 font-medium text-left">
                  특허청에 즉시 제출합니다.<br/>(특허고객번호 필요)
                </span>
                <div className="mt-4 self-end">
                   <ChevronRight />
                </div>
              </button>

              <div className="space-y-3">
                 <button
                  onClick={() => navigate('/self-filing')}
                  className="w-full p-4 border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-colors flex justify-between items-center bg-white"
                >
                  <span className="flex flex-col items-start">
                    <span>셀프 출원 계속하기</span>
                    <span className="text-xs text-slate-400 font-medium">단계별 가이드를 따라 직접 작성</span>
                  </span>
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => navigate('/attorneys')}
                  className="w-full p-4 border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-colors flex justify-between items-center bg-white"
                >
                   <span className="flex flex-col items-start">
                    <span>전문가 상담 신청</span>
                    <span className="text-xs text-slate-400 font-medium">변리사와 1:1 채팅 및 검토</span>
                  </span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};