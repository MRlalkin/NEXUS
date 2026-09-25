/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskItem, TaskStatus } from '@/types/kanban';
import { TaskCard } from './task-card';
import { useLanguage } from '@/context/language-context';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: TaskItem[];
  onTaskClick: (task: TaskItem) => void;
}

export function KanbanColumn({ status, tasks, onTaskClick }: KanbanColumnProps) {
  const { t: typedT } = useLanguage();
  const t = typedT as any;

  const getColumnTitle = (status: TaskStatus) => {
    switch (status) {
      case 'TODO': return t.kanban.columns.todo;
      case 'IN_PROGRESS': return t.kanban.columns.inProgress;
      case 'IN_REVIEW': return t.kanban.columns.inReview;
      case 'DONE': return t.kanban.columns.done;
      default: return status;
    }
  };

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO': return 'bg-slate-500/20 text-slate-300';
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400';
      case 'IN_REVIEW': return 'bg-purple-500/20 text-purple-400';
      case 'DONE': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-white/10 text-white';
    }
  };

  return (
    <div className="flex flex-col w-full min-w-[280px] max-w-[320px] bg-[#0d1117]/50 rounded-2xl border border-white/[0.05] overflow-hidden backdrop-blur-xl shrink-0">
      <div className="p-4 border-b border-white/[0.05] flex items-center justify-between sticky top-0 bg-[#0d1117]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${getColumnColor(status).split(' ')[0]}`} />
          <h3 className="font-semibold text-sm tracking-wide text-[#F0F6FC]">
            {getColumnTitle(status)}
          </h3>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-white/5 text-xs font-medium text-[#8B949E]">
          {tasks.length}
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-3 min-h-[150px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
