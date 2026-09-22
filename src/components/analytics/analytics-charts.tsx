'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Lock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';

const PRIORITY_COLORS: Record<string, string> = {
  'Низкий': '#94a3b8',
  'Средний': '#60a5fa',
  'Высокий': '#fbbf24',
  'Срочный': '#fb7185',
};

export function AnalyticsCharts({ 
  tasksByStatus, 
  tasksByPriority,
  subscriptionTier
}: { 
  tasksByStatus: any[];
  tasksByPriority: any[];
  subscriptionTier: 'FREE' | 'PRO';
}) {
  const { lang, t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
          <h3 className="text-lg font-bold text-white mb-6">Распределение по статусам</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#12161f', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
          <h3 className="text-lg font-bold text-white mb-6">Задачи по приоритетам</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12161f', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {tasksByPriority.map(entry => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] }} />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Analytics Locked State */}
      <div className="relative overflow-hidden glass-panel rounded-2xl border border-indigo-500/20 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        {subscriptionTier === 'FREE' ? (
          <>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
            
            {/* Blurred background mock charts */}
            <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center gap-8">
              <div className="w-1/3 h-40 bg-gradient-to-t from-indigo-500/50 to-transparent rounded-lg" />
              <div className="w-1/3 h-60 bg-gradient-to-t from-purple-500/50 to-transparent rounded-lg" />
            </div>

            <div className="relative z-20 flex flex-col items-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 shadow-xl shadow-indigo-500/20">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Расширенная аналитика</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Расширенная аналитика доступна на тарифе PRO
              </p>
              <Link
                href="/dashboard/settings/billing"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Перейти на PRO
              </Link>
            </div>
          </>
        ) : (
          <div className="relative z-20 flex flex-col items-center max-w-md mx-auto">
             <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-500/20">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Расширенная аналитика</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Добро пожаловать в PRO аналитику.
              </p>
          </div>
        )}
      </div>
    </div>
  );
}
