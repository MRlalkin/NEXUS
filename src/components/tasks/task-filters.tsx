'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, Check } from 'lucide-react';

const statuses = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'DONE', label: 'Done' }
];

export function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStatus = searchParams.get('status') || 'ALL';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
          currentStatus !== 'ALL' 
            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' 
            : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/[0.05]'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filter{currentStatus !== 'ALL' ? `: ${statuses.find(s => s.value === currentStatus)?.label}` : ''}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1b23] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="py-1">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleSelect(status.value)}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 flex items-center justify-between"
              >
                {status.label}
                {currentStatus === status.value && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
