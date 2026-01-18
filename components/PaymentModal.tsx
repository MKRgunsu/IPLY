import React, { useState } from 'react';
import { Loader2, CreditCard, Lock, CheckCircle2, GraduationCap, Copy } from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
  onComplete: () => void;
  serviceName: string; // e.g., "김시연 변리사 상담" or "논스탑 출원"
  price: number;       // e.g., 30000 or 99000
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onComplete, serviceName, price }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isDiscountEligible, setIsDiscountEligible] = useState(false);

  const finalPrice = isDiscountEligible ? 0 : price;
  const formattedPrice = new Intl.NumberFormat('ko-KR').format(finalPrice);

  const handlePayment = () => {
    setStatus('processing');
    // Simulate payment processing time
    setTimeout(() => {
      setStatus('success');
      // Auto close after success
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('190884587688');
    alert('계좌번호가 복사되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={status === 'idle' ? onClose : undefined} />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {status === 'idle' && (
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">결제 및 접수</h3>
                <p className="text-slate-500 text-sm font-medium">서비스 이용을 위해 결제를 진행합니다.</p>
              </div>
              <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Secure</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-slate-500">이용 서비스</span>
                <span className="font-bold text-slate-900 text-right">{serviceName}</span>
              </div>
              <div className="h-px bg-slate-200 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-slate-900 font-bold">결제 금액</span>
                <div className="text-right">
                    {isDiscountEligible && <span className="block text-xs text-slate-400 line-through">{new Intl.NumberFormat('ko-KR').format(price)}원</span>}
                    <span className="text-2xl font-bold text-indigo-600">{formattedPrice}원</span>
                </div>
              </div>
            </div>

            {/* Discount Checkbox */}
            <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                    <input 
                        type="checkbox" 
                        checked={isDiscountEligible}
                        onChange={() => setIsDiscountEligible(!isDiscountEligible)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                    />
                    <div className="flex-1">
                        <span className="block font-bold text-slate-800 text-sm">할인 대상인가요?</span>
                        <span className="text-xs text-slate-500">KAIST CCE / POSTECH CEO 수강생</span>
                    </div>
                    <GraduationCap size={20} className="text-indigo-400" />
                </label>
            </div>

            {/* Account Info or Discount Info */}
            <div className="mb-8">
                {isDiscountEligible ? (
                    <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm border border-green-100">
                        <p className="font-bold mb-1">✅ 무료/할인 적용됨</p>
                        <p className="text-xs">서비스 시작 후 증빙서류(명함/명찰)를 제출해주세요.</p>
                    </div>
                ) : (
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-500 mb-2">무통장 입금 안내</p>
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 mb-2">
                             <div>
                                 <p className="font-bold text-slate-900">토스뱅크 1908-8458-7688</p>
                                 <p className="text-xs text-slate-500">예금주: 성두현</p>
                             </div>
                             <button onClick={copyToClipboard} className="text-indigo-600 hover:text-indigo-800 p-1">
                                 <Copy size={16}/>
                             </button>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">입금 확인 후 절차가 자동 진행됩니다.</p>
                    </div>
                )}
            </div>

            <div className="space-y-3">
              <button 
                onClick={handlePayment}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-200"
              >
                <CreditCard size={20} />
                {isDiscountEligible ? '무료로 진행하기' : '입금 완료 및 진행'}
              </button>
              <button 
                onClick={onClose}
                className="w-full text-slate-500 py-3 text-sm font-medium hover:text-slate-800 transition-colors"
              >
                취소하기
              </button>
            </div>
            
            <div className="mt-6 flex items-center justify-center text-xs text-slate-400 gap-1 font-medium">
              <Lock size={12} />
              <span>안전한 결제를 위해 256-bit 보안 연결을 사용합니다.</span>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 size={48} className="text-indigo-600 animate-spin mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isDiscountEligible ? '자격 확인 중...' : '입금 확인 중...'}
            </h3>
            <p className="text-slate-500 font-medium">잠시만 기다려주세요.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center bg-indigo-600 text-white">
            <CheckCircle2 size={64} className="text-white mb-6 animate-bounce" />
            <h3 className="text-2xl font-bold mb-2">처리 완료</h3>
            <p className="text-indigo-100 font-medium">다음 단계로 이동합니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};