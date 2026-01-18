import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, PenTool, CheckCircle, ArrowRight, BrainCircuit } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: '아이디어 입력',
    desc: '핵심 아이디어와 도면을 업로드하세요.',
    icon: <PenTool size={24} />,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 2,
    title: 'AI 분석 및 초안 생성',
    desc: '특허 명세서 구조 설계 및 초안 작성.',
    icon: <BrainCircuit size={24} />,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 3,
    title: '출원서 작성',
    desc: '셀프 작성 혹은 변리사 도움 받기.',
    icon: <FileText size={24} />,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 4,
    title: '출원 완료',
    desc: '특허청 제출 및 관납료 납부.',
    icon: <CheckCircle size={24} />,
    color: 'bg-green-100 text-green-600'
  }
];

export const ProcessGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">특허 출원, 이렇게 진행됩니다</h2>
        <p className="text-lg text-slate-500">복잡한 절차를 4단계로 간소화했습니다.</p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2 transform" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="relative bg-white md:bg-transparent p-6 md:p-0 rounded-xl border md:border-none border-gray-100 shadow-sm md:shadow-none flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4 shadow-sm z-10`}>
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Step {step.id}. {step.title}</h3>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link 
          to="/input" 
          className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
        >
          바로 시작하기
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};