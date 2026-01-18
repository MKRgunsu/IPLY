import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { getChatSession, saveChatSession } from '../services/storage';
import { Attorney, ChatMessage } from '../types';
import { Send, ArrowLeft, MoreVertical, ShieldCheck, Lock } from 'lucide-react';

export const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
        <button className="text-slate-400 hover:text-slate-900">
          <MoreVertical size={20} />
        </button>
      </div>

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
    </div>
  );
};