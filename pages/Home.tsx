import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Shield, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-32 lg:pt-32 bg-gradient-to-b from-white to-slate-50">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2.5"></span>
            2026년 최신 개정 특허법 완벽 대응
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
            당신의 아이디어,<br />
            <span className="text-indigo-600">IPLY</span>가 권리로 만듭니다.
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
            AI 기술의 정밀함과 전문 변리사의 통찰력으로<br className="hidden sm:block" />
            가장 빠르고 안전한 특허 출원을 경험하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/process"
              className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
            >
              특허 출원 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
                <Lightbulb size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI 특허 명세서 작성</h3>
              <p className="text-slate-600 leading-relaxed">
                입력하신 아이디어를 고성능 AI가 분석하여 특허청 제출 가능한 형태의 명세서 초안을 자동으로 생성합니다.
                복잡한 기술 용어를 정리하고 법적 요건에 맞는 문장을 구성하여 출원 준비 시간을 획기적으로 단축합니다.
              </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">전문가 매칭 & 논스탑 출원</h3>
              <p className="text-slate-600 leading-relaxed">
                특허법인 IPLY의 전문 변리사를 매칭받거나, 준비된 명세서로 
                특허청에 즉시 출원하는 논스탑 시스템을 이용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};