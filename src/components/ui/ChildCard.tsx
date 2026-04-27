import { Child } from "@/modules/children/domain/Child";

export function ChildCard({ child, onReview }: { child: Child, onReview: (id: string, currentStatus: boolean) => void }) {
  const hasSaudeAlert = child.saude?.alertas && child.saude.alertas.length > 0;
  const hasEducacaoAlert = child.educacao?.alertas && child.educacao.alertas.length > 0;
  const hasSocialAlert = child.assistencia_social?.alertas && child.assistencia_social.alertas.length > 0;
  
  const hasAnyAlert = hasSaudeAlert || hasEducacaoAlert || hasSocialAlert;

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border transition-all ${hasAnyAlert ? 'border-red-200 dark:border-red-900/50 hover:shadow-md' : 'border-slate-100 dark:border-slate-700 hover:shadow-md'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">{child.nome || 'Nome não informado'}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">ID: {child.id.substring(0,8)}...</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${child.revisado ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'}`}>
          {child.revisado ? 'Revisado' : 'Pendente'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
          <span className="w-5 text-center mr-2">📍</span>
          {child.bairro || 'Bairro não informado'}
        </div>
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
          <span className="w-5 text-center mr-2">👤</span>
          Resp: {child.responsavel || 'Não informado'}
        </div>
      </div>

      {hasAnyAlert && (
        <div className="mb-4 space-y-1">
          {hasSaudeAlert && <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">⚠️ Saúde: {child.saude?.alertas.join(', ')}</div>}
          {hasEducacaoAlert && <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">⚠️ Educação: {child.educacao?.alertas.join(', ')}</div>}
          {hasSocialAlert && <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">⚠️ Social: {child.assistencia_social?.alertas.join(', ')}</div>}
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
        <button 
          onClick={() => onReview(child.id, child.revisado)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${child.revisado ? 'text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600' : 'text-white bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {child.revisado ? 'Desfazer Revisão' : 'Marcar como Revisado'}
        </button>
      </div>
    </div>
  );
}

export function ChildCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
        <div className="h-9 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  );
}
