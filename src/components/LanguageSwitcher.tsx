'use client';

import { useLanguage } from '@/lib/language-context';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex gap-2 border border-secondary-border rounded-md p-1">
      <button
        onClick={() => setLang('fr')}
        className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
          lang === 'fr'
            ? 'bg-primary-600 text-white'
            : 'text-secondary-gray hover:bg-secondary-surface'
        }`}
        aria-label="Switch to French"
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => setLang('ar')}
        className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
          lang === 'ar'
            ? 'bg-primary-600 text-white'
            : 'text-secondary-gray hover:bg-secondary-surface'
        }`}
        aria-label="Switch to Arabic"
      >
        🇸🇦 AR
      </button>
    </div>
  );
}
