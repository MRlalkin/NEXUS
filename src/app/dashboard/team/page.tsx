import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, Mail, Phone, Briefcase } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Team Directory | NEXUS',
};

export default async function GlobalTeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch all projects the user is part of
  const { data: myProjects } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', user.id);

  const projectIds = myProjects?.map(p => p.project_id) || [];

  // Fetch all members of these projects to form the "team directory"
  const { data: teamMembersRaw } = await supabase
    .from('project_members')
    .select(`
      role, project_id,
      profile:user_id(id, full_name, username, email, bio)
    `)
    .in('project_id', projectIds);

  // Deduplicate users (since one user can be in multiple projects)
  const uniqueMembersMap = new Map();
  teamMembersRaw?.forEach((m: any) => {
    if (!uniqueMembersMap.has(m.profile.id)) {
      uniqueMembersMap.set(m.profile.id, {
        profile: m.profile,
        roles: [{ projectId: m.project_id, role: m.role }]
      });
    } else {
      const existing = uniqueMembersMap.get(m.profile.id);
      existing.roles.push({ projectId: m.project_id, role: m.role });
    }
  });

  const teamMembers = Array.from(uniqueMembersMap.values());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Команда и участники
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Все участники ваших проектов.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {teamMembers.length === 0 && (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-white/[0.08]">
            <p className="text-slate-400">В вашей команде пока нет других участников. Отправьте приглашение по email.</p>
          </div>
        )}
        {teamMembers.map((member) => {
          const roleLabels: Record<string, string> = {
            'OWNER': 'Владелец (Owner)',
            'ADMIN': 'Администратор (Admin)',
            'MEMBER': 'Участник (Member)',
            'VIEWER': 'Наблюдатель (Viewer)'
          };
          return (
          <div key={member.profile.id} className="glass-panel p-6 rounded-2xl border border-white/[0.08] hover:border-indigo-500/30 transition-colors group">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-bold mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                {member.profile.full_name?.charAt(0) || member.profile.username?.charAt(0) || '?'}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{member.profile.full_name || member.profile.username}</h3>
              <p className="text-xs text-slate-400 mb-4 h-8 line-clamp-2">
                {member.profile.bio || 'Нет описания'}
              </p>
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/[0.03] p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{member.profile.email}</span>
                </div>
                
                <div className="flex items-start gap-3 text-xs text-slate-300 bg-white/[0.03] p-2 rounded-lg">
                  <Briefcase className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-slate-500 font-semibold mb-1">Проекты:</span>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {member.roles.slice(0, 3).map((r: any, idx: number) => (
                        <span key={idx} className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase" title={roleLabels[r.role] || r.role}>
                          {roleLabels[r.role] || r.role}
                        </span>
                      ))}
                      {member.roles.length > 3 && (
                        <span className="bg-white/10 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          +{member.roles.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
