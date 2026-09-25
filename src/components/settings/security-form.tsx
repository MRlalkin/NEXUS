'use client';

import React, { useState, useTransition } from 'react';
import { updatePassword, signOutAllDevices } from '@/app/actions/profile';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  LogOut, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

export function SecurityForm() {
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [isSessionPending, startSessionTransition] = useTransition();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);

    startPasswordTransition(async () => {
      const res = await updatePassword(formData);
      if (res.success) {
        toast.success(res.message || 'Password changed successfully!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.error || 'Failed to update password.');
      }
    });
  };

  const handleSignOutAll = () => {
    setIsConfirmOpen(true);
  };

  const confirmSignOutAll = () => {
    startSessionTransition(async () => {
      const res = await signOutAllDevices();
      if (res.success) {
        toast.success(res.message || 'Signed out from other sessions.');
      } else {
        toast.error(res.error || 'Failed to sign out other sessions.');
      }
      setIsConfirmOpen(false);
    });
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <div className="cyber-glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-transparent" />

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Change Password</h3>
            <p className="text-xs text-slate-400">Ensure your account uses a secure 6+ character password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="glass-input w-full pl-10 pr-10 py-2.5 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPasswordPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              {isPasswordPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Session Management Card */}
      <div className="cyber-glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Active Sessions &amp; Devices</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
                If you suspect unauthorized access or lost a device, you can terminate all other active browser sessions immediately.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOutAll}
            disabled={isSessionPending}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSessionPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>Sign out other devices</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSignOutAll}
        title="Sign Out Everywhere"
        description="Are you sure you want to sign out from all other active browser sessions?"
        confirmText="Sign Out All"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
