"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Child } from "@/modules/children/domain/Child";
import { ChildCard } from "./ChildCard";

export function ChildList({ 
  initialData, 
  meta, 
  currentFilters 
}: { 
  initialData: Child[], 
  meta: any, 
  currentFilters: any 
}) {
  const router = useRouter();
  const [data, setData] = useState<Child[]>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to first page
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleReview = async (id: string, currentStatus: boolean) => {
    setIsUpdating(true);
    // Optimistic UI update
    setData(prev => prev.map(c => c.id === id ? { ...c, revisado: !currentStatus } : c));
    
    try {
      const res = await fetch(`/api/children/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisado: !currentStatus })
      });
      
      if (!res.ok) {
        // Revert on error
        setData(prev => prev.map(c => c.id === id ? { ...c, revisado: currentStatus } : c));
        alert("Erro ao atualizar status");
      } else {
        router.refresh(); // Refresh server data for summary updates
      }
    } catch (err) {
      setData(prev => prev.map(c => c.id === id ? { ...c, revisado: currentStatus } : c));
      alert("Erro de conexão");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
        <select 
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          value={currentFilters.revisado !== undefined ? currentFilters.revisado.toString() : ""}
          onChange={(e) => handleFilterChange("revisado", e.target.value)}
        >
          <option value="">Status: Todos</option>
          <option value="true">Apenas Revisados</option>
          <option value="false">Apenas Pendentes</option>
        </select>

        <select 
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          value={currentFilters.tem_alertas !== undefined ? currentFilters.tem_alertas.toString() : ""}
          onChange={(e) => handleFilterChange("tem_alertas", e.target.value)}
        >
          <option value="">Alertas: Todos</option>
          <option value="true">Com Alerta</option>
          <option value="false">Sem Alerta</option>
        </select>
      </div>

      {/* Grid of Cards */}
      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          Nenhuma criança encontrada com os filtros atuais.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(child => (
            <ChildCard key={child.id} child={child} onReview={handleReview} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mostrando página {meta.page} de {meta.last_page} ({meta.total} registros)
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Anterior
            </button>
            <button 
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.last_page}
              className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
