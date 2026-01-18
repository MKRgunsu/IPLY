import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Attorney } from '../types';
import { Trash2, Save, Plus, LogOut, Settings, User } from 'lucide-react';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ id: '', pw: '' });
  
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [activeTab, setActiveTab] = useState<'attorneys' | 'stats'>('attorneys');

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    const data = await api.getAttorneys();
    setAttorneys(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.id === 'admin' && loginData.pw === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다. (힌트: admin / admin)');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updated = attorneys.filter(a => a.id !== id);
      setAttorneys(updated);
      await api.updateAttorneys(updated);
    }
  };

  const handleUpdate = async (id: string, field: keyof Attorney, value: any) => {
    const updated = attorneys.map(a => a.id === id ? { ...a, [field]: value } : a);
    setAttorneys(updated);
    // Auto-save logic could go here, but for now we rely on explicit save or state
    await api.updateAttorneys(updated);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">IPLY 관리자</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">관리자 ID</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-lg"
                value={loginData.id}
                onChange={e => setLoginData({...loginData, id: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">비밀번호</label>
              <input 
                type="password" 
                className="w-full p-3 border border-slate-300 rounded-lg"
                value={loginData.pw}
                onChange={e => setLoginData({...loginData, pw: e.target.value})}
              />
            </div>
            <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            <Settings className="mr-3" /> 관리자 대시보드
          </h1>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-red-500 hover:text-red-700 font-bold">
            <LogOut size={18} className="mr-1" /> 로그아웃
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('attorneys')}
              className={`px-6 py-4 font-bold text-sm ${activeTab === 'attorneys' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
            >
              변리사 관리
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-4 font-bold text-sm ${activeTab === 'stats' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
            >
              접속 통계 (Demo)
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'attorneys' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">등록된 전문가 정보를 실시간으로 수정할 수 있습니다.</p>
                  <button onClick={() => alert('전문가 등록은 메인 서비스 페이지의 [전문가 등록] 버튼을 이용해주세요.')} className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-100">
                    <Plus size={16} className="mr-1" /> 신규 등록 안내
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-4 py-3">이름</th>
                        <th className="px-4 py-3">소속</th>
                        <th className="px-4 py-3">전문분야</th>
                        <th className="px-4 py-3">상태</th>
                        <th className="px-4 py-3">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attorneys.map(attorney => (
                        <tr key={attorney.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">
                            <input 
                              className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none w-32"
                              value={attorney.name}
                              onChange={(e) => handleUpdate(attorney.id, 'name', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                             <input 
                              className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none w-40"
                              value={attorney.firm}
                              onChange={(e) => handleUpdate(attorney.id, 'firm', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="truncate block w-48 text-slate-500">{attorney.specialty.join(', ')}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => handleUpdate(attorney.id, 'status', attorney.status === 'online' ? 'offline' : 'online')}
                              className={`px-2 py-1 rounded text-xs font-bold ${attorney.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}
                            >
                              {attorney.status}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDelete(attorney.id)} className="text-red-400 hover:text-red-600 p-1">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Visitors</div>
                  <div className="text-3xl font-extrabold text-slate-900">12,450</div>
                  <div className="text-green-500 text-xs font-bold mt-1">▲ 12% increase</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs font-bold uppercase mb-2">Pending Applications</div>
                  <div className="text-3xl font-extrabold text-slate-900">8</div>
                  <div className="text-indigo-500 text-xs font-bold mt-1">Requires Action</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Revenue</div>
                  <div className="text-3xl font-extrabold text-slate-900">₩ 3.2M</div>
                  <div className="text-slate-400 text-xs font-bold mt-1">This Month</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};