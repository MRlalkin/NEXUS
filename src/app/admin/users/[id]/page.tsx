import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { UserActionsDropdown } from '@/components/admin/user-actions-dropdown';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  Star, 
  Ban, 
  Briefcase,
  CheckSquare,
  Activity,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'User Details | NEXUS Admin',
};

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!currentUser) {
    redirect('/login');
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single();

  if (!currentProfile || currentProfile.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch target user profile
  const { data: targetUser, error: targetError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (targetError || !targetUser) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20 p-4">
          User not found or failed to load.
        </div>
        <Link href="/admin/users" className="text-sm text-indigo-400 hover:underline">
          &larr; Back to Users
        </Link>
      </div>
    );
  }

  // Fetch target user stats (Projects Owned, Projects Joined, Tasks Completed)
  const [
    { data: ownedProjects },
    { data: joinedProjects },
    { data: completedTasks }
  ] = await Promise.all([
    supabaseAdmin.from('projects').select('id, name, color, created_at').eq('owner_id', id),
    supabaseAdmin.from('project_members').select('project_id, role, project:projects(id, name, color)').eq('user_id', id),
    supabaseAdmin.from('tasks').select('id', { count: 'exact' }).eq('assignee_id', id).eq('status', 'DONE')
  ]);

  const projectsMap = new Map();

  (ownedProjects || []).forEach(p => {
    projectsMap.set(p.id, { id: p.id, name: p.name, color: p.color, role: 'OWNER' });
  });

  (joinedProjects || []).forEach(jp => {
    const p = jp.project as any;
    if (p && !projectsMap.has(p.id)) {
      projectsMap.set(p.id, { id: p.id, name: p.name, color: p.color, role: jp.role });
    }
  });

  const allInvolvedProjects = Array.from(projectsMap.values());

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <Link 
        href="/admin/users" 
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Users
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Profile Card */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] relative overflow-hidden">
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${targetUser.is_banned ? 'bg-rose-500' : 'bg-indigo-500'}`} />

            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-2xl shadow-inner border border-white/5">
                {targetUser.full_name?.charAt(0).toUpperCase() || targetUser.email.charAt(0).toUpperCase()}
              </div>
              <UserActionsDropdown 
                userId={targetUser.id} 
                currentRole={targetUser.role as 'USER' | 'ADMIN'} 
                isBanned={targetUser.is_banned} 
                currentUserId={currentUser.id} 
              />
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {targetUser.full_name || 'Anonymous User'}
                </h1>
                {targetUser.username && (
                  <p className="text-sm text-indigo-400">@{targetUser.username}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {targetUser.subscription_tier === 'PRO' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Star className="w-3 h-3" /> PRO
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/20 text-slate-300 border border-slate-500/30">
                    FREE
                  </span>
                )}

                {targetUser.role === 'ADMIN' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Shield className="w-3 h-3" /> ADMIN
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/20 text-slate-300 border border-slate-500/30">
                    USER
                  </span>
                )}

                {targetUser.is_banned && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 w-full mt-2 justify-center">
                    <Ban className="w-3 h-3" /> BANNED ACCOUNT
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4 border-t border-white/[0.08] pt-6">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="truncate">{targetUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Joined {new Date(targetUser.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span className="font-mono text-xs text-slate-500 truncate" title={targetUser.id}>{targetUser.id.split('-')[0]}...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Projects */}
        <div className="flex-1 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{ownedProjects?.length || 0}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">Projects Owned</div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{joinedProjects?.length || 0}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">Projects Joined</div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{completedTasks?.length || 0}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">Tasks Done</div>
              </div>
            </div>
          </div>

          {/* Associated Projects */}
          <div className="glass-panel rounded-3xl border border-white/[0.08] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">Associated Projects</h2>
              <p className="text-xs text-slate-400 mt-1">Workspaces where this user has access.</p>
            </div>
            
            <div className="p-2">
              {allInvolvedProjects.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  This user is not involved in any projects yet.
                </div>
              ) : (
                <ul className="divide-y divide-white/[0.04]">
                  {allInvolvedProjects.map(proj => (
                    <li key={proj.id} className="p-4 hover:bg-white/[0.02] rounded-xl transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner font-bold"
                          style={{ backgroundColor: proj.color || '#6366f1' }}
                        >
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-white">{proj.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">ID: {proj.id}</div>
                        </div>
                      </div>
                      <div>
                        {proj.role === 'OWNER' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            OWNER
                          </span>
                        ) : proj.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/[0.05] text-slate-300 border border-white/[0.1]">
                            {proj.role}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
