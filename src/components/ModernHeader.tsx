'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ModernHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие меню при клике вне или Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('header')) {
        setIsMenuOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#0B1220]/95 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/ru" className="flex items-center gap-2" aria-label="GetLifeUndo">
            <Image
              src="/brand/getlifeundo-round.png"
              width={28}
              height={28}
              alt="GetLifeUndo logo"
              className="rounded-full"
              priority
            />
            <span className="font-semibold">GetLifeUndo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/ru/features" className="text-gray-300 hover:text-white transition-colors">
              Функции
            </Link>
            <Link href="/ru/use-cases" className="text-gray-300 hover:text-white transition-colors">
              Кейсы
            </Link>
            <Link href="/ru/pricing" className="text-gray-300 hover:text-white transition-colors">
              Тарифы
            </Link>
            <Link href="/ru/fund" className="text-gray-300 hover:text-white transition-colors">
              Фонд
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/ru/download" 
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Скачать
            </Link>
            <Link 
              href="/ru/pricing" 
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Купить VIP
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
        )}
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 relative z-50 bg-[#0B1220]">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/ru/features" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Функции
              </Link>
              <Link 
                href="/ru/use-cases" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Кейсы
              </Link>
              <Link 
                href="/ru/pricing" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Тарифы
              </Link>
              <Link 
                href="/ru/fund" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Фонд
              </Link>
              <div className="pt-4 space-y-2">
                <Link 
                  href="/ru/download" 
                  className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Скачать
                </Link>
                <Link 
                  href="/ru/pricing" 
                  className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Купить VIP
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}