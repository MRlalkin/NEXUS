'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/actions/projects';
import { useTranslation } from '@/context/language-context';
import { X, Loader2, Sparkles, AlertTriangle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CreateProjectDialogProps {
  currentProjectCount: number;
  subscriptionTier: 'FREE' | 'PRO';
}

const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#22c55e', // Green
];

export function CreateProjectDialog({ currentProjectCount, subscriptionTier }: CreateProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { lang, t } = useTranslation();

  const [color, setColor] = useState(COLORS[0]);

  // Project limit logic: FREE tier allows up to 2 projects (total 3, wait, the prompt says "если уже создано 2 проекта")
  const maxProjects = 2;
  const isLimitReached = subscriptionTier === 'FREE' && currentProjectCount >= maxProjects;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLimitReached) {
      toast.error(lang === 'ru' ? 'Лимит проектов достигнут' : 'Project limit reached');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('color', color);

    startTransition(async () => {
      const res = await createProject(formData);
      if (res.success) {
        toast.success(lang === 'ru' ? 'Проект создан!' : 'Project created!');
        setIsOpen(false);
        if (res.project) {
          router.push(`/dashboard/projects/${res.project.id}/board`);
        }
      } else {
        toast.error(res.error || (lang === 'ru' ? 'Ошибка создания проекта' : 'Failed to create project'));
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all cursor-pointer shadow-lg shadow-indigo-500/25"
      >
        <Plus className="w-4 h-4" />
        <span>{lang === 'ru' ? '+ Новый проект' : '+ New Project'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="cyber-glass w-full max-w-md rounded-3xl border border-white/[0.08] shadow-2xl shadow-indigo-500/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
            
            <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                {lang === 'ru' ? 'Создание проекта' : 'Create Project'}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isLimitReached ? (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-3 text-rose-400">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      {lang === 'ru' 
                        ? 'Вы достигли лимита тарифа FREE (максимум 2 проекта). Чтобы создавать больше проектов, обновите тариф до PRO.' 
                        : 'You have reached the FREE tier limit (max 2 projects). Upgrade to PRO to create unlimited projects.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/dashboard/settings');
                    }}
                    className="self-end px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
                  >
                    {lang === 'ru' ? 'Обновить до PRO' : 'Upgrade to PRO'}
                  </button>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    {lang === 'ru' ? 'Название проекта' : 'Project Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="name"
                    required
                    disabled={isLimitReached}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                    placeholder={lang === 'ru' ? 'Например: Редизайн платформы' : 'e.g. Platform Redesign'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    {lang === 'ru' ? 'Описание (необязательно)' : 'Description (Optional)'}
                  </label>
                  <textarea
                    name="description"
                    disabled={isLimitReached}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 resize-none"
                    placeholder={lang === 'ru' ? 'Краткое описание целей...' : 'Brief description of goals...'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {lang === 'ru' ? 'Цветовая метка' : 'Color Label'}
                  </label>
                  <div className="flex items-center gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        disabled={isLimitReached}
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#12161f]' : 'hover:scale-110 opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/[0.05] mt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    {lang === 'ru' ? 'Отмена' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || isLimitReached}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'ru' ? 'Создать' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
