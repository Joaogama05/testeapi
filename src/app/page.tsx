import { DashboardSummary, DashboardSummarySkeleton } from "@/components/ui/DashboardSummary";
import { ChildList } from "@/components/ui/ChildList";
import { ChildService } from "@/modules/children/services/ChildService";
import { Suspense } from "react";
import { ChildCardSkeleton } from "@/components/ui/ChildCard";

export const dynamic = 'force-dynamic';

async function SummaryData() {
  const service = new ChildService();
  const data = await service.getSummary();
  return <DashboardSummary data={data} />;
}

async function ListData({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const service = new ChildService();
  
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 6;
  
  const filters: any = {};
  if (searchParams.bairro) filters.bairro = searchParams.bairro;
  if (searchParams.tem_alertas) filters.tem_alertas = searchParams.tem_alertas === 'true';
  if (searchParams.revisado) filters.revisado = searchParams.revisado === 'true';

  const result = await service.getFilteredChildren(filters, { page, limit });
  
  return <ChildList initialData={result.data} meta={result.meta} currentFilters={filters} />;
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Visão Geral</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Acompanhamento dos registros e alertas ativos.</p>
      </div>
      
      <Suspense fallback={<DashboardSummarySkeleton />}>
        <SummaryData />
      </Suspense>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Lista de Crianças</h3>
        </div>
        
        <div className="p-6">
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ChildCardSkeleton />
              <ChildCardSkeleton />
              <ChildCardSkeleton />
            </div>
          }>
            <ListData searchParams={resolvedParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
