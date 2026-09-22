'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Layers, Activity, AlertCircle } from 'lucide-react';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface TrendDataItem {
  name: string;
  added: number;
  completed: number;
}

interface AnalyticsChartsProps {
  tasksByStatus: ChartDataItem[];
  tasksByPriority: ChartDataItem[];
  tasksTrend: TrendDataItem[];
}

export function AnalyticsCharts({
  tasksByStatus,
  tasksByPriority,
  tasksTrend
}: AnalyticsChartsProps) {
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#12161f]/90 backdrop-blur-md border border-white/[0.08] p-3 rounded-xl shadow-xl">
          <p className="text-xs font-semibold text-slate-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs mb-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-400 capitalize">{entry.name}:</span>
              <span className="text-white font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#12161f]/90 backdrop-blur-md border border-white/[0.08] p-3 rounded-xl shadow-xl flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-xs text-slate-300 font-semibold">{data.name}:</span>
          <span className="text-xs text-white font-bold">{data.value}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Row: Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers className="w-24 h-24 text-indigo-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mb-6 relative z-10 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Распределение по статусам
          </h3>
          <div className="h-64 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} cursor={{ fill: 'transparent' }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-24 h-24 text-rose-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mb-6 relative z-10 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Распределение по приоритетам
          </h3>
          <div className="h-64 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} cursor={{ fill: 'transparent' }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Trend Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
        <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Динамика задач (Добавлено vs Завершено)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tasksTrend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }} />
              <Bar 
                dataKey="added" 
                name="Добавлено задач" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
              <Bar 
                dataKey="completed" 
                name="Завершено задач" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
