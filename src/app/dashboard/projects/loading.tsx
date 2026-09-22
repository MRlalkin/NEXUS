import React from 'react';

export default function ProjectsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-white/5 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-6 w-3/4 bg-white/5 rounded-md animate-pulse" />
                <div className="h-4 w-full bg-white/5 rounded-md animate-pulse" />
                <div className="h-4 w-5/6 bg-white/5 rounded-md animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 bg-white/5 rounded-md animate-pulse" />
                <div className="h-3 w-8 bg-white/5 rounded-md animate-pulse" />
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full animate-pulse overflow-hidden">
                <div className="h-full bg-white/10 w-1/3" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-8 w-8 rounded-full bg-white/10 border-2 border-[#0D1117] animate-pulse" />
                ))}
              </div>
              <div className="h-4 w-20 bg-white/5 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
