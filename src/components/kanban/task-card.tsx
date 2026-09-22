'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { TaskItem } from '@/types/kanban';
import { MessageSquare, Clock } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

interface TaskCardProps {
  task: TaskItem & { comment_count?: number };
  index: number;
  onClick: (task: TaskItem) => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const { t } = useTranslation();

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]';
      case 'HIGH':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const key = priority.toLowerCase() as keyof typeof t.kanban.priority;
    return t.kanban.priority[key] || priority;
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`group bg-[#161b26]/90 border border-white/10 rounded-xl p-3.5 shadow-lg cursor-grab transition-all hover:border-blue-500/40 active:cursor-grabbing ${
            snapshot.isDragging ? 'rotate-2 scale-105 shadow-blue-500/20 z-50 ring-1 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center border ${getPriorityColors(
                task.priority
              )}`}
            >
              {getPriorityLabel(task.priority)}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-[#F0F6FC] mb-3 leading-snug line-clamp-2">
            {task.title}
          </h4>

          <div className="flex items-center justify-between text-xs text-[#8B949E] mt-auto">
            <div className="flex items-center gap-3">
              {task.deadline && (
                <div
                  className={`flex items-center gap-1 ${
                    isOverdue ? 'text-rose-400 font-medium' : ''
                  }`}
                  title={isOverdue ? t.kanban.overdue : t.kanban.deadline}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(task.deadline).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1 hover:text-[#F0F6FC] transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{task.comment_count || 0}</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              {task.assignee ? (
                <img
                  src={task.assignee.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${task.assignee.full_name}`}
                  alt={task.assignee.full_name}
                  className="w-6 h-6 rounded-full border border-white/10"
                  title={task.assignee.full_name}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 border-dashed flex items-center justify-center text-[10px]" title="Unassigned">
                  ?
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
