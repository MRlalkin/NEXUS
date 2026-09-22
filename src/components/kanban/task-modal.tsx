'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { TaskItem, TaskPriority } from '@/types/kanban';
import { useTranslation } from '@/context/language-context';
import { updateTaskDetails, addComment, deleteComment } from '@/app/actions/tasks';
import { toast } from 'sonner';
import { X, Calendar, User, Flag, MessageSquare, Trash2, Send, Loader2 } from 'lucide-react';
import { TeamMemberItem } from '@/types/team';

interface TaskModalProps {
  task: TaskItem;
  projectId: string;
  teamMembers: TeamMemberItem[];
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ task, projectId, teamMembers, currentUserId, isOpen, onClose }: TaskModalProps) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [assigneeId, setAssigneeId] = useState<string | null>(task.assignee_id);
  const [deadline, setDeadline] = useState<string>(task.deadline ? task.deadline.split('T')[0] : '');

  const [newComment, setNewComment] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(task.title);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDescription(task.description || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPriority(task.priority);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAssigneeId(task.assignee_id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeadline(task.deadline ? task.deadline.split('T')[0] : '');
    
    // Fetch comments for this task
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/tasks/${task.id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };
    
    if (isOpen) {
      fetchComments();
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateTaskDetails(task.id, projectId, {
        title,
        description,
        priority,
        assignee_id: assigneeId,
        deadline: deadline || null,
      });

      if (result.success) {
        toast.success('Task updated successfully');
        onClose();
      } else {
        toast.error(result.error || 'Failed to update task');
      }
    });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const result = await addComment({
      taskId: task.id,
      content: newComment,
      projectId,
    });

    if (result.success && result.data) {
      setComments((prev) => [...prev, result.data]);
      setNewComment('');
    } else {
      toast.error(result.error || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const result = await deleteComment(commentId, projectId);
    if (result.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      toast.error(result.error || 'Failed to delete comment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {task.status}
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none outline-none text-xl font-bold text-[#F0F6FC] placeholder:text-slate-600 focus:ring-0 p-0"
              placeholder={t.kanban.taskTitlePlaceholder}
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.kanban.description}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description... (Markdown supported)"
                className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-y transition-all"
              />
            </div>

            {/* Comments Section */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-slate-300">
                <MessageSquare className="w-4 h-4" />
                <h4 className="font-semibold">{t.kanban.comments}</h4>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group">
                    <img
                      src={comment.author?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${comment.author?.full_name}`}
                      alt={comment.author?.full_name}
                      className="w-8 h-8 rounded-full border border-white/10 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-200">
                            {comment.author?.full_name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        {comment.author_id === currentUserId && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={t.kanban.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="mt-4 flex items-end gap-2">
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t.kanban.addCommentPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-none h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Flag className="w-3.5 h-3.5" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
              >
                <option value="LOW">{t.kanban.priority.low}</option>
                <option value="MEDIUM">{t.kanban.priority.medium}</option>
                <option value="HIGH">{t.kanban.priority.high}</option>
                <option value="URGENT">{t.kanban.priority.urgent}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <User className="w-3.5 h-3.5" />
                {t.kanban.assignee}
              </label>
              <select
                value={assigneeId || ''}
                onChange={(e) => setAssigneeId(e.target.value || null)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {t.kanban.deadline}
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            
            <div className="pt-6 mt-6 border-t border-white/10">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.kanban.save}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
