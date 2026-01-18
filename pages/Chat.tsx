import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { getChatSession, saveChatSession } from '../services/storage';
import { Attorney, ChatMessage } from '../types';
import { Send, ArrowLeft, MoreVertical, ShieldCheck, Lock, Paperclip, FileText, CheckCircle, X, Download, PenTool } from 'lucide-react';

export const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, size: number, type: string}>>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    api.getAttorneyById(id).then(data => {
      if (data) setAttorney(data);
      else navigate('/attorneys');
    });
    const history = getChatSession(id);
    setMessages(history);
  }, [id, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !id) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveChatSession(id, newMessages);
    setInput('');
    setIsTyping(true);

    const replyText = await api.generateBotResponse(input);
    
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'attorney',
      text: replyText,
      timestamp: Date.now()
    };

    setIsTyping(false);
    const updatedMessages = [...newMessages, botMsg];
    setMessages(updatedMessages);
    saveChatSession(id, updatedMessages);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Add system message
      const fileMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: `📎 파일 업로드: ${newFiles.map(f => f.name).join(', ')}`,
        timestamp: Date.now()
      };
      const updated = [...messages, fileMsg];
      setMessages(updated);
      if (id) saveChatSession(id, updated);
      setShowFileUpload(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleContractSign = () => {
    const contractMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: '✅ 전자계약서에 서명했습니다. (법적 효력 인정)',
      timestamp: Date.now()
    };
    const botReply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'attorney',
      text: '전자계약이 정상적으로 체결되었습니다. 계약서 사본이 등록하신 이메일로 발송되었습니다.',
      timestamp: Date.now() + 100
    };
    const updated = [...messages, contractMsg, botReply];
    setMessages(updated);
    if (id) saveChatSession(id, updated);
    setShowContractModal(false);
  };

  if (!attorney) return <div className="p-8 text-center font-medium text-slate-500">보안 연결 중...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 animate-fade-in">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate('/attorneys')} className="mr-4 text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="w-10 h-10 overflow-hidden bg-slate-100 rounded-full mr-3 border border-slate-100">
             <img src={attorney.imageUrl} alt={attorney.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">{attorney.name}</h3>
            <p className="text-xs text-indigo-600 font-bold flex items-center">
              <Lock size={10} className="mr-1" />
              E2E Encrypted
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFileUpload(!showFileUpload)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="파일 첨부"
          >
            <Paperclip size={20} />
          </button>
          <button 
            onClick={() => setShowContractModal(true)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="전자계약"
          >
            <FileText size={20} />
          </button>
          <button className="text-slate-400 hover:text-slate-900 p-2">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* File Upload Dropdown */}
      {showFileUpload && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-900 text-sm">파일 첨부</h4>
            <button onClick={() => setShowFileUpload(false)} className="text-slate-400 hover:text-slate-900">
              <X size={16} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.png,.zip"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 bg-white border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors"
          >
            + 파일 선택 (PDF, DOC, 이미지)
          </button>
          <p className="text-xs text-slate-500 mt-2">최대 10MB, 명세서 초안/도면 등을 공유할 수 있습니다.</p>
        </div>
      )}

      {/* Uploaded Files Bar */}
      {uploadedFiles.length > 0 && (
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
                <FileText size={14} className="mr-2 text-indigo-600" />
                <span className="font-medium text-slate-700 max-w-[150px] truncate">{file.name}</span>
                <button onClick={() => removeFile(idx)} className="ml-2 text-slate-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security & Telegram Banner */}
      <div className="bg-slate-800 px-4 py-3 text-center border-b border-slate-700 shadow-inner">
        <div className="flex items-center justify-center text-xs text-slate-300 font-medium mb-1">
          <ShieldCheck size={12} className="mr-1.5 text-green-400" />
          모든 대화는 256-bit 암호화되어 보호됩니다.
        </div>
        <div className="text-[10px] text-slate-500">
          *추후 변리사 연동 텔레그램(Telegram) API를 통해 실시간 답변을 받을 수 있습니다.
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="text-center mb-8">
           <span className="px-4 py-1.5 bg-slate-200 text-slate-500 text-xs rounded-full font-bold">
             2026년 법률 기준 상담이 시작되었습니다
           </span>
        </div>
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex mb-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'attorney' && (
               <div className="w-8 h-8 mr-3 flex-shrink-0 mt-1">
                  <img src={attorney.imageUrl} className="w-full h-full object-cover rounded-full shadow-sm" alt="avatar" />
               </div>
            )}
            <div className={`max-w-[75%] px-5 py-3 text-sm font-medium leading-relaxed shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-none'
            }`}>
              {msg.text}
              <div className={`text-[10px] mt-2 text-right font-bold opacity-70`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4 animate-fade-in">
             <div className="w-8 h-8 mr-3 flex-shrink-0">
                <img src={attorney.imageUrl} className="w-full h-full object-cover rounded-full" alt="avatar" />
             </div>
             <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지 입력 (보안 전송)"
            className="flex-1 px-5 py-3.5 bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 rounded-full text-slate-900 placeholder-slate-400 font-medium text-sm transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="p-3.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* E-Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">전자 상담 계약서</h3>
                  <p className="text-sm text-slate-500">전자서명법에 의거한 법적 효력 인정 문서</p>
                </div>
                <button onClick={() => setShowContractModal(false)} className="text-slate-400 hover:text-slate-900">
                  <X size={24} />
                </button>
              </div>

              {/* Contract Content */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6 h-64 overflow-y-auto text-sm leading-relaxed">
                <h4 className="font-bold text-center mb-4">특허 상담 위임 계약서</h4>
                <p className="mb-2"><strong>제1조 (목적)</strong></p>
                <p className="mb-4 text-slate-600">본 계약은 의뢰인(이하 '갑')과 변리사(이하 '을') 간의 특허 상담 서비스 제공에 관한 사항을 규정함을 목적으로 한다.</p>
                
                <p className="mb-2"><strong>제2조 (계약 기간)</strong></p>
                <p className="mb-4 text-slate-600">본 계약의 유효기간은 체결일로부터 30일간으로 한다.</p>
                
                <p className="mb-2"><strong>제3조 (서비스 내용)</strong></p>
                <p className="mb-4 text-slate-600">을은 갑에게 특허 출원 전략, 명세서 검토, 선행기술 조사 등의 상담 서비스를 제공한다.</p>
                
                <p className="mb-2"><strong>제4조 (비밀유지)</strong></p>
                <p className="mb-4 text-slate-600">을은 상담 과정에서 취득한 갑의 기술 정보 및 영업 비밀을 제3자에게 누설하지 않는다.</p>
                
                <p className="mb-2"><strong>제5조 (전자서명)</strong></p>
                <p className="text-slate-600">본 계약은 전자서명법 제3조에 따라 전자서명으로 체결되며, 서면 계약과 동일한 법적 효력을 가진다.</p>
              </div>

              {/* Signer Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <p className="text-xs text-indigo-600 font-bold mb-1">의뢰인 (갑)</p>
                  <p className="font-bold text-slate-900">홍길동</p>
                  <p className="text-sm text-slate-600">hong@example.com</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <p className="text-xs text-indigo-600 font-bold mb-1">변리사 (을)</p>
                  <p className="font-bold text-slate-900">{attorney.name}</p>
                  <p className="text-sm text-slate-600">{attorney.firm}</p>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="mb-6">
                <label className="flex items-start p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-indigo-600 rounded" required />
                  <div className="text-sm">
                    <p className="font-bold text-slate-900 mb-1">위 계약 내용을 모두 확인하였으며 동의합니다.</p>
                    <p className="text-xs text-slate-500">전자서명법에 의거하여 본 계약은 법적 효력을 가집니다.</p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowContractModal(false)}
                  className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  onClick={handleContractSign}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <PenTool size={18} />
                  전자서명 및 체결
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
