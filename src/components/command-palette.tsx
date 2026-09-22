'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { searchEntities, type SearchResultProject, type SearchResultTask } from '@/app/actions/search';
import { logout } from '@/app/actions/auth';
import { useTranslation } from '@/context/language-context';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Bell, 
  BarChart3, 
  Settings, 
  Shield, 
  CheckSquare, 
  LogOut, 
  Loader2, 
  X, 
  Globe
} from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, startSearchTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<{
    projects: SearchResultProject[];
    tasks: SearchResultTask[];
  }>({ projects: [], tasks: [] });

  const router = useRouter();
  const { lang, setLanguage, t } = useTranslation();

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live entity search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({ projects: [], tasks: [] });
      return;
    }

    const timer = setTimeout(() => {
      startSearchTransition(async () => {
        const res = await searchEntities(query);
        if (res.success) {
          setSearchResults({ projects: res.projects || [], tasks: res.tasks || [] });
        }
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const handleToggleLanguage = () => {
    setLanguage(lang === 'ru' ? 'en' : 'ru');
  };

  return (
    <>
      {/* Quick Launch Pill Trigger for Desktop */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl cyber-glass border border-white/[0.08] hover:border-indigo-500/30 text-slate-400 hover:text-white transition-all text-xs cursor-pointer group shadow-sm"
        title="Open Command Palette (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        <span className="hidden xl:inline">Search or command...</span>
        <kbd className="pointer-events-none inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-white/[0.06] text-slate-400 border border-white/[0.08]">
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </button>

      {/* Modal Dialog Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="cyber-glass w-full max-w-xl rounded-3xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/15 overflow-hidden relative">
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <Command
              loop
              className="w-full bg-transparent flex flex-col"
              filter={(value, search) => {
                // If we're searching live entities, don't suppress results
                if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                return 0;
              }}
            >
              {/* Search Bar Header */}
              <div className="flex items-center px-4 border-b border-white/[0.08] relative">
                <Search className="w-4 h-4 text-indigo-400 mr-3 flex-shrink-0" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder={lang === 'ru' ? "Команда или поиск проектов и задач..." : "Type a command or search projects & tasks..."}
                  className="w-full py-4 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  autoFocus
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500 mr-2" />
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Command List */}
              <Command.List className="max-h-96 overflow-y-auto p-2 divide-y divide-white/[0.04]">
                <Command.Empty className="py-8 text-center text-xs text-slate-500">
                  {lang === 'ru' ? 'Нет совпадений.' : 'No matching commands, projects or tasks found.'}
                </Command.Empty>

                {/* Real Matched Projects */}
                {searchResults.projects.length > 0 && (
                  <Command.Group
                    heading={t.navigation?.projects || 'Projects'}
                    className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2.5 py-1.5"
                  >
                    {searchResults.projects.map((proj) => (
                      <Command.Item
                        key={proj.id}
                        value={`project-${proj.name}`}
                        onSelect={() =>
                          runCommand(() => router.push(`/dashboard/projects/${proj.id}/board`))
                        }
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                      >
                        <div
                          className="w-4 h-4 rounded-md flex-shrink-0"
                          style={{ backgroundColor: proj.color || '#6366f1' }}
                        />
                        <span className="font-semibold">{proj.name}</span>
                        <span className="text-[10px] text-slate-500 ml-auto">Board &rarr;</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Real Matched Tasks */}
                {searchResults.tasks.length > 0 && (
                  <Command.Group
                    heading={t.navigation?.tasks || 'Tasks'}
                    className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2.5 py-1.5"
                  >
                    {searchResults.tasks.map((task) => (
                      <Command.Item
                        key={task.id}
                        value={`task-${task.title}`}
                        onSelect={() =>
                          runCommand(() => router.push(`/dashboard/projects/${task.project_id}/board`))
                        }
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="font-medium truncate">{task.title}</span>
                        <span className="text-[10px] text-slate-500 ml-auto">
                          {task.projectName} &bull; {task.status}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Navigation Sections */}
                <Command.Group
                  heading="Navigation"
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 py-1.5"
                >
                  <Command.Item
                    value="dashboard"
                    onSelect={() => runCommand(() => router.push('/dashboard'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    <span>{t.navigation?.dashboard || 'Dashboard'}</span>
                  </Command.Item>

                  <Command.Item
                    value="team"
                    onSelect={() => runCommand(() => router.push('/dashboard/team'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                  >
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>{t.navigation?.team || 'Team'}</span>
                  </Command.Item>

                  <Command.Item
                    value="analytics"
                    onSelect={() => runCommand(() => router.push('/dashboard/analytics'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>{t.navigation?.analytics || 'Analytics'}</span>
                  </Command.Item>

                  <Command.Item
                    value="notifications"
                    onSelect={() => runCommand(() => router.push('/dashboard/notifications'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                  >
                    <Bell className="w-4 h-4 text-violet-400" />
                    <span>{t.navigation?.notifications || 'Notifications'}</span>
                  </Command.Item>
                </Command.Group>

                {/* Account Settings & General */}
                <Command.Group
                  heading="Settings & System"
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 py-1.5"
                >
                  <Command.Item
                    value="profile-settings"
                    onSelect={() => runCommand(() => router.push('/dashboard/settings/profile'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>{t.navigation?.settings || 'Settings'}</span>
                  </Command.Item>

                  <Command.Item
                    value="security-settings"
                    onSelect={() => runCommand(() => router.push('/dashboard/settings/security'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Security &amp; Password</span>
                  </Command.Item>

                  <Command.Item
                    value="language-toggle"
                    onSelect={() => runCommand(handleToggleLanguage)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer transition-colors aria-selected:bg-indigo-600/20 aria-selected:text-white"
                  >
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>{lang === 'ru' ? 'Switch to English' : 'Переключить на Русский'}</span>
                  </Command.Item>
                </Command.Group>

                {/* Quick Actions */}
                <Command.Group
                  heading="Quick Actions"
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 py-1.5"
                >
                  <Command.Item
                    value="quick-signout"
                    onSelect={() => runCommand(() => logout())}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors aria-selected:bg-rose-500/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.navigation?.logout || 'Logout'}</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Command Palette Footer */}
              <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 bg-black/30">
                <div className="flex items-center gap-3">
                  <span>Navigation: <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06]">↓</kbd></span>
                  <span>Select: <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06]">↵</kbd></span>
                </div>
                <span>Close: <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06]">esc</kbd></span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
