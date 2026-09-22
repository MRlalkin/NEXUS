'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  ExternalLink, 
  Briefcase, 
  Calendar, 
  User, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export interface AdminProjectItem {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  owner: {
    id: string;
    full_name: string | null;
    username: string | null;
    email: string | null;
  } | null;
  taskCount: number;
  completedTaskCount: number;
}

interface ProjectTableProps {
  projects: AdminProjectItem[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((p) => {
    const term = search.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term);
    const descMatch = (p.description || '').toLowerCase().includes(term);
    const ownerNameMatch = (p.owner?.full_name || '').toLowerCase().includes(term);
    const ownerEmailMatch = (p.owner?.email || '').toLowerCase().includes(term);
    return nameMatch || descMatch || ownerNameMatch || ownerEmailMatch;
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3 p-3 rounded-2xl cyber-glass border border-white/[0.08] max-w-md">
        <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter projects by title, description, or owner..."
          className="bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none w-full"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-[10px] text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="cyber-glass rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4">Work Items</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No platform projects found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const ownerName = project.owner?.full_name || project.owner?.username || 'Unknown Owner';
                  const ownerEmail = project.owner?.email || 'No email registered';
                  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
                    project.owner?.username || project.owner?.email || 'user'
                  )}`;
                  const completionRate = project.taskCount > 0 
                    ? Math.round((project.completedTaskCount / project.taskCount) * 100) 
                    : 0;

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Project Name & Color */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border border-white/10"
                            style={{ backgroundColor: `${project.color || '#6366f1'}22` }}
                          >
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: project.color || '#6366f1' }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate max-w-[220px]">
                              {project.name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[260px]">
                              {project.description || 'No description provided'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner Info */}
                      <td className="py-3.5 px-4">
                        {project.owner ? (
                          <Link
                            href={`/admin/users/${project.owner.id}`}
                            className="flex items-center gap-2 group/owner hover:opacity-80 transition-opacity"
                          >
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0 relative">
                              <Image
                                src={avatarUrl}
                                alt={ownerName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-medium text-slate-200 group-hover/owner:text-rose-300 transition-colors block truncate max-w-[140px]">
                                {ownerName}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                                {ownerEmail}
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <User className="w-3.5 h-3.5" />
                            <span>Unassigned</span>
                          </div>
                        )}
                      </td>

                      {/* Work Items / Tasks */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Layers className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{project.taskCount} tasks</span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              ({completionRate}% done)
                            </span>
                          </div>
                          <div className="w-24 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {new Date(project.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/projects/${project.id}/board`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 text-[11px] font-semibold transition-colors"
                            title="Inspect Kanban Board"
                          >
                            <span>Open Board</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          {project.owner && (
                            <Link
                              href={`/admin/users/${project.owner.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-[11px] font-semibold transition-colors"
                              title="Inspect Owner Dossier"
                            >
                              <span>Dossier</span>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
