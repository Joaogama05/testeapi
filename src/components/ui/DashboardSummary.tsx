interface SummaryData {
  total: number;
  revisados: number;
  pendentes: number;
  com_alertas: number;
}

export function DashboardSummary({ data }: { data: SummaryData }) {
  const cards = [
    { title: "Total de Crianças", value: data.total, color: "bg-blue-500", icon: "👥" },
    { title: "Com Alertas", value: data.com_alertas, color: "bg-red-500", icon: "⚠️" },
    { title: "Casos Revisados", value: data.revisados, color: "bg-green-500", icon: "✅" },
    { title: "Pendentes", value: data.pendentes, color: "bg-amber-500", icon: "⏳" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.title}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
          </div>
          <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-xl text-white shadow-inner`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between animate-pulse">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      ))}
    </div>
  );
}
