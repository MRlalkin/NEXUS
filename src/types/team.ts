export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export interface ProjectInvitation {
  id: string;
  project_id: string;
  email: string;
  role: ProjectRole;
  token: string;
  invited_by: string;
  status: InvitationStatus;
  created_at: string;
  project?: {
    id: string;
    name: string;
    color: string;
  };
  inviter?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INVITATION' | 'TASK' | 'SYSTEM' | string;
  is_read: boolean;
  link?: string | null;
  created_at: string;
}

export interface TeamMemberItem {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string;
  projects: {
    projectId: string;
    projectName: string;
    role: ProjectRole;
    isOwner: boolean;
  }[];
  highestRole: ProjectRole;
  isOnline: boolean;
}
