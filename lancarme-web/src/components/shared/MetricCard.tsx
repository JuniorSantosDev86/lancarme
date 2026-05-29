import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
}

export function MetricCard({ label, value, change, changeType = 'neutral', icon: Icon }: MetricCardProps) {
  const changeColor = cn(
    'text-xs font-medium',
    changeType === 'positive' && 'text-success',
    changeType === 'negative' && 'text-danger',
    changeType === 'neutral' && 'text-ink-muted',
  );

  return (
    <div className="bg-surface-card rounded-lg border border-border shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-ink-muted" aria-hidden="true" />}
      </div>
      <span className="text-xl font-bold text-ink">{value}</span>
      {change && <span className={changeColor}>{change} vs. mês anterior</span>}
    </div>
  );
}
