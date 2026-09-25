/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { updateMemberRole, removeMember } from '@/app/actions/team';
import { toast } from 'sonner';
import { 
  Shield, 
  MoreVertical, 
  Trash2, 
  Crown, 
  Loader2, 
  Briefcase 
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLanguage } from '@/context/language-context';
import type { TeamMemberItem, ProjectRole } from '@/types/team';

interface TeamMemberCardProps {
  member: TeamMemberItem;
  currentUserId: string;
  userManagedProjectIds: string[]; // Projects where current user is OWNER or ADMIN
}

export function TeamMemberCard({
  member,
  currentUserId,
  userManagedProjectIds,
}: TeamMemberCardProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedProjectId, setSelectedProjectId] = useState(member.projects[0]?.projectId || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { t: typedT } = useLanguage();
  const t = typedT as any;

  const currentProjectMembership = member.projects.find((p) => p.projectId === selectedProjectId);
  const canManageCurrentProject = userManagedProjectIds.includes(selectedProjectId);
  const isSelf = member.userId === currentUserId;
  const isOwner = currentProjectMembership?.isOwner ?? false;

  const handleRoleChange = (newRole: ProjectRole) => {
    setIsMenuOpen(false);
    startTransition(async () => {
      const res = await updateMemberRole({ projectId: selectedProjectId, targetUserId: member.userId, newRole });
      if (res.success) {
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error(res.error || 'Failed to update role.');
      }
    });
  };

  const handleRemove = () => {
    setIsMenuOpen(false);
    setIsConfirmOpen(true);
  };

  const confirmRemove = () => {
    startTransition(async () => {
      const res = await removeMember({ projectId: selectedProjectId, targetUserId: member.userId });
      if (res.success) {
        toast.success(`${member.fullName} removed from project.`);
      } else {
        toast.error(res.error || 'Failed to remove member.');
      }
      setIsConfirmOpen(false);
    });
  };

  const getRoleBadge = (role: ProjectRole, isOwner: boolean) => {
    if (isOwner) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <Crown className="w-3 h-3 text-amber-400" />
          <span>OWNER</span>
        </span>
      );
    }
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Shield className="w-3 h-3 text-indigo-400" />
            <span>ADMIN</span>
          </span>
        );
      case 'MEMBER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span>MEMBER</span>
          </span>
        );
      case 'VIEWER':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20">
            <span>VIEWER</span>
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-white/15 transition-all relative flex flex-col justify-between group">
      <div>
        {/* Top bar with Online indicator & Action menu */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                member.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span className="text-[11px] text-slate-400 font-medium">
              {member.isOnline ? 'Active Now' : 'Offline'}
            </span>
          </div>

          {/* Actions Dropdown for Admins/Owners */}
          {canManageCurrentProject && !isOwner && !isSelf && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                disabled={isPending}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Member actions"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-7 w-44 rounded-xl bg-[#12161f] border border-white/10 shadow-2xl p-1.5 z-20 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Change Role
                  </div>
                  {(['ADMIN', 'MEMBER', 'VIEWER'] as ProjectRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      disabled={currentProjectMembership?.role === r}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentProjectMembership?.role === r
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      Set as {r}
                    </button>
                  ))}
                  <div className="h-[1px] bg-white/[0.06] my-1" />
                  <button
                    onClick={handleRemove}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from project</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Member Profile Info */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
            <Image
              src={
                member.avatarUrl ||
                `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(member.username || member.email)}`
              }
              alt={member.fullName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white truncate">{member.fullName}</h4>
              {isSelf && (
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded font-medium">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">@{member.username || 'user'}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{member.email}</p>
          </div>
        </div>
      </div>

      {/* Projects & Roles Footer */}
      <div className="pt-3 border-t border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span className="truncate max-w-[150px]">
              {currentProjectMembership?.projectName || 'Project'}
            </span>
          </div>
          {currentProjectMembership && getRoleBadge(currentProjectMembership.role, currentProjectMembership.isOwner)}
        </div>

        {/* If member is in multiple shared projects, provide selector */}
        {member.projects.length > 1 && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Also in:</span>
            <div className="flex flex-wrap gap-1">
              {member.projects
                .filter((p) => p.projectId !== selectedProjectId)
                .map((p) => (
                  <button
                    key={p.projectId}
                    onClick={() => setSelectedProjectId(p.projectId)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {p.projectName}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemove}
        title={t.common?.delete || "Remove Member"}
        description={`Are you sure you want to remove ${member.fullName} from this project?`}
        confirmText={t.common?.delete || "Remove"}
        cancelText={t.common?.cancel || "Cancel"}
        isDestructive={true}
      />
    </div>
  );
}
