'use client';

import { useState, useTransition } from 'react';
import { inviteMemberByEmail } from '@/app/actions/team';
import { toast } from 'sonner';
import { 
  UserPlus, 
  X, 
  Mail, 
  Briefcase, 
  Shield, 
  Copy, 
  Check, 
  Loader2, 
  Link as LinkIcon 
} from 'lucide-react';
import type { ProjectRole } from '@/types/team';

interface ProjectOption {
  id: string;
  name: string;
  color?: string;
}

interface InviteMemberDialogProps {
  projects: ProjectOption[];
}

export function InviteMemberDialog({ projects }: InviteMemberDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [role, setRole] = useState<ProjectRole>('MEMBER');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectId) {
      toast.error('Please select a project or create one first.');
      return;
    }

    startTransition(async () => {
      const res = await inviteMemberByEmail({ projectId, email, role });
      if (res.success) {
        toast.success(`Пользователь ${email} успешно добавлен в проект!`);
        handleClose();
      } else {
        toast.error(res.error || 'Failed to send invitation.');
      }
    });
  };

  const handleCopyLink = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Invitation link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmail('');
    setInviteLink(null);
    setCopied(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        <span>Invite Member</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 sm:p-7 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Invite Team Member</h3>
                <p className="text-xs text-slate-400">Add collaborators to your workspace project</p>
              </div>
            </div>

            {inviteLink ? (
              <div className="space-y-4 py-2 animate-in fade-in">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5">
                  <Check className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
                  <span>Invitation generated successfully! You can share the link below with your team member:</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Invitation URL
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={inviteLink}
                        className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs text-slate-300 select-all"
                      />
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleClose}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Project Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Project
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      required
                      className="glass-input w-full pl-10 pr-8 py-2.5 rounded-xl text-sm appearance-none bg-[#0a0c10] text-slate-200"
                    >
                      {projects.length === 0 ? (
                        <option value="" disabled>No available projects</option>
                      ) : (
                        projects.map((p) => (
                          <option key={p.id} value={p.id} className="bg-[#12161f] text-slate-200">
                            {p.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Colleague&apos;s Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teammate@company.com"
                      className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Project Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['VIEWER', 'MEMBER', 'ADMIN'] as ProjectRole[]).map((r) => {
                      const isSelected = role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                              : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-slate-200'
                          }`}
                        >
                          <Shield className={`w-4 h-4 mb-1 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                          <span>{r}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || projects.length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating invite...</span>
                      </>
                    ) : (
                      <span>Send Invitation</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
