import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from '@/components/providers';
import { cookies } from 'next/headers';
import { AppLanguage } from '@/locales/translations';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NEXUS — Next-Gen Project Workspace',
  description: 'NEXUS — Next-Gen Project Workspace',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('nexus_lang')?.value as AppLanguage | undefined;
  const initialLang = (langCookie === 'ru' || langCookie === 'en') ? langCookie : 'ru';

  return (
    <html lang={initialLang} className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0c10] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <Providers initialLang={initialLang}>
          {children}
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#12161f',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f1f5f9',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
