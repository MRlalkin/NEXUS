'use client';

import { useState, useTransition } from 'react';
import { inviteMember } from '@/app/actions/team';
import { Mail, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function InviteMemberForm({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('projectId', projectId);
    const email = formData.get('email') as string;

    startTransition(async () => {
      const res = await inviteMember(formData);
      if (res.success) {
        toast.success(`Invitation sent to ${email}`);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error('Failed to invite member: ' + res.error);
      }
    });
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            name="email"
            type="email"
            required
            placeholder="colleague@example.com"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-sm"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Role
        </label>
        <select 
          name="role" 
          defaultValue="MEMBER"
          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm appearance-none"
        >
          <option value="VIEWER">Viewer - Read only</option>
          <option value="MEMBER">Member - Can edit tasks</option>
          <option value="ADMIN">Admin - Can manage team</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>Send Invitation</span>
      </button>
    </form>
  );
}
