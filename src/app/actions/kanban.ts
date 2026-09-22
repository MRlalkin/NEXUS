'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateTaskStatus(taskId: string, status: string, orderIndex: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // Get the task first to check permissions (member of project)
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('id', taskId)
      .single();

    if (fetchError || !task) return { success: false, error: 'Task not found' };

    // Update status and order
    const { error: updateError } = await supabaseAdmin
      .from('tasks')
      .update({ status, order_index: orderIndex })
      .eq('id', taskId);

    if (updateError) return { success: false, error: updateError.message };

    // Log activity
    await supabaseAdmin.from('activity_logs').insert({
      project_id: task.project_id,
      user_id: user.id,
      action: 'MOVED_TASK',
      metadata: { taskId, status }
    });

    revalidatePath(`/dashboard/projects/${task.project_id}/board`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createTask(formData: FormData) {
  try {
    const projectId = formData.get('project_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string || 'TODO';
    const priority = formData.get('priority') as string || 'MEDIUM';
    const assigneeId = formData.get('assignee_id') as string;
    
    if (!projectId || !title) return { success: false, error: 'Missing required fields' };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    // Get max order index for this status
    const { data: maxOrderTask } = await supabaseAdmin
      .from('tasks')
      .select('order_index')
      .eq('project_id', projectId)
      .eq('status', status)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const newOrderIndex = maxOrderTask ? (maxOrderTask.order_index || 0) + 1 : 0;

    const { data: task, error: insertError } = await supabaseAdmin
      .from('tasks')
      .insert({
        project_id: projectId,
        title,
        description: description || null,
        status,
        priority,
        assignee_id: assigneeId || null,
        created_by: user.id,
        order_index: newOrderIndex
      })
      .select()
      .single();

    if (insertError) return { success: false, error: insertError.message };

    await supabaseAdmin.from('activity_logs').insert({
      project_id: projectId,
      user_id: user.id,
      action: 'CREATED_TASK',
      metadata: { taskId: task.id, title }
    });

    revalidatePath(`/dashboard/projects/${projectId}/board`);
    revalidatePath(`/dashboard/projects/${projectId}/tasks`);
    return { success: true, task };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const { data: task } = await supabase.from('tasks').select('project_id, title').eq('id', taskId).single();
    if (!task) return { success: false, error: 'Task not found' };

    const { error } = await supabaseAdmin.from('tasks').delete().eq('id', taskId);
    if (error) return { success: false, error: error.message };

    await supabaseAdmin.from('activity_logs').insert({
      project_id: task.project_id,
      user_id: user.id,
      action: 'DELETED_TASK',
      metadata: { taskId, title: task.title }
    });

    revalidatePath(`/dashboard/projects/${task.project_id}/board`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function addComment(taskId: string, content: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };
    if (!content.trim()) return { success: false, error: 'Comment cannot be empty' };

    const { data: task } = await supabase.from('tasks').select('project_id').eq('id', taskId).single();
    if (!task) return { success: false, error: 'Task not found' };

    const { data: comment, error } = await supabaseAdmin
      .from('task_comments')
      .insert({
        task_id: taskId,
        user_id: user.id,
        content
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    await supabaseAdmin.from('activity_logs').insert({
      project_id: task.project_id,
      user_id: user.id,
      action: 'ADDED_COMMENT',
      metadata: { taskId, commentId: comment.id }
    });

    revalidatePath(`/dashboard/projects/${task.project_id}/board`);
    return { success: true, comment };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
