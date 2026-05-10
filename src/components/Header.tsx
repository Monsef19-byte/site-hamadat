'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const { lang, direction } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: t(lang, 'nav.home') },
    { href: '/projets', label: t(lang, 'nav.projects') },
    { href: '/blog', label: lang === 'ar' ? 'المدونة' : 'Blog' },
    { href: '/contact', label: t(lang, 'nav.contact') },
    { href: '/about', label: t(lang, 'nav.about') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-3 font-semibold text-xl text-gray-900 dark:text-gray-50 ${
              direction === 'rtl' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded flex items-center justify-center text-white font-bold text-sm">
              H
            </div>
            <span>Hamadat</span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex items-center gap-8 ${
              direction === 'rtl' ? 'flex-row-reverse' : ''
            }`}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div
            className={`flex items-center gap-3 ${
              direction === 'rtl' ? 'flex-row-reverse' : ''
            }`}
          >
            <Link
              href="/dashboard"
              className="text-xs px-4 py-2 rounded-lg border border-primary-400 dark:border-primary-600 text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors font-medium hidden sm:inline-block"
            >
              {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </Link>
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-dark-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-1 border-t border-gray-200 dark:border-gray-800 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-primary-700 dark:text-primary-400 border border-primary-400 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-colors font-medium text-sm mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
