import { SectionHeader } from '@/components/shared/SectionHeader';
import { nextActions } from '../data/mockData';
import type { ActionStatus } from '../data/mockData';
import { cn } from '@/lib/utils';

function statusColor(status: ActionStatus) {
  return cn(
    'w-2 h-2 rounded-full flex-shrink-0 mt-1',
    status === 'pendente' && 'bg-warning',
    status === 'em_andamento' && 'bg-brand-light',
    status === 'concluido' && 'bg-success',
  );
}

function statusLabel(status: ActionStatus) {
  const labels: Record<ActionStatus, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluido: 'Concluído',
  };
  return labels[status];
}

export function NextActionsPanel() {
  return (
    <div className="bg-surface-card rounded-lg border border-border shadow-sm p-4 mb-4">
      <SectionHeader
        title="Próximas Ações"
        action={
          <button
            type="button"
            disabled
            className="text-xs text-ink-muted cursor-not-allowed opacity-50 flex items-center gap-1"
          >
            Ver todas
            <span className="bg-slate-100 text-ink-muted rounded px-1 py-0.5 text-xs leading-none">Em breve</span>
          </button>
        }
      />
      <ul className="flex flex-col gap-2.5" role="list">
        {nextActions.map((action) => (
          <li key={action.id} className="flex items-start gap-2.5">
            <span className={statusColor(action.status)} aria-label={statusLabel(action.status)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink truncate">{action.title}</p>
              <p className="text-xs text-ink-muted">{action.dueDate}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-ink-muted mt-3 pt-3 border-t border-border">Dados demonstrativos</p>
    </div>
  );
}
