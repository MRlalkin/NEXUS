import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { InviteActions } from '@/components/team/invite-actions';
import { 
  Layers, 
  ShieldAlert, 
  Briefcase, 
  Shield, 
  UserCheck, 
  ArrowRight 
} from 'lucide-react';

interface InvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

export const metadata = {
  title: 'Project Invitation | NEXUS',
  description: 'Accept your project invitation to join the team on NEXUS.',
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Query invitation details
  const { data: invitation, error } = await supabaseAdmin
    .from('invitations')
    .select('*, project:projects(id, name, color, description), inviter:profiles!invited_by(full_name, email, avatar_url)')
    .eq('token', token)
    .single();

  // Invalid or expired invitation state
  if (error || !invitation || invitation.status !== 'PENDING') {
    return (
      <div className="min-h-screen bg-[#0a0c10] bg-grid-pattern text-slate-100 flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-md p-8 sm:p-10 rounded-3xl border border-white/10 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Invalid or Expired Invitation</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              This invitation link is invalid, expired, or has already been accepted by another user.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = invitation.project as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inviter = invitation.inviter as any;

  return (
    <div className="relative min-h-screen bg-[#0a0c10] bg-grid-pattern text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Dynamic ambient gradient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-cyan-500/10 blur-[130px] rounded-full" />

      {/* Header Branding */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-[1px]">
            <div className="w-full h-full bg-[#12161f] rounded-[11px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="font-bold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
            NEXUS
          </span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Top accent glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/15">
              <UserCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Project Invitation
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              You&apos;ve been invited to collaborate on a NEXUS workspace.
            </p>
          </div>

          {/* Invitation Details Card */}
          <div className="p-5 rounded-2xl bg-[#0a0c10]/80 border border-white/[0.08] space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: project?.color || '#6366f1' }}
              >
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Project
                </span>
                <h3 className="text-base font-bold text-white truncate">
                  {project?.name || 'Workspace Project'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06] text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Assigned Role</span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-300 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{invitation.role}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">Invited By</span>
                <span className="font-medium text-slate-300 truncate block mt-0.5">
                  {inviter?.full_name || 'Project Owner'}
                </span>
              </div>
            </div>
          </div>

          {/* Action state: logged in vs logged out */}
          {user ? (
            <InviteActions token={token} />
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                href={`/login?redirect=/invite/${token}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25"
              >
                <span>Sign in to Accept Invitation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[11px] text-slate-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-indigo-400 hover:underline font-medium"
                >
                  Register here
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} NEXUS Systems Inc. All rights reserved.
      </footer>
    </div>
  );
}
