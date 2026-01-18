import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Attorney } from '../types';
import { Star, MessageCircle, MapPin, Plus, Scale, X, Phone, User, Search, Filter } from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';

export const AttorneyList: React.FC = () => {
  const navigate = useNavigate();
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [filteredAttorneys, setFilteredAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Comparison & Add State
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Add Form State
  const [newAttorney, setNewAttorney] = useState({
    name: '',
    firm: '',
    specialty: '',
    career: ''
  });

  useEffect(() => {
    fetchAttorneys();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAttorneys(attorneys);
    } else {
      const lowerQuery = searchTerm.toLowerCase();
      const filtered = attorneys.filter(a => 
        a.name.toLowerCase().includes(lowerQuery) || 
        a.firm.toLowerCase().includes(lowerQuery) ||
        a.specialty.some(s => s.toLowerCase().includes(lowerQuery))
      );
      setFilteredAttorneys(filtered);
    }
  }, [searchTerm, attorneys]);

  const fetchAttorneys = () => {
    setLoading(true);
    api.getAttorneys().then(data => {
      setAttorneys(data);
      setFilteredAttorneys(data);
      setLoading(false);
    });
  };

  const handleChatRequest = (attorney: Attorney) => {
    setSelectedAttorney(attorney);
  };

  const handlePaymentComplete = () => {
    if (selectedAttorney) {
      navigate(`/chat/${selectedAttorney.id}`);
    }
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id].slice(0, 3)
    );
  };

  const handleAddAttorney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttorney.name || !newAttorney.firm) return;

    await api.addAttorney({
      name: newAttorney.name,
      firm: newAttorney.firm,
      specialty: newAttorney.specialty.split(',').map(s => s.trim()),
      career: newAttorney.career.split(',').map(s => s.trim()),
      imageUrl: `https://picsum.photos/200/200?random=${Date.now()}`,
      status: 'online',
      rating: 5.0,
      reviewCount: 0,
      consultationOptions: [
        { type: 'chat', price: 30000, duration: 30 },
        { type: 'phone', price: 50000, duration: 20 },
        { type: 'visit', price: 150000, duration: 60 }
      ]
    });

    setShowAddModal(false);
    setNewAttorney({ name: '', firm: '', specialty: '', career: '' });
    fetchAttorneys();
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR').format(price) + '원';

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 animate-fade-in relative pb-32">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">전문가 매칭</h2>
        <p className="text-slate-500 text-lg font-medium mb-6">검증된 변리사를 검색하고 비교해보세요.</p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium transition-shadow"
            placeholder="이름, 사무소, 전문분야(예: IT, 바이오) 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button className="p-2 text-slate-400 hover:text-indigo-600">
               <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
         <button 
           onClick={() => setShowAddModal(true)}
           className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center shadow-md"
         >
           <Plus size={16} className="mr-2" />
           전문가 등록 (Demo)
         </button>
      </div>

      {loading ? (
        <div className="grid gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-56 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredAttorneys.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
           <p className="text-slate-500 font-bold">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredAttorneys.map((attorney) => (
            <div key={attorney.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-8 group relative">
              {/* Compare Checkbox */}
              <div className="absolute top-6 right-6">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={compareList.includes(attorney.id)}
                    onChange={() => toggleCompare(attorney.id)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-sm font-bold text-slate-500">비교함 담기</span>
                </label>
              </div>

              {/* Image & Status */}
              <div className="flex-shrink-0 relative self-start">
                <div className="w-24 h-24 overflow-hidden bg-slate-200 rounded-2xl shadow-inner">
                   <img 
                    src={attorney.imageUrl} 
                    alt={attorney.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <span className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-full ${
                  attorney.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                }`}>
                  {attorney.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2 pr-24">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{attorney.name}</h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1 font-medium">
                      <MapPin size={14} className="mr-1" />
                      {attorney.firm}
                    </div>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                    <Star size={14} className="text-yellow-500 fill-current mr-1" />
                    <span className="font-bold text-slate-900 text-sm">{attorney.rating}</span>
                    <span className="text-slate-400 text-xs ml-1 font-medium">({attorney.reviewCount})</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4 mt-4 flex-wrap">
                  {attorney.specialty.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg border border-indigo-100">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Consultation Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {attorney.consultationOptions.map((opt, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex flex-col items-center justify-center text-center">
                      <div className="text-slate-400 mb-1 flex items-center gap-1 uppercase text-xs font-bold">
                        {opt.type === 'chat' ? <MessageCircle size={14} /> : opt.type === 'phone' ? <Phone size={14} /> : <User size={14} />} 
                        <span className="ml-1">{opt.type}</span>
                      </div>
                      <div className="font-bold text-slate-900">{formatPrice(opt.price)}</div>
                      <div className="text-xs text-slate-500">{opt.duration}분</div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleChatRequest(attorney)}
                  className="w-full inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200"
                >
                  <MessageCircle size={16} className="mr-2" />
                  상담 신청하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Floating Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-2xl p-4 z-40 animate-slide-up">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-900">{compareList.length}명 선택됨</span>
              <button onClick={() => setCompareList([])} className="text-xs text-slate-500 underline">초기화</button>
            </div>
            <button 
              onClick={() => setShowCompareModal(true)}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center shadow-lg"
            >
              <Scale size={18} className="mr-2" />
              비교하기
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal (Keep existing logic) */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setShowCompareModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24}/></button>
            <h3 className="text-2xl font-bold text-slate-900 mb-8">전문가 상세 비교</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {attorneys.filter(a => compareList.includes(a.id)).map(attorney => (
                <div key={attorney.id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
                  <div className="flex flex-col items-center text-center mb-6">
                    <img src={attorney.imageUrl} alt={attorney.name} className="w-24 h-24 rounded-full mb-3 object-cover shadow-md" />
                    <h4 className="text-xl font-bold text-slate-900">{attorney.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{attorney.firm}</p>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-bold text-slate-400 text-xs mb-1">전문 분야</p>
                      <p className="font-bold text-slate-800">{attorney.specialty.join(', ')}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 text-xs mb-1">경력 사항</p>
                      <ul className="text-slate-700 space-y-1">
                        {attorney.career.map((c, i) => <li key={i}>• {c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 text-xs mb-2">상담 비용</p>
                      <div className="space-y-2">
                        {attorney.consultationOptions.map((opt, i) => (
                          <div key={i} className="flex justify-between bg-white p-2 rounded border border-slate-100">
                             <span className="uppercase text-xs font-bold text-slate-500">{opt.type}</span>
                             <span className="font-bold text-indigo-600">{formatPrice(opt.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Attorney Modal (Keep existing logic) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="bg-white rounded-3xl w-full max-w-md p-8 relative animate-slide-up">
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24}/></button>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">전문가 등록 (Mock)</h3>
              <form onSubmit={handleAddAttorney} className="space-y-4">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">이름</label>
                   <input 
                     className="w-full p-3 border border-slate-300 rounded-xl" 
                     value={newAttorney.name}
                     onChange={e => setNewAttorney({...newAttorney, name: e.target.value})}
                     placeholder="홍길동 변리사"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">소속 사무소</label>
                   <input 
                     className="w-full p-3 border border-slate-300 rounded-xl" 
                     value={newAttorney.firm}
                     onChange={e => setNewAttorney({...newAttorney, firm: e.target.value})}
                     placeholder="특허법인 예시"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">전문 분야 (쉼표 구분)</label>
                   <input 
                     className="w-full p-3 border border-slate-300 rounded-xl" 
                     value={newAttorney.specialty}
                     onChange={e => setNewAttorney({...newAttorney, specialty: e.target.value})}
                     placeholder="IT, BM, 기계"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">주요 이력 (쉼표 구분)</label>
                   <input 
                     className="w-full p-3 border border-slate-300 rounded-xl" 
                     value={newAttorney.career}
                     onChange={e => setNewAttorney({...newAttorney, career: e.target.value})}
                     placeholder="서울대 졸업, 삼성전자 경력"
                   />
                 </div>
                 <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 mt-4">
                   등록하기
                 </button>
              </form>
           </div>
        </div>
      )}

      {selectedAttorney && (
        <PaymentModal 
          serviceName={`${selectedAttorney.name} 1:1 상담`}
          price={30000}
          onClose={() => setSelectedAttorney(null)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};