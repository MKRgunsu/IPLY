import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Zap, Users, TrendingUp, Shield, Lightbulb, ArrowRight, Heart, Scale, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
            <Heart size={16} className="mr-2 text-pink-300" />
            <span className="text-sm font-bold">우리의 이야기</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            특허를 모두에게
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed font-medium">
            방법을 아는 소수가 아닌, 아이디어를 가진 모두가<br/>
            특허 시스템을 활용할 수 있는 세상을 만듭니다.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-red-50 rounded-full mb-6">
                <Target size={20} className="mr-2 text-red-600" />
                <span className="text-sm font-bold text-red-600 uppercase tracking-wide">동기 Motivation</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">구조적 불평등을<br/>완화하기 위해</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                특허 제도는 모두에게 열려 있지만, 실제로 이를 활용할 수 있는 사람은 <strong className="text-slate-900">방법을 아는 소수</strong>에 불과합니다.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                IPLY는 이 <strong className="text-indigo-600">구조적 불평등을 완화</strong>하기 위해 출발했습니다. 
                복잡한 법률 용어, 높은 비용 장벽, 접근성 부족이 혁신을 가로막아서는 안 됩니다.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-12 border border-red-100">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Scale className="text-red-500 mr-4 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">불평등한 접근성</h4>
                      <p className="text-sm text-slate-600">전문 지식이 없으면 특허 시스템 진입조차 어렵습니다</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="text-red-500 mr-4 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">높은 비용 장벽</h4>
                      <p className="text-sm text-slate-600">평균 수임료 300만원, 개인 발명가에게는 큰 부담</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="text-red-500 mr-4 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">정보 독점</h4>
                      <p className="text-sm text-slate-600">법률 전문가만이 시스템을 완전히 이해하고 활용</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 border border-indigo-100">
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm">
                    <div>
                      <div className="text-3xl font-bold text-indigo-600">99,000원</div>
                      <div className="text-sm text-slate-600">논스탑 출원</div>
                    </div>
                    <TrendingUp className="text-green-500" size={32} />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm">
                    <div>
                      <div className="text-3xl font-bold text-indigo-600">24시간</div>
                      <div className="text-sm text-slate-600">평균 처리 시간</div>
                    </div>
                    <Zap className="text-yellow-500" size={32} />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm">
                    <div>
                      <div className="text-3xl font-bold text-indigo-600">AI 기반</div>
                      <div className="text-sm text-slate-600">실시간 분석</div>
                    </div>
                    <Sparkles className="text-purple-500" size={32} />
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full mb-6">
                <Lightbulb size={20} className="mr-2 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">목표 Vision</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">더 빠른 특허,<br/>더 편리한 특허</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                IPLY는 특허가 <strong className="text-indigo-600">전문가들의 전유물이 아닌</strong>, 
                일반인들에게도 가깝게 다가오는 세상을 목표로 합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Zap className="text-indigo-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">즉시 출원</h4>
                    <p className="text-slate-600">AI 분석 완료 후 클릭 한 번으로 특허청 제출</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="text-indigo-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">전문가 매칭</h4>
                    <p className="text-slate-600">필요할 때만 선택적으로 변리사 상담 가능</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="text-indigo-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">투명한 비용</h4>
                    <p className="text-slate-600">숨겨진 비용 없이 명확한 가격 체계</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            당신의 아이디어, 지금 바로 보호하세요
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            IPLY와 함께라면 누구나 쉽고 빠르게 특허를 출원할 수 있습니다.
          </p>
          <button
            onClick={() => navigate('/input')}
            className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
          >
            무료로 시작하기
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
