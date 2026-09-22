'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface SearchResultProject {
  id: string;
  name: string;
  color: string;
  description?: string | null;
}

export interface SearchResultTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  project_id: string;
  projectName?: string;
  projectColor?: string;
}

export interface SearchEntitiesResponse {
  success: boolean;
  projects: SearchResultProject[];
  tasks: SearchResultTask[];
  error?: string;
}

export async function searchEntities(query: string): Promise<SearchEntitiesResponse> {
  const cleanQuery = query?.trim();
  if (!cleanQuery || cleanQuery.length < 1) {
    return { success: true, projects: [], tasks: [] };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, projects: [], tasks: [], error: 'Unauthorized' };
    }

    // 1. Find user's accessible projects matching query
    // Get accessible project IDs first
    const { data: ownedProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('owner_id', user.id);

    const { data: memberProjects } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', user.id);

    const accessibleIds = Array.from(
      new Set([
        ...(ownedProjects || []).map((p) => p.id),
        ...(memberProjects || []).map((p) => p.project_id),
      ])
    );

    if (accessibleIds.length === 0) {
      return { success: true, projects: [], tasks: [] };
    }

    // Search matching projects
    const { data: matchedProjects } = await supabaseAdmin
      .from('projects')
      .select('id, name, color, description')
      .in('id', accessibleIds)
      .ilike('name', `%${cleanQuery}%`)
      .limit(6);

    // 2. Search matching tasks within accessible projects
    const { data: matchedTasks } = await supabaseAdmin
      .from('tasks')
      .select('id, title, status, priority, project_id, project:projects!project_id(id, name, color)')
      .in('project_id', accessibleIds)
      .ilike('title', `%${cleanQuery}%`)
      .limit(8);

    // Format tasks
    const formattedTasks: SearchResultTask[] = (matchedTasks || []).map((t) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = t.project as any;
      return {
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        project_id: t.project_id,
        projectName: p?.name || 'Project',
        projectColor: p?.color || '#6366f1',
      };
    });

    return {
      success: true,
      projects: (matchedProjects || []) as SearchResultProject[],
      tasks: formattedTasks,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Search failed';
    return { success: false, projects: [], tasks: [], error: message };
  }
}
