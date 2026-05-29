import { aiCredits } from '../data/mockData';

export function AiCreditsCard() {
  const percent = Math.round((aiCredits.available / aiCredits.total) * 100);

  return (
    <div className="bg-surface-card rounded-lg border border-border shadow-sm p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Créditos de IA</p>
          <p className="text-2xl font-bold text-ink mt-0.5">{aiCredits.available}</p>
          <p className="text-xs text-ink-muted">de {aiCredits.total} disponíveis (demonstrativo)</p>
        </div>
        <button
          type="button"
          disabled
          className="text-xs text-ink-muted cursor-not-allowed opacity-50 flex items-center gap-1 mt-0.5"
        >
          Gerenciar
          <span className="bg-slate-100 rounded px-1 py-0.5 text-xs leading-none">Em breve</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-2" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${percent}% de créditos utilizados`}>
        <div
          className="bg-brand-light h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-ink-muted mt-1.5">{percent}% utilizado</p>
    </div>
  );
}
