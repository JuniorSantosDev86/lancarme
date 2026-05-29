import {
  Pen,
  Image,
  BarChart2,
  Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { quickActions } from '../data/mockData';

const iconMap: Record<string, LucideIcon> = {
  Pen,
  Image,
  BarChart2,
  Rocket,
};

export function QuickActions() {
  return (
    <div className="bg-surface-card rounded-lg border border-border shadow-sm p-4 mb-4">
      <SectionHeader title="Ações Rápidas" />
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => {
          const Icon = iconMap[action.iconName] ?? Pen;
          return (
            <div
              key={action.id}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-slate-50 cursor-default opacity-60"
              aria-hidden="true"
            >
              <Icon className="w-5 h-5 text-ink-muted" aria-hidden="true" />
              <span className="text-xs text-ink-muted text-center leading-tight">{action.label}</span>
              <span className="text-xs bg-slate-200 text-ink-muted rounded px-1.5 py-0.5 leading-none">Em breve</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
