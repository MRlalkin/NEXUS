'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DICTIONARIES, Language, Dictionary } from '@/locales/translations';

interface LanguageContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('ru');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      // First try localStorage
      let savedLang = localStorage.getItem('nexus_lang') as Language;
      // If not, try cookie
      if (!savedLang) {
        const match = document.cookie.match(new RegExp('(^| )nexus_lang=([^;]+)'));
        if (match) savedLang = match[2] as Language;
      }
      
      if (savedLang === 'ru' || savedLang === 'en') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(savedLang);
        // Ensure cookie is set
        document.cookie = `nexus_lang=${savedLang}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('nexus_lang', newLang);
      document.cookie = `nexus_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t: DICTIONARIES[lang], isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
