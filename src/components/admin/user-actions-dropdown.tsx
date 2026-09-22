'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleUserBan, changeUserRole } from '@/app/actions/admin';
import { toast } from 'sonner';
import { 
  MoreVertical, 
  User, 
  ShieldAlert, 
  Shield, 
  Ban, 
  CheckCircle, 
  Loader2 
} from 'lucide-react';
import Link from 'next/link';

interface UserActionsDropdownProps {
  userId: string;
  currentRole: 'USER' | 'ADMIN';
  isBanned: boolean;
  currentUserId: string;
}

export function UserActionsDropdown({
  userId,
  currentRole,
  isBanned,
  currentUserId
}: UserActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isSelf = userId === currentUserId;

  const handleToggleBan = () => {
    setIsOpen(false);
    if (isSelf) {
      toast.error('You cannot ban yourself.');
      return;
    }
    
    startTransition(async () => {
      const res = await toggleUserBan(userId, !isBanned);
      if (res.success) {
        toast.success(isBanned ? 'User has been unbanned.' : 'User has been banned.');
        router.refresh();
      } else {
        toast.error(res.error || 'Failed to update user status.');
      }
    });
  };

  const handleToggleRole = () => {
    setIsOpen(false);
    if (isSelf && currentRole === 'ADMIN') {
      toast.error('You cannot remove your own admin privileges.');
      return;
    }

    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

    startTransition(async () => {
      const res = await changeUserRole(userId, newRole);
      if (res.success) {
        toast.success(`User role changed to ${newRole}.`);
        router.refresh();
      } else {
        toast.error(res.error || 'Failed to update user role.');
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="p-2 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-1.5">
              <Link
                href={`/admin/users/${userId}`}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>View Profile</span>
              </Link>
            </div>
            
            <div className="h-px bg-white/[0.06]" />
            
            <div className="p-1.5 space-y-1">
              <button
                onClick={handleToggleRole}
                disabled={isSelf && currentRole === 'ADMIN'}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                {currentRole === 'ADMIN' ? (
                  <>
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Remove Admin Rights</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Make Administrator</span>
                  </>
                )}
              </button>

              <button
                onClick={handleToggleBan}
                disabled={isSelf}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left ${
                  isBanned 
                    ? 'text-emerald-400 hover:bg-emerald-500/10' 
                    : 'text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                {isBanned ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Unban User</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    <span>Ban User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
