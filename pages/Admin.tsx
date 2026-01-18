import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Attorney } from '../types';
import { Trash2, Save, Plus, LogOut, Settings, User, Brain, Key, Eye, EyeOff } from 'lucide-react';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ id: '', pw: '' });
  
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [activeTab, setActiveTab] = useState<'attorneys' | 'stats' | 'ai-settings'>('attorneys');

  // AI Settings State
  const [aiSettings, setAiSettings] = useState({
    enabled: false,
    apiKey: 'AIzaSyDOdH_ptqRPzlyPZUNa0BD54YnyYsLkg7E',
    showKey: false
  });

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
      loadAISettings();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    const data = await api.getAttorneys();
    setAttorneys(data);
  };

  const loadAISettings = () => {
    const saved = localStorage.getItem('iply_ai_settings');
    if (saved) {
      setAiSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  };

  const saveAISettings = () => {
    localStorage.setItem('iply_ai_settings', JSON.stringify({
      enabled: aiSettings.enabled,
      apiKey: aiSettings.apiKey
    }));
    alert('AI 설정이 저장되었습니다.');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.id === 'admin' && loginData.pw === 'admin') {
      setIsLoggedIn(true);
      localStorage.setItem('iply_admin_logged_in', 'true');
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다. (힌트: admin / admin)');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('iply_admin_logged_in');
    navigate('/');
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
          <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 font-bold">
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
              onClick={() => setActiveTab('ai-settings')}
              className={`px-6 py-4 font-bold text-sm flex items-center gap-2 ${activeTab === 'ai-settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
            >
              <Brain size={16} />
              AI 설정
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-4 font-bold text-sm ${activeTab === 'stats' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
            >
              접속 통계 (Demo)
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'ai-settings' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-indigo-200">
                  <div className="flex items-center mb-4">
                    <Brain className="text-indigo-600 mr-3" size={24} />
                    <h3 className="text-xl font-bold text-slate-900">Google Gemini AI 설정</h3>
                  </div>
                  <p className="text-sm text-slate-600">실제 AI 분석 기능을 활성화하고 API 키를 관리합니다.</p>
                </div>

                {/* AI 활성화 토글 */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">AI 분석 활성화</h4>
                      <p className="text-sm text-slate-500">
                        비활성화 시 Mock 데이터를 사용합니다 (무료)
                      </p>
                    </div>
                    <button
                      onClick={() => setAiSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        aiSettings.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          aiSettings.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  {aiSettings.enabled && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-bold">
                        ✓ 실제 Google Gemini AI가 분석을 수행합니다
                      </p>
                    </div>
                  )}
                </div>

                {/* API Key 설정 */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Key className="text-indigo-600 mr-2" size={20} />
                    <h4 className="font-bold text-slate-900">Google API Key</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={aiSettings.showKey ? 'text' : 'password'}
                        value={aiSettings.apiKey}
                        onChange={e => setAiSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full p-3 pr-12 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50"
                        placeholder="AIzaSy..."
                      />
                      <button
                        onClick={() => setAiSettings(prev => ({ ...prev, showKey: !prev.showKey }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {aiSettings.showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Google AI Studio에서 발급받은 API 키를 입력하세요.
                    </p>
                  </div>
                </div>

                {/* 사용량 경고 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="font-bold text-yellow-900 mb-2">⚠️ API 사용량 안내</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• 무료 할당량: 분당 15회 요청</li>
                    <li>• 초과 시 요청이 차단되며 에러가 발생합니다</li>
                    <li>• 테스트 후 반드시 비활성화를 권장합니다</li>
                  </ul>
                </div>

                <button
                  onClick={saveAISettings}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  설정 저장
                </button>
              </div>
            )}

            {activeTab === 'attorneys' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">등록된 전문가 정보를 실시간으로 수정할 수 있습니다.</p>
                  <button onClick={() => alert('전문가 등록은 메인 서비스 페이지의 [전문가 등록] 버튼을 이용해주세요.')} className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-100">
                    <Plus size={16} className="mr-1" /> 신규 등록 안내
                  </button>
                </div>

                <div className="grid gap-6">
                  {attorneys.map(attorney => (
                    <div key={attorney.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-indigo-200 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <img src={attorney.imageUrl} alt={attorney.name} className="w-16 h-16 rounded-full object-cover" />
                          <div>
                            <input 
                              className="bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 mb-2 focus:border-indigo-500 outline-none"
                              value={attorney.name}
                              onChange={(e) => handleUpdate(attorney.id, 'name', e.target.value)}
                              placeholder="이름"
                            />
                            <input 
                              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 outline-none w-full"
                              value={attorney.firm}
                              onChange={(e) => handleUpdate(attorney.id, 'firm', e.target.value)}
                              placeholder="소속"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdate(attorney.id, 'status', attorney.status === 'online' ? 'offline' : 'online')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${attorney.status === 'online' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                          >
                            {attorney.status === 'online' ? '온라인' : '오프라인'}
                          </button>
                          <button onClick={() => handleDelete(attorney.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">전문 분야 (쉼표로 구분)</label>
                          <input 
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                            value={attorney.specialty.join(', ')}
                            onChange={(e) => handleUpdate(attorney.id, 'specialty', e.target.value.split(',').map(s => s.trim()))}
                            placeholder="IT/SW, BM특허, AI모델"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">경력 사항 (쉼표로 구분)</label>
                          <input 
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                            value={attorney.career.join(', ')}
                            onChange={(e) => handleUpdate(attorney.id, 'career', e.target.value.split(',').map(s => s.trim()))}
                            placeholder="KAIST 전산학 석사, 삼성전자 IP팀"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
