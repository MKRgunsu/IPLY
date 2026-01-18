import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">IPLY</span>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/process" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-bold transition-colors">서비스 소개</Link>
              <Link to="/pricing" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-bold transition-colors">요금 및 Q&A</Link>
              <Link to="/attorneys" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-bold transition-colors">전문가 찾기</Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-slate-500 hover:text-slate-900 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 absolute w-full">
            <div className="px-4 pt-4 pb-6 space-y-2 shadow-lg">
              <Link to="/process" onClick={toggleMenu} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-lg">서비스 소개</Link>
              <Link to="/pricing" onClick={toggleMenu} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-lg">요금 및 Q&A</Link>
              <Link to="/attorneys" onClick={toggleMenu} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-lg">전문가 찾기</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
              <p className="text-center text-xs text-gray-400">
                &copy; 2026 IPLY Inc. All rights reserved.
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-500 font-medium">
                <Link to="/pricing" className="cursor-pointer hover:text-indigo-600">자주 묻는 질문</Link>
                <span className="cursor-pointer hover:text-indigo-600">이용약관</span>
                <span className="cursor-pointer hover:text-indigo-600">개인정보처리방침</span>
                <Link to="/admin" className="cursor-pointer hover:text-indigo-600 ml-4 text-slate-300">관리자 로그인</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};