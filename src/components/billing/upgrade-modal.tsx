'use client';

import { useState } from 'react';
import { X, Check, Zap, Sparkles } from 'lucide-react';
import { createCheckoutSession } from '@/app/actions/billing';
import { toast } from 'sonner';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function UpgradeModal({ isOpen, onClose, title, message }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const { success, url, error } = await createCheckoutSession();
      if (success && url) {
        window.location.href = url;
      } else {
        toast.error(error || 'Failed to start checkout process');
        setIsLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  const features = [
    'Неограниченное количество проектов и задач',
    'Полный доступ к расширенной аналитике и метрикам команды',
    'До 50 участников в каждом проекте',
    'Приоритетная обработка и поддержка',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0d1117] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header gradient & close */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-6 sm:p-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-6">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {title || 'Перейдите на NEXUS PRO'}
          </h2>
          
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {message || 'Раскройте полный потенциал вашей команды с расширенными возможностями управления и аналитики.'}
          </p>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl font-extrabold text-white">$9</span>
            <span className="text-sm font-medium text-slate-400">/ месяц</span>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded-full bg-indigo-500/20 text-indigo-400 flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-slate-200 leading-snug">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Оформить подписку</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
