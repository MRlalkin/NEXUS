import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InviteMemberDialog } from '@/components/team/invite-member-dialog';
import { TeamMemberCard } from '@/components/team/team-member-card';
import { Users, Shield, Briefcase, UserCheck, Search } from 'lucide-react';
import type { TeamMemberItem, ProjectRole } from '@/types/team';

export const metadata = {
  title: 'Team & Roles | NEXUS',
  description: 'Manage workspace members, project roles, and invitations.',
};

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/team');
  }

  // 1. Fetch all projects where the user is an owner or member
  const { data: ownedProjects } = await supabase
    .from('projects')
    .select('id, name, color, owner_id')
    .eq('owner_id', user.id);

  const { data: memberProjectLinks } = await supabase
    .from('project_members')
    .select('project_id, role, project:projects(id, name, color, owner_id)')
    .eq('user_id', user.id);

  // Combine unique project list
  const userProjectsMap = new Map<string, { id: string; name: string; color: string; isOwner: boolean; role: ProjectRole }>();

  (ownedProjects || []).forEach((p) => {
    userProjectsMap.set(p.id, {
      id: p.id,
      name: p.name,
      color: p.color,
      isOwner: true,
      role: 'OWNER',
    });
  });

  (memberProjectLinks || []).forEach((link) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = link.project as any;
    if (p && !userProjectsMap.has(p.id)) {
      userProjectsMap.set(p.id, {
        id: p.id,
        name: p.name,
        color: p.color,
        isOwner: p.owner_id === user.id,
        role: link.role as ProjectRole,
      });
    }
  });

  const accessibleProjectIds = Array.from(userProjectsMap.keys());

  // Projects where current user has management permissions (OWNER or ADMIN)
  const userManagedProjects = Array.from(userProjectsMap.values()).filter(
    (p) => p.isOwner || p.role === 'ADMIN'
  );
  const userManagedProjectIds = userManagedProjects.map((p) => p.id);

  // 2. Fetch all members across accessible projects
  const teamMembersMap = new Map<string, TeamMemberItem>();

  if (accessibleProjectIds.length > 0) {
    // A. Fetch project owners as members
    const { data: projectOwners } = await supabase
      .from('projects')
      .select('id, name, owner_id, owner:profiles!owner_id(id, full_name, username, avatar_url, email)')
      .in('id', accessibleProjectIds);

    (projectOwners || []).forEach((p) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ownerProfile = p.owner as any;
      if (ownerProfile) {
        const existing = teamMembersMap.get(ownerProfile.id);
        const projectItem = {
          projectId: p.id,
          projectName: p.name,
          role: 'OWNER' as ProjectRole,
          isOwner: true,
        };

        if (existing) {
          if (!existing.projects.some((pr) => pr.projectId === p.id)) {
            existing.projects.push(projectItem);
          }
          existing.highestRole = 'OWNER';
        } else {
          teamMembersMap.set(ownerProfile.id, {
            userId: ownerProfile.id,
            fullName: ownerProfile.full_name || 'Anonymous User',
            username: ownerProfile.username || 'user',
            email: ownerProfile.email || '',
            avatarUrl: ownerProfile.avatar_url || '',
            projects: [projectItem],
            highestRole: 'OWNER',
            isOnline: true,
          });
        }
      }
    });

    // B. Fetch members from project_members
    const { data: projectMembers } = await supabase
      .from('project_members')
      .select('project_id, role, user_id, profile:profiles!user_id(id, full_name, username, avatar_url, email), project:projects(id, name)')
      .in('project_id', accessibleProjectIds);

    (projectMembers || []).forEach((pm) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profile = pm.profile as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const proj = pm.project as any;

      if (profile && proj) {
        const existing = teamMembersMap.get(profile.id);
        const projectItem = {
          projectId: proj.id,
          projectName: proj.name,
          role: pm.role as ProjectRole,
          isOwner: false,
        };

        if (existing) {
          if (!existing.projects.some((pr) => pr.projectId === proj.id)) {
            existing.projects.push(projectItem);
          }
        } else {
          teamMembersMap.set(profile.id, {
            userId: profile.id,
            fullName: profile.full_name || 'Anonymous User',
            username: profile.username || 'user',
            email: profile.email || '',
            avatarUrl: profile.avatar_url || '',
            projects: [projectItem],
            highestRole: pm.role as ProjectRole,
            isOnline: Math.random() > 0.4, // Simulating presence status for display
          });
        }
      }
    });
  }

  // If map is empty (e.g. no projects yet), add current user profile
  if (teamMembersMap.size === 0) {
    const { data: myProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (myProfile) {
      teamMembersMap.set(user.id, {
        userId: user.id,
        fullName: myProfile.full_name || user.email?.split('@')[0] || 'User',
        username: myProfile.username || 'user',
        email: user.email || '',
        avatarUrl: myProfile.avatar_url || '',
        projects: [],
        highestRole: 'OWNER',
        isOnline: true,
      });
    }
  }

  const membersList = Array.from(teamMembersMap.values());
  const totalMembers = membersList.length;
  const adminCount = membersList.filter((m) => m.highestRole === 'OWNER' || m.highestRole === 'ADMIN').length;
  const totalProjects = accessibleProjectIds.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Workspace Collaboration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Team &amp; Roles
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your project members, configure role permissions, and invite new teammates.
          </p>
        </div>

        <InviteMemberDialog projects={userManagedProjects} />
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalMembers}</div>
            <div className="text-xs text-slate-400">Workspace Members</div>
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

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <div className="text-xs text-slate-400">Active Shared Projects</div>
          </div>
        </div>
      </div>

      {/* Search & Team Members Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>Active Collaborators ({membersList.length})</span>
          </h2>
        </div>

        {membersList.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center border border-white/[0.08] space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No team members found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start building your team by inviting colleagues to collaborate on your projects.
            </p>
            <div className="pt-2">
              <InviteMemberDialog projects={userManagedProjects} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membersList.map((member) => (
              <TeamMemberCard
                key={member.userId}
                member={member}
                currentUserId={user.id}
                userManagedProjectIds={userManagedProjectIds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
