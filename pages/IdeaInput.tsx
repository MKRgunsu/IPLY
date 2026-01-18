import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveIdea, getIdea } from '../services/storage';
import { UploadCloud, File, AlertCircle, HelpCircle, ChevronRight, ChevronLeft, Info, FileText } from 'lucide-react';

// Tooltip Component
const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-2 cursor-help">
    <Info size={16} className="text-indigo-400 hover:text-indigo-600 transition-colors" />
    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export const IdeaInput: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    problem: '',
    solution: '',
    effect: '',
    fileName: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = getIdea();
    if (saved) {
      setFormData({
        title: saved.title || '',
        problem: saved.problem || '',
        solution: saved.solution || '',
        effect: saved.effect || '',
        fileName: saved.fileName || ''
      });
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, fileName: e.target.files![0].name }));
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.title.trim()) { setError('명칭을 입력해주세요.'); return; }
    if (step === 2 && !formData.problem.trim()) { setError('해결하려는 과제를 입력해주세요.'); return; }
    if (step === 3 && !formData.solution.trim()) { setError('해결 수단을 입력해주세요.'); return; }
    if (step === 4 && !formData.effect.trim()) { setError('기대 효과를 입력해주세요.'); return; }
    
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    saveIdea({
      ...formData,
      updatedAt: new Date().toISOString()
    });
    navigate('/analysis');
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <label className="block text-lg font-bold text-slate-900 mb-2 flex items-center">
              1. 발명의 명칭
              <Tooltip text="특허청 검색 시 사용될 공식 명칭입니다. '장치', '방법', '시스템' 등으로 끝나는 것이 일반적입니다." />
            </label>
            <p className="text-slate-500 text-sm mb-4">가장 직관적으로 아이디어를 표현하는 이름을 지어주세요.</p>
            <input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
              placeholder="예: AI 기반 자동 펫 급식기"
              autoFocus
            />
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <label className="block text-lg font-bold text-slate-900 mb-2 flex items-center">
              2. 해결하려는 과제 (Problem)
              <Tooltip text="기존 기술이나 제품의 문제점은 무엇인가요? 이 발명이 왜 필요한지를 설득하는 항목입니다." />
            </label>
            <p className="text-slate-500 text-sm mb-4">현재 불편한 점이나 개선하고 싶은 상황을 구체적으로 적어주세요.</p>
            <textarea
              value={formData.problem}
              onChange={(e) => handleChange('problem', e.target.value)}
              rows={6}
              className="w-full px-5 py-4 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"
              placeholder="예: 기존 급식기는 정해진 시간에만 사료가 나와서 반려동물의 컨디션을 고려하지 못함..."
              autoFocus
            />
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <label className="block text-lg font-bold text-slate-900 mb-2 flex items-center">
              3. 해결 수단 (Solution)
              <Tooltip text="문제점을 해결하기 위한 구체적인 기술적 구성입니다. '센서', '제어부', '통신모듈' 등 부품이나 단계로 설명하세요." />
            </label>
            <p className="text-slate-500 text-sm mb-4">어떤 기술이나 구조를 이용해 문제를 해결하나요?</p>
            <textarea
              value={formData.solution}
              onChange={(e) => handleChange('solution', e.target.value)}
              rows={6}
              className="w-full px-5 py-4 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"
              placeholder="예: 카메라로 반려동물의 활동량을 분석하는 AI 모듈과, 이를 기반으로 사료 양을 조절하는 제어 장치를 포함함..."
              autoFocus
            />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <label className="block text-lg font-bold text-slate-900 mb-2 flex items-center">
              4. 발명의 효과 (Effect)
              <Tooltip text="이 기술을 통해 얻을 수 있는 이점입니다. '비용 절감', '효율 상승', '사용자 편의성 증대' 등을 기재합니다." />
            </label>
            <p className="text-slate-500 text-sm mb-4">이 발명을 사용하면 무엇이 좋아지나요?</p>
            <textarea
              value={formData.effect}
              onChange={(e) => handleChange('effect', e.target.value)}
              rows={6}
              className="w-full px-5 py-4 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"
              placeholder="예: 반려동물의 비만을 예방하고, 보호자가 없어도 체계적인 식단 관리가 가능함..."
              autoFocus
            />
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <label className="block text-lg font-bold text-slate-900 mb-2 flex items-center">
              5. 도면 및 참고자료
              <Tooltip text="손으로 그린 스케치, 설계도, 흐름도 등 발명을 설명할 수 있는 시각 자료입니다." />
            </label>
            <p className="text-slate-500 text-sm mb-4">발명의 이해를 돕는 이미지가 있다면 첨부해주세요. (선택)</p>
            <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all relative cursor-pointer bg-slate-50">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              <div className="space-y-1 text-center">
                {formData.fileName ? (
                  <div className="flex flex-col items-center text-indigo-600">
                    <File size={32} className="mb-2" />
                    <span className="text-sm font-bold">{formData.fileName}</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center font-medium">
                      <span className="text-indigo-600 hover:text-indigo-500">파일 업로드</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10 bg-slate-900 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10">
           <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                   <FileText className="text-white" size={24} />
                </div>
                <div>
                   <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">Total Progress</p>
                   <h3 className="text-2xl font-bold">아이디어 구체화</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-extrabold text-white">25<span className="text-xl text-indigo-300 ml-1">%</span></div>
                <p className="text-xs text-slate-400 font-medium">Step 1 of 4</p>
              </div>
           </div>

           <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                 <span className="flex items-center text-slate-300">
                   <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                   현재 질문: {['발명의 명칭', '해결 과제', '해결 수단', '발명 효과', '도면 첨부'][step-1]}
                 </span>
                 <span className="text-indigo-300">{Math.round((step/5)*100)}% 완료</span>
              </div>
              <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${(step / 5) * 100}%` }}
                >
                   <div className="w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQgMHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')]"></div>
                </div>
              </div>
           </div>
         </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[400px] flex flex-col justify-between relative">
        <div>
          {renderStepContent()}

          {error && (
            <div className="mt-4 flex items-center text-red-500 text-sm font-bold animate-pulse">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={prevStep}
            className={`px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center ${step === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft size={18} className="mr-2" />
            이전
          </button>
          
          {step < 5 ? (
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg flex items-center"
            >
              다음 질문
              <ChevronRight size={18} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center"
            >
              분석 시작하기
              <ChevronRight size={18} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};