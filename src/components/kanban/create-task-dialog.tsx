'use client';

import React, { useState, useTransition } from 'react';
import { createTask } from '@/app/actions/tasks';
import { toast } from 'sonner';
import { 
  Plus, 
  X, 
  Calendar, 
  User, 
  Loader2, 
  AlertCircle, 
  Zap, 
  Clock 
} from 'lucide-react';
import type { TaskPriority, AssigneeProfile } from '@/types/kanban';
import { useLanguage } from '@/context/language-context';

interface CreateTaskDialogProps {
  projectId: string;
  members: AssigneeProfile[];
}

export function CreateTaskDialog({ projectId, members }: CreateTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { t: typedT } = useLanguage();
  const t = typedT as any;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error(t.toasts.error);
      return;
    }

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priority', priority);
    if (assigneeId) formData.append('assigneeId', assigneeId);
    if (deadline) formData.append('deadline', deadline);

    startTransition(async () => {
      const res = await createTask(formData);
      if (res.success) {
        toast.success(t.toasts.success);
        handleClose();
      } else {
        toast.error(res.error || t.toasts.error);
      }
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setAssigneeId('');
    setDeadline('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>{t.board.addTask}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="cyber-glass w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Top Glow Edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
              title={t.common.close}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">{t.board.createTaskModalTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {t.board.createTaskModalDesc}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t.board.taskTitle} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.board.taskTitlePlaceholder}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t.projects.projectDescription}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="..."
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 resize-none"
                />
              </div>

              {/* Priority Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t.board.priority}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'LOW', label: t.board.priorityLow, icon: <Clock className="w-3.5 h-3.5" />, color: 'border-cyan-500/50 text-cyan-300' },
                      { id: 'MEDIUM', label: t.board.priorityMedium, icon: <Clock className="w-3.5 h-3.5" />, color: 'border-indigo-500/50 text-indigo-300' },
                      { id: 'HIGH', label: t.board.priorityHigh, icon: <Zap className="w-3.5 h-3.5" />, color: 'border-amber-500/50 text-amber-300' },
                      { id: 'URGENT', label: t.board.priorityUrgent, icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'border-rose-500/50 text-rose-300' },
                    ] as const
                  ).map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id as TaskPriority)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? `bg-white/[0.08] ${p.color} shadow-lg`
                            : 'border-white/[0.06] text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {p.icon}
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assignee & Deadline Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Assignee */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {t.board.assignee}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <select
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-xs appearance-none bg-[#0a0d14]"
                    >
                      <option value="">{t.board.unassigned}</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#121622] text-slate-200">
                          {m.full_name} (@{m.username})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {t.projects.deadline}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs text-slate-200 [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.common.loading}...</span>
                    </>
                  ) : (
                    <span>{t.common.create}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
