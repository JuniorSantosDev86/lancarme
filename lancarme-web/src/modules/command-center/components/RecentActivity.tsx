import {
  UserPlus,
  TrendingUp,
  FileEdit,
  Lightbulb,
  Star,
} from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { recentActivity } from '../data/mockData';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  TrendingUp,
  FileEdit,
  Lightbulb,
  Star,
};

export function RecentActivity() {
  return (
    <div className="bg-surface-card rounded-lg border border-border shadow-sm p-4 mb-4">
      <SectionHeader title="Atividade Recente" />
      <ul className="flex flex-col gap-3" role="list">
        {recentActivity.map((event) => {
          const Icon = iconMap[event.iconName] ?? Star;
          return (
            <li key={event.id} className="flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-full bg-brand-surface flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink leading-snug">{event.description}</p>
                <p className="text-xs text-ink-muted mt-0.5">{event.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
