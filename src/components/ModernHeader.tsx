'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#0B1220]/95 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-white">LifeUndo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Тарифы
            </Link>
            <Link href="/fund" className="text-gray-300 hover:text-white transition-colors">
              Фонд
            </Link>
            <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
              Поддержка
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Приватность
            </Link>
          </nav>

          {/* CTA Buttons and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Link 
              href="/download" 
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Скачать
            </Link>
            <Link 
              href="/pricing" 
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Купить VIP
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Тарифы
              </Link>
              <Link href="/fund" className="text-gray-300 hover:text-white transition-colors">
                Фонд
              </Link>
              <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                Поддержка
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                Приватность
              </Link>
              <div className="pt-4 space-y-2">
                <LanguageSwitcher />
                <Link 
                  href="/download" 
                  className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Скачать
                </Link>
                <Link 
                  href="/pricing" 
                  className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-center"
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
