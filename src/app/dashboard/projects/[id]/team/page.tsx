import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InviteMemberDialog } from '@/components/team/invite-member-dialog';
import { TeamMemberCard } from '@/components/team/team-member-card';
import { Users, Shield, UserCheck } from 'lucide-react';
import type { TeamMemberItem, ProjectRole } from '@/types/team';
import Link from 'next/link';

export const metadata = {
  title: 'Project Team | NEXUS',
  description: 'Manage project members and roles.',
};

interface ProjectTeamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectTeamPage({ params }: ProjectTeamPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch project to verify access and get owner
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, owner_id, owner:profiles!owner_id(id, full_name, username, avatar_url, email)')
    .eq('id', id)
    .single();

  if (projectError || !project) {
    redirect('/dashboard/projects');
  }

  // 2. Fetch project members
  const { data: projectMembers } = await supabase
    .from('project_members')
    .select('role, user_id, profile:profiles!user_id(id, full_name, username, avatar_url, email)')
    .eq('project_id', id);

  const isOwner = project.owner_id === user.id;
  const memberRecord = projectMembers?.find(m => m.user_id === user.id);
  const currentUserRole = isOwner ? 'OWNER' : (memberRecord?.role as ProjectRole);

  if (!currentUserRole) {
    redirect('/dashboard/projects');
  }

  const canManage = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';
  const userManagedProjects = canManage ? [{ id: project.id, name: project.name }] : [];

  const teamMembersMap = new Map<string, TeamMemberItem>();

  // Add owner
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ownerProfile = project.owner as any;
  if (ownerProfile) {
    teamMembersMap.set(ownerProfile.id, {
      userId: ownerProfile.id,
      fullName: ownerProfile.full_name || 'Anonymous User',
      username: ownerProfile.username || 'user',
      email: ownerProfile.email || '',
      avatarUrl: ownerProfile.avatar_url || '',
      projects: [{ projectId: project.id, projectName: project.name, role: 'OWNER', isOwner: true }],
      highestRole: 'OWNER',
      isOnline: true,
    });
  }

  // Add members
  (projectMembers || []).forEach((pm) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profile = pm.profile as any;
    if (profile && !teamMembersMap.has(profile.id)) {
      teamMembersMap.set(profile.id, {
        userId: profile.id,
        fullName: profile.full_name || 'Anonymous User',
        username: profile.username || 'user',
        email: profile.email || '',
        avatarUrl: profile.avatar_url || '',
        projects: [{ projectId: project.id, projectName: project.name, role: pm.role as ProjectRole, isOwner: false }],
        highestRole: pm.role as ProjectRole,
        isOnline: Math.random() > 0.4,
      });
    }
  });

  const membersList = Array.from(teamMembersMap.values());
  const adminCount = membersList.filter((m) => m.highestRole === 'OWNER' || m.highestRole === 'ADMIN').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Link href={`/dashboard/projects/${id}/board`} className="hover:underline text-indigo-300">
              {project.name}
            </Link>
            <span className="text-slate-600">/</span>
            <Users className="w-4 h-4" />
            <span>Project Team</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Members &amp; Roles
          </h1>
        </div>

        {canManage && (
          <InviteMemberDialog projects={userManagedProjects} />
        )}
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{membersList.length}</div>
            <div className="text-xs text-slate-400">Project Members</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{adminCount}</div>
            <div className="text-xs text-slate-400">Owners &amp; Admins</div>
          </div>
        </div>
      </div>

      {/* Search & Team Members Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>Active Collaborators</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {membersList.map((member) => (
            <TeamMemberCard
              key={member.userId}
              member={member}
              currentUserId={user.id}
              userManagedProjectIds={canManage ? [project.id] : []}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
