'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { acceptInvitation } from '@/app/actions/team';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';

interface InviteActionsProps {
  token: string;
}

export function InviteActions({ token }: InviteActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccept = () => {
    startTransition(async () => {
      const res = await acceptInvitation(token);
      if (res.success) {
        toast.success('Invitation accepted! Welcome to the project.');
        router.push('/dashboard/team');
      } else {
        toast.error(res.error || 'Failed to accept invitation.');
      }
    });
  };

  const handleDecline = () => {
    toast.info('Invitation declined.');
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
      <button
        onClick={handleAccept}
        disabled={isPending}
        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Joining project...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Accept Invitation</span>
          </>
        )}
      </button>

      <button
        onClick={handleDecline}
        disabled={isPending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
        <span>Decline</span>
      </button>
    </div>
  );
}
