"use client";

import { useState, useEffect } from "react";
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

  // Sync state when server data changes due to URL searchParams navigation
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

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
      
      if (res.status === 401) {
        alert("Sessão expirada. Redirecionando para o login...");
        window.location.href = '/login';
        return;
      }
      
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
      <nav aria-label="Filtros de busca" className="flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
        <input
          type="text"
          id="search-input"
          aria-label="Buscar por nome ou ID"
          title="Digite o nome ou ID para buscar"
          placeholder="Buscar por nome ou ID..."
          className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          defaultValue={currentFilters.search || ""}
          onBlur={(e) => handleFilterChange("search", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleFilterChange("search", e.currentTarget.value);
            }
          }}
        />

        <select 
          id="status-filter"
          aria-label="Filtrar por Status de Revisão"
          title="Selecione o status de revisão"
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          value={currentFilters.revisado !== undefined ? currentFilters.revisado.toString() : ""}
          onChange={(e) => handleFilterChange("revisado", e.target.value)}
        >
          <option value="">Status: Todos</option>
          <option value="true">Apenas Revisados</option>
          <option value="false">Apenas Pendentes</option>
        </select>

        <select 
          id="alert-filter"
          aria-label="Filtrar por Alertas"
          title="Selecione se deseja ver crianças com alertas"
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          value={currentFilters.tem_alertas !== undefined ? currentFilters.tem_alertas.toString() : ""}
          onChange={(e) => handleFilterChange("tem_alertas", e.target.value)}
        >
          <option value="">Alertas: Todos</option>
          <option value="true">Com Alerta</option>
          <option value="false">Sem Alerta</option>
        </select>
      </nav>

      {/* Grid of Cards */}
      <div role="region" aria-live="polite" aria-label="Lista de Crianças">
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
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <nav aria-label="Paginação" className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
            Mostrando página {meta.page} de {meta.last_page} ({meta.total} registros)
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              aria-label="Página Anterior"
              className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              Anterior
            </button>
            <button 
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.last_page}
              aria-label="Próxima Página"
              className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              Próxima
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
