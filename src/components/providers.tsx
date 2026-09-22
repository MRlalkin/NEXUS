'use client';

import { LanguageProvider } from '@/context/language-context';
import { ReactNode } from 'react';
import { AppLanguage } from '@/locales/translations';

export function Providers({ children, initialLang }: { children: ReactNode, initialLang?: AppLanguage }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      {children}
    </LanguageProvider>
  );
}
