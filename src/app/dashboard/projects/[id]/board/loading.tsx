import React from 'react';

export default function BoardLoading() {
  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-white/5 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Board Columns Skeleton */}
      <div className="flex-1 overflow-x-auto flex gap-4 pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x snap-mandatory">
        {[...Array(4)].map((_, colIndex) => (
          <div 
            key={colIndex} 
            className="w-[280px] sm:w-[320px] shrink-0 snap-center flex flex-col gap-4 bg-white/[0.02] rounded-2xl p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse" />
              <div className="h-6 w-6 bg-white/5 rounded-md animate-pulse" />
            </div>

            {/* Cards inside column */}
            <div className="space-y-3">
              {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-4 w-3/4 bg-white/10 rounded-md animate-pulse" />
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-md animate-pulse" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-6 w-6 bg-white/10 rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
