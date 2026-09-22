'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { register } from '@/app/actions/auth';
import { useLanguage } from '@/context/language-context';
import { toast } from 'sonner';
import { 
  User, 
  AtSign, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  ShieldAlert, 
  CheckCircle2, 
  Check, 
  X 
} from 'lucide-react';

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { t: typedT } = useLanguage();
  const t = typedT as any;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Form field state for real-time validation
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Password rules validation
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!hasMinLength) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await register(formData);
        if (!result.success) {
          const err = result.error || 'Failed to create account.';
          setErrorMessage(err);
          toast.error(err);
        } else if (result.message) {
          setSuccessInfo(result.message);
          toast.success('Registration successful!');
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
          return;
        }
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setErrorMessage(message);
        toast.error(message);
      }
    });
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div className="glass-panel rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Top accent glow line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-80" />

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.auth.registerTitle}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {t.auth.registerSubtitle}
          </p>
        </div>

        {/* Success Message Banner */}
        {successInfo ? (
          <div className="space-y-6 text-center py-4 animate-in fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Verification Link Sent</h2>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                {successInfo}
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              Return to login
            </Link>
          </div>
        ) : (
          <>
            {/* Error Alert Banner */}
            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm animate-in fade-in">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="fullName" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  {t.auth.fullName}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    disabled={isPending}
                    placeholder="Alex Mercer"
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="username" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  {t.auth.username}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    disabled={isPending}
                    placeholder="alex_mercer"
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="email" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  {t.auth.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isPending}
                    placeholder="alex@company.com"
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  {t.auth.password}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    placeholder="••••••••••••"
                    className="glass-input w-full pl-10 pr-11 py-2.5 rounded-xl text-sm placeholder:text-slate-500 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password requirements checklist */}
                {password.length > 0 && (
                  <div className="pt-2 grid grid-cols-2 gap-1.5 text-[11px] animate-in fade-in">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>6+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLetter ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasLetter ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Contains letters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Contains numbers</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-3 relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating workspace...</span>
                  </>
                ) : (
                  <>
                    <span>{t.auth.submitRegister}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 text-center border-t border-white/[0.06]">
              <p className="text-sm text-slate-400">
                {t.auth.hasAccount}{' '}
                <Link
                  href="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  {t.auth.signInLink}
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
