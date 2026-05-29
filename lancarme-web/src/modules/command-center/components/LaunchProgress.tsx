import { launchProgress } from '../data/mockData';

export function LaunchProgress() {
  const { name, percent, phases } = launchProgress;

  return (
    <div className="bg-surface-card rounded-lg border border-border shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <span className="text-lg font-bold text-brand">{percent}%</span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full bg-slate-100 rounded-full h-2.5 mb-3"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso do lançamento: ${percent}%`}
      >
        <div
          className="bg-brand-light h-2.5 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Phases */}
      <div className="flex gap-2">
        {phases.map((phase, i) => (
          <div key={phase} className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 1 ? 'bg-brand-light' : i === 0 ? 'bg-success' : 'bg-slate-200'}`}
              aria-hidden="true"
            />
            <span className="text-xs text-ink-muted">{phase}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-muted mt-3 pt-2 border-t border-border">Progresso demonstrativo</p>
    </div>
  );
}
