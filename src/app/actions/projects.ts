'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface CreateProjectResponse {
  success: boolean;
  error?: string;
  project?: {
    id: string;
    name: string;
    color: string;
  };
}

export async function createProject(formData: FormData): Promise<CreateProjectResponse> {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const color = (formData.get('color') as string) || '#6366f1';
  const due_date = (formData.get('due_date') as string)?.trim();

  if (!name) {
    return { success: false, error: 'Project name is required.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    // Insert project
    const { data: project, error: insertError } = await supabaseAdmin
      .from('projects')
      .insert({
        name,
        description: description || null,
        color,
        owner_id: user.id,
        ...(due_date ? { due_date } : {})
      })
      .select('id, name, color')
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // Add owner to project_members using upsert as requested to guarantee ownership
    await supabaseAdmin.from('project_members').upsert({
      project_id: project.id,
      user_id: user.id,
      role: 'OWNER',
    });

    // Record activity log
    await supabaseAdmin.from('activity_logs').insert({
      project_id: project.id,
      user_id: user.id,
      action: 'CREATED_PROJECT',
      metadata: {
        name: project.name,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');
    revalidatePath('/dashboard/team');
    return { success: true, project };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create project.';
    return { success: false, error: message };
  }
}
