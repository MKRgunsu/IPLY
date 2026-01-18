import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, HelpCircle, ChevronDown, ChevronUp, Zap, MessageCircle, GraduationCap } from 'lucide-react';

const plans = [
  {
    name: 'AI 베이직',
    price: '무료',
    period: '/건',
    description: '아이디어 구체화 및 명세서 초안 생성',
    features: [
      '특허 명세서 초안 생성',
      '등록 가능성 진단 리포트',
      '기재 불비 항목 자동 점검',
      '셀프 출원 가이드 제공'
    ],
    buttonText: '무료로 시작하기',
    highlight: false,
    action: '/input'
  },
  {
    name: '논스탑 출원',
    price: '99,000원',
    period: '/건',
    description: 'AI 작성 명세서 즉시 제출 (관납료 별도)',
    features: [
      'AI 베이직 모든 기능 포함',
      'KIPO(특허청) 즉시 전자 출원',
      '출원 번호 당일 발급',
      '우선심사 신청 가이드',
      '서울보증보험 가입 지원'
    ],
    buttonText: '논스탑 출원하기',
    highlight: true,
    action: '/nonstop-filing'
  },
  {
    name: '전문가 매칭',
    price: '30,000원',
    period: '/상담',
    description: '특허법인 IPLY 변리사 1:1 심층 상담',
    features: [
      '30분 심층 채팅/화상 상담',
      '청구항 정밀 검토 및 수정',
      '침해 가능성 법률 검토',
      '거절 대응 전략 수립'
    ],
    buttonText: '변리사 찾기',
    highlight: false,
    action: '/attorneys'
  }
];

const faqs = [
  {
    question: "2026년 개정 특허법에 따른 AI 자동 출원이 가능한가요?",
    answer: "네, 가능합니다. IPLY는 2026년 최신 개정된 특허법 및 심사 지침을 AI에 학습시켰습니다. 특히 전자 서명법 개정에 따라 포괄위임장을 통한 '논스탑 출원'이 법적으로 유효하며, 출원 즉시 접수 번호가 부여됩니다."
  },
  {
    question: "셀프 출원 도중 막히면 변리사의 도움을 받을 수 있나요?",
    answer: "물론입니다. '전문가 매칭' 기능을 통해 언제든지 특허법인 IPLY의 전문 변리사와 유료 상담을 진행할 수 있습니다. 상담 내역은 암호화되어 보호되며, 작성 중이던 명세서를 변리사에게 공유하여 검토받을 수 있습니다."
  },
  {
    question: "텔레그램으로 상담 알림을 받을 수 있나요?",
    answer: "네, [전문가 찾기] - [채팅] 설정에서 텔레그램 연동을 활성화하면, 변리사의 답변이 도착했을 때 실시간으로 텔레그램 메시지를 받아볼 수 있습니다. 현재 베타 서비스 중입니다."
  },
  {
    question: "논스탑 출원 시 관납료는 포함되어 있나요?",
    answer: "아니요, 제시된 99,000원은 IPLY 플랫폼 이용료입니다. 특허청에 납부해야 하는 관납료(출원료, 심사청구료 등)는 출원 후 발급되는 납부서에 따라 별도로 특허청에 납부하셔야 합니다."
  }
];

export const PricingAndQnA: React.FC = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">합리적인 비용으로<br/>당신의 권리를 확보하세요</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          2026년 표준 수임료 대비 최대 90% 절감된 비용으로<br className="hidden sm:block"/>
          AI 기술 기반의 프리미엄 특허 법률 서비스를 제공합니다.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        
        {/* Discount Section */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 mb-12 shadow-2xl border border-indigo-700/50 relative overflow-hidden text-white">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
             <div>
               <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-extrabold uppercase tracking-wide mb-3">
                 <Zap size={12} className="mr-1 fill-current" /> Special Offer
               </div>
               <h2 className="text-2xl font-bold mb-2">KAIST CCE & POSTECH CEO 특별 할인</h2>
               <p className="text-indigo-200 text-sm">대한민국 최고의 창업가 과정을 응원합니다. 증빙서류(명함/명찰 원본대조필) 제출 시 적용됩니다.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full md:w-auto min-w-[300px]">
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-100">16, 17기 재학생</span>
                    <span className="font-bold text-yellow-400">무료 (100%)</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-100">과정 수료생</span>
                    <span className="font-bold text-white">80% 할인</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-100">수료생 창업기업</span>
                    <span className="font-bold text-white">50% 할인</span>
                  </li>
                </ul>
             </div>
           </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-3xl shadow-xl overflow-hidden border ${plan.highlight ? 'border-indigo-500 ring-4 ring-indigo-500/20 transform md:-translate-y-4' : 'border-slate-100'}`}>
              {plan.highlight && (
                <div className="bg-indigo-600 text-white text-center py-2 text-sm font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-6 min-h-[40px] font-medium">{plan.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 ml-2 font-medium">{plan.period}</span>
                </div>
                <button
                  onClick={() => navigate(plan.action)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    plan.highlight 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
              <div className="bg-slate-50 p-8 border-t border-slate-100 h-full">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check size={20} className="text-indigo-600 mr-3 flex-shrink-0" />
                      <span className="text-slate-700 font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <p className="text-slate-500 font-medium">서비스 이용과 관련하여 궁금한 점을 확인하세요.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:border-indigo-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-lg flex items-center">
                    <HelpCircle size={20} className="text-indigo-600 mr-3" />
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-6 bg-slate-50 border-t border-slate-100">
                    <p className="text-slate-600 leading-relaxed font-medium mt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
            <MessageCircle size={32} className="mx-auto text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">더 궁금한 점이 있으신가요?</h3>
            <p className="text-slate-600 mb-6 font-medium">전문 상담원이 24시간 대기 중입니다.</p>
            <button 
              onClick={() => navigate('/attorneys')}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              전문가에게 문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};