'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, AppLanguage, Translations } from '@/locales/translations';

interface LanguageContextType {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  t: Translations;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLang = 'ru' }: { children: ReactNode, initialLang?: AppLanguage }) {
  const [lang, setLangState] = useState<AppLanguage>(initialLang);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    try {
      const match = document.cookie.match(new RegExp('(^| )nexus_lang=([^;]+)'));
      if (match) {
        const cookieLang = match[2] as AppLanguage;
        if (cookieLang === 'ru' || cookieLang === 'en') {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLangState(cookieLang);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: AppLanguage) => {
    setLangState(newLang);
    try {
      document.cookie = `nexus_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  const t = translations[lang] || translations.ru;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
