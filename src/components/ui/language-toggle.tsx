'use client';

import React from 'react';
import { useTranslation } from '@/context/language-context';
import { Language } from '@/locales/translations';

export function LanguageToggle() {
  const { lang, setLanguage, isMounted } = useTranslation();

  // Prevent hydration mismatch by rendering a skeleton placeholder until mounted
  if (!isMounted) {
    return (
      <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-1">
        <div className="px-2.5 py-1 text-[10px] font-bold rounded-full text-transparent uppercase tracking-wider">RU</div>
        <div className="px-2.5 py-1 text-[10px] font-bold rounded-full text-transparent uppercase tracking-wider">EN</div>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-1">
      {(['ru', 'en'] as Language[]).map((l) => (
        <button
          type="button"
          key={l}
          onClick={() => setLanguage(l)}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider ${
            lang === l 
              ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
