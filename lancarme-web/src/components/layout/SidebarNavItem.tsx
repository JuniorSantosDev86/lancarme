import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/navigation';

interface SidebarNavItemProps {
  item: NavItem;
}

export function SidebarNavItem({ item }: SidebarNavItemProps) {
  const Icon = item.icon;

  if (item.active) {
    return (
      <div
        role="listitem"
        aria-current="page"
        className="flex items-center gap-3 rounded-md px-3 py-2 bg-sidebar-active text-white transition-colors duration-150"
      >
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
    );
  }

  return (
    <div
      role="listitem"
      aria-disabled="true"
      className={cn(
        'flex items-center justify-between gap-3 rounded-md px-3 py-2',
        'text-sidebar-text opacity-50 cursor-default',
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm truncate">{item.label}</span>
      </div>
      {item.comingSoon && (
        <span className="flex-shrink-0 text-xs bg-white/10 text-sidebar-text rounded px-1.5 py-0.5 leading-none">
          Em breve
        </span>
      )}
    </div>
  );
}
