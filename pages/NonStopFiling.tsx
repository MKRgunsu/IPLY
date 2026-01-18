import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdea } from '../services/storage';
import { CheckCircle, Shield, FileCheck, ArrowRight, Loader2, AlertCircle, PenTool, Printer, Mail, Phone, FileText, CheckSquare, User, Building, Lock, Users, Eye, UserPlus, Briefcase, Plus, Trash2, ChevronLeft } from 'lucide-react';
import { SignaturePad } from '../components/SignaturePad';
import { PaymentModal } from '../components/PaymentModal';

// Sub-steps for the filing process
type FilingStep = 'applicant_info' | 'application_check' | 'privacy' | 'delegation' | 'signing' | 'processing' | 'done' | 'attorney_view';

// Types for dynamic inputs
interface JointApplicant {
  name: string;
  customerNumber: string;
  shareRatio: string;
}

interface Inventor {
  name: string;
  residentNumber: string;
}

export const NonStopFiling: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FilingStep>('applicant_info');
  const [ideaTitle, setIdeaTitle] = useState('');
  
  // 1. Applicant Info (Main Owner)
  const [applicantInfo, setApplicantInfo] = useState({
    name: '',
    phone: '',
    email: '',
    affiliation: '',
    customerNumber: '', 
    notes: ''
  });

  // 2. Checklist Toggles
  const [appCheck, setAppCheck] = useState({
    isJoint: false,
    earlyPublication: false,
    hasLegalRep: false, 
    hasDifferentInventor: false 
  });
  
  // Dynamic Data Lists
  const [jointApplicants, setJointApplicants] = useState<JointApplicant[]>([
    { name: '', customerNumber: '', shareRatio: '50:50' }
  ]);

  const [inventors, setInventors] = useState<Inventor[]>([
    { name: '', residentNumber: '' }
  ]);

  // Legal Representative Data (Usually singular)
  const [legalRepInfo, setLegalRepInfo] = useState({
    name: '',
    relation: '',
    residentNumber: ''
  });

  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [delegationType, setDelegationType] = useState<'general' | 'individual'>('general');
  const [signature, setSignature] = useState<string | null>(null);

  // Payment State
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const idea = getIdea();
    if (idea) {
      setIdeaTitle(idea.title);
    }
  }, [navigate]);

  // Handlers for Dynamic Lists
  const addJointApplicant = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJointApplicants([...jointApplicants, { name: '', customerNumber: '', shareRatio: '' }]);
  };

  const removeJointApplicant = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (jointApplicants.length > 1) {
      setJointApplicants(jointApplicants.filter((_, i) => i !== index));
    }
  };

  const updateJointApplicant = (index: number, field: keyof JointApplicant, value: string) => {
    const newDeep = [...jointApplicants];
    newDeep[index][field] = value;
    setJointApplicants(newDeep);
  };

  const addInventor = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInventors([...inventors, { name: '', residentNumber: '' }]);
  };

  const removeInventor = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (inventors.length > 1) {
      setInventors(inventors.filter((_, i) => i !== index));
    }
  };

  const updateInventor = (index: number, field: keyof Inventor, value: string) => {
    const newDeep = [...inventors];
    newDeep[index][field] = value;
    setInventors(newDeep);
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicantInfo(prev => ({ ...prev, [name]: value }));
  };

  const getFormProgress = () => {
    switch(currentStep) {
      case 'applicant_info': return 20;
      case 'application_check': return 40;
      case 'privacy': return 60;
      case 'delegation': return 80;
      case 'signing': return 90;
      case 'processing': return 95;
      case 'done': 
      case 'attorney_view': return 100;
      default: return 0;
    }
  };

  const nextStep = (target: FilingStep) => {
    // Validation
    if (currentStep === 'applicant_info') {
      if (!applicantInfo.name || !applicantInfo.phone || !applicantInfo.email || !applicantInfo.customerNumber) {
        alert('필수 정보(이름, 연락처, 이메일, 특허고객번호)를 모두 입력해주세요.');
        return;
      }
    }
    if (currentStep === 'application_check') {
      if (appCheck.isJoint) {
         const isValid = jointApplicants.every(j => j.name && j.customerNumber);
         if (!isValid) { alert('공동 출원인 정보를 모두 입력해주세요.'); return; }
      }
      if (appCheck.hasLegalRep && !legalRepInfo.name) {
        alert('법정대리인 이름을 입력해주세요.');
        return;
      }
      if (appCheck.hasDifferentInventor) {
        const isValid = inventors.every(i => i.name && i.residentNumber);
        if (!isValid) { alert('발명자 정보를 모두 입력해주세요.'); return; }
      }
    }
    if (currentStep === 'privacy' && !agreedToPrivacy) {
      alert('개인정보 수집 및 이용에 동의해야 진행할 수 있습니다.');
      return;
    }
    setCurrentStep(target);
    window.scrollTo(0, 0);
  };

  const handleSignatureEnd = (dataUrl: string | null) => {
    setSignature(dataUrl);
  };

  // Trigger Payment Modal instead of direct submission
  const handleSignComplete = () => {
    if (!signature) return;
    setShowPayment(true);
  };

  // Called after payment success
  const handlePaymentComplete = () => {
    setShowPayment(false);
    setCurrentStep('processing');
    setTimeout(() => {
      setCurrentStep('done');
    }, 2500);
  };

  // --- RENDER HELPERS ---
  const renderCombinedProgressBar = () => (
    <div className="mb-10 bg-slate-900 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-6">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <FileText className="text-white" size={24} />
             </div>
             <div>
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">Total Progress</p>
                <h3 className="text-2xl font-bold">전체 출원 진행률</h3>
             </div>
           </div>
           <div className="text-right">
             <div className="text-4xl font-extrabold text-white">85<span className="text-xl text-indigo-300 ml-1">%</span></div>
             <p className="text-xs text-slate-400 font-medium">Step 3 of 4</p>
           </div>
        </div>
        <div className="space-y-3">
           <div className="flex justify-between items-center text-sm font-bold">
              <span className="flex items-center text-slate-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                현재 작업: 특허출원서 작성
              </span>
              <span className="text-indigo-300">{getFormProgress()}% 완료</span>
           </div>
           <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
             <div 
               className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
               style={{ width: `${getFormProgress()}%` }}
             >
                <div className="w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQgMHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')]"></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  // 1. Full Screen Attorney Detail Report (Final View)
  if (currentStep === 'attorney_view') {
    return (
      <div className="min-h-screen bg-slate-100 py-12 px-4 animate-fade-in">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-300 print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-slate-900 text-white p-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">수임 변리사 배정 및 심사 통지</h1>
              <p className="text-slate-400 text-sm font-mono">Document No. 2026-IPLY-0082</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-bold text-lg">IPLY Legal Service</p>
              <p className="text-slate-400 text-sm">2026.05.24 Issued</p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Deficiency Check Warning Box */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-10">
               <h3 className="text-orange-900 font-bold text-lg mb-2 flex items-center">
                 <AlertCircle className="mr-2"/> 예비 심사 안내 (Deficiency Check)
               </h3>
               <p className="text-orange-800 text-sm leading-relaxed">
                 귀하의 출원서는 특허청 제출 전 담당 변리사의 <strong>방식 심사 및 기재 불비 검토</strong>를 거치게 됩니다.<br/>
                 명세서 내용에 법적 하자가 발견될 경우, 24시간 이내에 등록된 연락처로 <strong>보정 요청</strong>이 발송될 수 있습니다.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Attorney Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6">담당 변리사 정보</h3>
                <div className="flex gap-6 mb-6">
                  <div className="w-32 h-40 bg-slate-200 overflow-hidden shadow-md">
                    <img src="https://picsum.photos/200/200?random=1" alt="Attorney" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-2xl font-bold text-slate-900">김시연 변리사</div>
                    <div className="text-indigo-600 font-bold">특허법인 IPLY</div>
                    <div className="text-sm text-slate-500">대한변리사회 정회원 (등록 제 1092호)</div>
                  </div>
                </div>
                <div className="space-y-4 text-sm">
                   <div className="flex items-center"><span className="w-24 font-bold text-slate-500">이메일</span><span>siyeon.kim@iply.law</span></div>
                   <div className="flex items-center"><span className="w-24 font-bold text-slate-500">전화</span><span>02-555-1234</span></div>
                </div>
              </div>

              {/* Right Column: Filing Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6">출원 정보</h3>
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                     <div className="text-xs font-bold text-slate-500 mb-1">발명의 명칭</div>
                     <div className="text-lg font-bold text-slate-900 mb-4">{ideaTitle}</div>
                     <div className="text-xs font-bold text-slate-500 mb-1">출원인</div>
                     <div className="font-bold text-slate-900 mb-4">{applicantInfo.name}</div>
                     <div className="text-xs font-bold text-slate-500 mb-1">특허고객번호</div>
                     <div className="font-mono text-slate-900">{applicantInfo.customerNumber}</div>
                     <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                        <span className="text-slate-500">공동출원: {appCheck.isJoint ? `${jointApplicants.length}명 추가` : 'N'}</span>
                        <span className="text-slate-500">조기공개: {appCheck.earlyPublication ? 'Y' : 'N'}</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200 flex justify-center gap-4">
              <button onClick={() => window.print()} className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 flex items-center">
                <Printer size={18} className="mr-2" /> 통지서 인쇄
              </button>
              <button onClick={() => navigate('/')} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
                확인 (홈으로)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Process Layout
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in relative pb-32">
      {/* Show progress bar unless submitting */}
      {currentStep !== 'processing' && currentStep !== 'done' && renderCombinedProgressBar()}

      {/* --- Step 1: Applicant Information --- */}
      {currentStep === 'applicant_info' && (
        <div className="animate-slide-up">
           <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-slate-900">출원인(소유권자) 정보 입력</h2>
             <p className="text-slate-500">특허권의 주인이 될 출원인의 정확한 정보를 입력해주세요.</p>
           </div>
           
           <div className="bg-white p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><User size={16} className="mr-1"/> 이름 (국문) <span className="text-red-500">*</span></label>
                  <input name="name" value={applicantInfo.name} onChange={handleInfoChange} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="홍길동" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Building size={16} className="mr-1"/> 소속 (선택)</label>
                  <input name="affiliation" value={applicantInfo.affiliation} onChange={handleInfoChange} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="주식회사 아이플리" />
                </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Shield size={16} className="mr-1"/> 특허고객번호 <span className="text-red-500">*</span></label>
                <input name="customerNumber" value={applicantInfo.customerNumber} onChange={handleInfoChange} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 2026-1234567-89" />
                <p className="text-xs text-indigo-600 mt-1 font-bold">* 특허청(특허로)에서 발급받은 번호가 필요합니다.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Phone size={16} className="mr-1"/> 휴대전화 <span className="text-red-500">*</span></label>
                  <input name="phone" value={applicantInfo.phone} onChange={handleInfoChange} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="010-0000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Mail size={16} className="mr-1"/> 이메일 <span className="text-red-500">*</span></label>
                  <input name="email" value={applicantInfo.email} onChange={handleInfoChange} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="hong@example.com" />
                </div>
             </div>

             <div className="pt-4 flex gap-4">
                <button onClick={() => navigate('/')} className="flex-none px-6 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 flex items-center justify-center"><ChevronLeft /></button>
                <button onClick={() => nextStep('application_check')} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg">다음: 출원 세부 사항</button>
             </div>
           </div>
        </div>
      )}

      {/* --- Step 2: Application Checklist --- */}
      {currentStep === 'application_check' && (
         <div className="animate-slide-up">
            <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-slate-900">출원 세부 사항 체크</h2>
             <p className="text-slate-500">특허출원서에 기재될 필수 항목을 확인합니다.</p>
           </div>
           
           <div className="bg-white p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 space-y-4">
              
              {/* 1. Joint Applicant */}
              <div 
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${appCheck.isJoint ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => setAppCheck(prev => ({ ...prev, isJoint: !prev.isJoint }))}
              >
                 <div className="flex items-center justify-between">
                   <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${appCheck.isJoint ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                         <Users size={20}/>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900">공동 출원 (소유권 공유)</h4>
                         <p className="text-xs text-slate-500">출원인이 2인 이상인 경우 체크하세요.</p>
                      </div>
                   </div>
                   <div className={`w-6 h-6 rounded border flex items-center justify-center ${appCheck.isJoint ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                      {appCheck.isJoint && <CheckSquare size={14}/>}
                   </div>
                 </div>
                 {appCheck.isJoint && (
                   <div className="mt-4 pt-4 border-t border-indigo-200 space-y-3 animate-fade-in" onClick={e => e.stopPropagation()}>
                      {jointApplicants.map((applicant, index) => (
                        <div key={index} className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 relative">
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <input 
                                value={applicant.name}
                                onChange={e => updateJointApplicant(index, 'name', e.target.value)}
                                className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm" placeholder="공동출원인 성명"
                              />
                              <input 
                                value={applicant.customerNumber}
                                onChange={e => updateJointApplicant(index, 'customerNumber', e.target.value)}
                                className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm" placeholder="특허고객번호 (2026-..)"
                              />
                              <input 
                                value={applicant.shareRatio}
                                onChange={e => updateJointApplicant(index, 'shareRatio', e.target.value)}
                                className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm" placeholder="지분율 (50:50)"
                              />
                           </div>
                           {jointApplicants.length > 1 && (
                             <button 
                               onClick={(e) => removeJointApplicant(e, index)}
                               className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200"
                             >
                               <Trash2 size={14} />
                             </button>
                           )}
                        </div>
                      ))}
                      <button onClick={addJointApplicant} className="w-full py-2 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 flex items-center justify-center">
                        <Plus size={16} className="mr-1" /> 공동 출원인 추가
                      </button>
                   </div>
                 )}
              </div>

              {/* 2. Legal Representative (For Minors) */}
              <div 
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${appCheck.hasLegalRep ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => setAppCheck(prev => ({ ...prev, hasLegalRep: !prev.hasLegalRep }))}
              >
                 <div className="flex items-center justify-between">
                   <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${appCheck.hasLegalRep ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                         <UserPlus size={20}/>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900">법정대리인 추가</h4>
                         <p className="text-xs text-slate-500">출원인이 미성년자이거나 피후견인인 경우 필요합니다.</p>
                      </div>
                   </div>
                   <div className={`w-6 h-6 rounded border flex items-center justify-center ${appCheck.hasLegalRep ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                      {appCheck.hasLegalRep && <CheckSquare size={14}/>}
                   </div>
                 </div>
                 {appCheck.hasLegalRep && (
                   <div className="mt-4 pt-4 border-t border-indigo-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in" onClick={e => e.stopPropagation()}>
                      <input 
                        value={legalRepInfo.name}
                        onChange={e => setLegalRepInfo({...legalRepInfo, name: e.target.value})}
                        className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm" placeholder="법정대리인 성명"
                      />
                      <input 
                        value={legalRepInfo.relation}
                        onChange={e => setLegalRepInfo({...legalRepInfo, relation: e.target.value})}
                        className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm" placeholder="관계 (예: 부, 모)"
                      />
                      <input 
                        value={legalRepInfo.residentNumber}
                        onChange={e => setLegalRepInfo({...legalRepInfo, residentNumber: e.target.value})}
                        className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm" placeholder="주민번호 앞자리"
                      />
                   </div>
                 )}
              </div>

              {/* 3. Inventor Addition */}
              <div 
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${appCheck.hasDifferentInventor ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => setAppCheck(prev => ({ ...prev, hasDifferentInventor: !prev.hasDifferentInventor }))}
              >
                 <div className="flex items-center justify-between">
                   <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${appCheck.hasDifferentInventor ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                         <Briefcase size={20}/>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900">발명자 추가 (소유권자 외)</h4>
                         <p className="text-xs text-slate-500">실제 발명자가 출원인(소유권자)과 다른 경우 입력하세요.</p>
                      </div>
                   </div>
                   <div className={`w-6 h-6 rounded border flex items-center justify-center ${appCheck.hasDifferentInventor ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                      {appCheck.hasDifferentInventor && <CheckSquare size={14}/>}
                   </div>
                 </div>
                 {appCheck.hasDifferentInventor && (
                   <div className="mt-4 pt-4 border-t border-indigo-200 space-y-3 animate-fade-in" onClick={e => e.stopPropagation()}>
                      {inventors.map((inv, index) => (
                        <div key={index} className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 relative">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input 
                                value={inv.name}
                                onChange={e => updateInventor(index, 'name', e.target.value)}
                                className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm" placeholder="발명자 성명"
                              />
                              <input 
                                value={inv.residentNumber}
                                onChange={e => updateInventor(index, 'residentNumber', e.target.value)}
                                className="w-full p-2 bg-white border border-indigo-300 rounded-lg text-sm" placeholder="주민번호 (필수)"
                              />
                           </div>
                           {inventors.length > 1 && (
                             <button 
                               onClick={(e) => removeInventor(e, index)}
                               className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200"
                             >
                               <Trash2 size={14} />
                             </button>
                           )}
                        </div>
                      ))}
                      <button onClick={addInventor} className="w-full py-2 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 flex items-center justify-center">
                        <Plus size={16} className="mr-1" /> 발명자 추가
                      </button>
                   </div>
                 )}
              </div>

              {/* 4. Early Publication */}
              <div 
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col ${appCheck.earlyPublication ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => setAppCheck(prev => ({ ...prev, earlyPublication: !prev.earlyPublication }))}
              >
                 <div className="flex items-center justify-between w-full">
                   <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${appCheck.earlyPublication ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                         <Eye size={20}/>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900">조기 공개 신청</h4>
                         <p className="text-xs text-slate-500">출원 후 1년 6개월 전이라도 기술을 공개합니다.</p>
                      </div>
                   </div>
                   <div className={`w-6 h-6 rounded border flex items-center justify-center ${appCheck.earlyPublication ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                      {appCheck.earlyPublication && <CheckSquare size={14}/>}
                   </div>
                 </div>
                 {appCheck.earlyPublication && (
                   <div className="mt-3 text-xs text-red-500 font-bold ml-14">
                     * 주의: 조기 공개 신청 시 출원일로부터 약 1개월 후 기술 내용이 대중에게 공개됩니다. 취소할 수 없습니다.
                   </div>
                 )}
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setCurrentStep('applicant_info')} className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">이전</button>
                <button onClick={() => nextStep('privacy')} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg">다음: 약관 동의</button>
              </div>
           </div>
         </div>
      )}

      {/* --- Step 3: Privacy Consent --- */}
      {currentStep === 'privacy' && (
        <div className="animate-slide-up">
          <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-slate-900">개인정보 수집 및 이용 동의</h2>
             <p className="text-slate-500">안전한 특허 출원을 위해 약관에 동의해주세요.</p>
           </div>
           
           <div className="bg-white p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-64 overflow-y-auto mb-6 text-sm text-slate-600 leading-relaxed custom-scrollbar">
                <h4 className="font-bold text-slate-900 mb-2">[개인정보 수집 및 이용 동의서]</h4>
                <p className="mb-4">
                  IPLY(이하 '회사')는 특허 출원 대리 업무 수행을 위해 아래와 같이 개인정보를 수집 및 이용합니다.
                </p>
                <p className="mb-2 font-bold text-slate-800">1. 수집하는 개인정보 항목</p>
                <p className="mb-4">- 성명, 전화번호, 이메일, 주소, 소속, 특허고객번호 (발명자 및 대리인 포함)</p>
                <p className="mb-2 font-bold text-slate-800">2. 수집 및 이용 목적</p>
                <p className="mb-4">
                  - 특허청 출원 서류 작성 및 제출 대행<br/>
                  - 사건 진행 상황 통지 및 결과 보고<br/>
                  - 고객 상담 및 민원 처리
                </p>
                <p className="mb-2 font-bold text-slate-800">3. 보유 및 이용 기간</p>
                <p className="mb-4">- 위임 사무 종료 시까지 (단, 법령에 특별한 규정이 있는 경우 관련 법령에 따름)</p>
                <p className="mb-4 text-xs text-slate-400">* 귀하는 개인정보 수집 및 이용에 동의하지 않을 권리가 있으나, 동의 거부 시 서비스 이용이 제한될 수 있습니다.</p>
              </div>

              <div className="flex items-center mb-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 cursor-pointer" onClick={() => setAgreedToPrivacy(!agreedToPrivacy)}>
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${agreedToPrivacy ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                   {agreedToPrivacy && <CheckCircle size={14} />}
                 </div>
                 <span className="font-bold text-slate-800 text-sm select-none">위 개인정보 수집 및 이용 약관에 동의합니다. (필수)</span>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep('application_check')} className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">이전</button>
                <button onClick={() => nextStep('delegation')} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg disabled:opacity-50" disabled={!agreedToPrivacy}>다음: 위임장 설정</button>
              </div>
           </div>
        </div>
      )}

      {/* --- Step 4: Delegation Type --- */}
      {currentStep === 'delegation' && (
        <div className="animate-slide-up">
          <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-slate-900">위임장 유형 선택</h2>
             <p className="text-slate-500">대리인 권한 범위를 설정합니다.</p>
           </div>

           <div className="bg-white p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setDelegationType('general')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                      delegationType === 'general' 
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-lg text-slate-900 mb-2">포괄 위임장 (추천)</div>
                    <p className="text-sm text-slate-500 leading-relaxed">향후 발생하는 모든 특허 출원 및 중간 사건에 대해 대리권을 위임합니다. 매번 위임장을 작성할 필요가 없습니다.</p>
                    {delegationType === 'general' && <div className="absolute top-4 right-4 text-indigo-600"><CheckCircle /></div>}
                  </button>
                  <button
                    onClick={() => setDelegationType('individual')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                      delegationType === 'individual' 
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-lg text-slate-900 mb-2">개별 위임장</div>
                    <p className="text-sm text-slate-500 leading-relaxed">이번 <strong>"{ideaTitle}"</strong> 출원 건에 대해서만 대리권을 위임합니다. 추후 다른 건 진행 시 다시 작성해야 합니다.</p>
                    {delegationType === 'individual' && <div className="absolute top-4 right-4 text-indigo-600"><CheckCircle /></div>}
                  </button>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep('privacy')} className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">이전</button>
                <button onClick={() => nextStep('signing')} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg">다음: 전자 서명</button>
              </div>
           </div>
        </div>
      )}

      {/* --- Step 5: Signing --- */}
      {currentStep === 'signing' && (
        <div className="bg-white p-8 md:p-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 animate-slide-up">
           <div className="text-center mb-6">
             <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mb-4">
               <PenTool size={24} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">전자 서명 날인</h3>
             <p className="text-slate-500">위임장 내용에 최종 서명합니다.</p>
           </div>

           <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl h-48 overflow-y-auto mb-6 text-sm text-slate-700 leading-relaxed font-serif">
             <h4 className="font-bold text-center mb-4 text-lg">[ 위 임 장 ]</h4>
             <p className="mb-2"><strong>수임인:</strong> 특허법인 IPLY (김시연 변리사)</p>
             <p className="mb-2"><strong>위임인:</strong> {applicantInfo.name} ({applicantInfo.customerNumber})</p>
             <p className="mb-4"><strong>대상:</strong> {ideaTitle}</p>
             <p className="mb-2"><strong>특이사항:</strong> 
                {appCheck.isJoint ? ` 공동출원(${jointApplicants.length}명), ` : ''}
                {appCheck.earlyPublication ? ' 조기공개' : ''}
             </p>
             <p>본인은 상기 대리인에게 특허 출원 및 관련 절차 일체에 대한 대리권을 위임합니다. ({delegationType === 'general' ? '포괄위임' : '개별위임'})</p>
           </div>

           <div className="border-t border-slate-200 pt-6">
             <div className="flex items-center justify-between mb-4">
               <span className="font-bold text-slate-900">서명란 (정자로 입력하세요)</span>
               {signature && <span className="text-green-600 text-sm font-bold flex items-center"><CheckCircle size={14} className="mr-1"/> 서명 입력됨</span>}
             </div>

             {/* Signature Pad Component */}
             <SignaturePad onEnd={handleSignatureEnd} />
             
             <div className="mt-8 flex gap-4">
               <button onClick={() => setCurrentStep('delegation')} className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">
                 이전
               </button>
               <button 
                onClick={handleSignComplete} 
                disabled={!signature}
                className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
               >
                 <Lock size={16} className="mr-2" />
                 서명 완료 및 제출
               </button>
             </div>
           </div>
        </div>
      )}

      {currentStep === 'processing' && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 size={60} className="text-indigo-600 animate-spin mb-8" />
          <h3 className="text-2xl font-bold mb-4 text-slate-900">특허청(KIPO) 서버와 통신 중</h3>
          <p className="text-slate-500 mb-2 font-medium">위임장 및 명세서(XML)를 암호화 전송하고 있습니다.</p>
        </div>
      )}

      {currentStep === 'done' && (
        <div className="text-center py-10 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-8 shadow-lg">
            <FileCheck size={40} />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">출원서 제출 완료</h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
            접수번호: <span className="font-mono font-bold text-indigo-600">10-2026-0012345</span><br/>
            이제 담당 변리사가 최종 검토를 시작합니다.
          </p>
          
          <button 
            onClick={() => setCurrentStep('attorney_view')}
            className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center mx-auto"
          >
            변리사 배정 및 심사 통지서 확인
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      )}

      {showPayment && (
        <PaymentModal 
          serviceName="논스탑 특허 출원"
          price={99000}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};