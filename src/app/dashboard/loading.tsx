import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-white/5 rounded-md animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-white/5 rounded-md animate-pulse" />
              <div className="h-8 w-8 bg-white/5 rounded-lg animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-3 w-32 bg-white/5 rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse" />
          <div className="h-[300px] w-full bg-white/5 rounded-xl animate-pulse" />
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/5 rounded-xl animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-full bg-white/5 rounded-md animate-pulse" />
                  <div className="h-3 w-2/3 bg-white/5 rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
