import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Don't show header/footer on admin page
  const isAdminPage = location.pathname === '/admin';

  if (isAdminPage) {
    return <>{children}</>;
  }

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
              <Link to="/about" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-bold transition-colors">회사 소개</Link>
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
              <Link to="/about" onClick={toggleMenu} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-lg">회사 소개</Link>
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

      {/* Footer - Always Visible */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <span className="font-bold text-xl text-slate-900">IPLY</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                특허를 모두에게. 더 빠르고 편리한 특허 출원 서비스.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>특허법인 IPLY</p>
                <p>대표: 성두현</p>
                <p>사업자등록번호: 123-45-67890</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-slate-900 mb-3 text-sm">빠른 링크</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">회사 소개</Link></li>
                <li><Link to="/process" className="text-slate-600 hover:text-indigo-600 transition-colors">서비스 소개</Link></li>
                <li><Link to="/pricing" className="text-slate-600 hover:text-indigo-600 transition-colors">요금 안내</Link></li>
                <li><Link to="/attorneys" className="text-slate-600 hover:text-indigo-600 transition-colors">전문가 찾기</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-slate-900 mb-3 text-sm">고객지원</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/pricing" className="text-slate-600 hover:text-indigo-600 transition-colors">자주 묻는 질문</Link></li>
                <li><a href="mailto:support@iply.com" className="text-slate-600 hover:text-indigo-600 transition-colors">이메일 문의</a></li>
                <li><a href="tel:02-1234-5678" className="text-slate-600 hover:text-indigo-600 transition-colors">전화: 02-1234-5678</a></li>
                <li className="text-slate-500">평일 09:00 - 18:00</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-xs text-slate-400">
                &copy; 2026 IPLY Inc. All rights reserved.
              </p>

              {/* Legal Links */}
              <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
                <Link to="/pricing" className="hover:text-indigo-600 transition-colors">이용약관</Link>
                <Link to="/pricing" className="hover:text-indigo-600 transition-colors">개인정보처리방침</Link>
                <a href="https://www.kipo.go.kr" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">특허청</a>
                <Link to="/admin" className="hover:text-indigo-600 transition-colors opacity-30">관리자</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
