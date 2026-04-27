"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export function DashboardCharts({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mt-8 mb-8">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Mapeamento por Bairro</h3>
      <div className="h-72 w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="total" name="Total de Crianças" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="com_alertas" name="Com Alerta" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
