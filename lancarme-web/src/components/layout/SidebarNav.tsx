import { navGroups, navItems } from '@/lib/navigation';
import { SidebarNavItem } from './SidebarNavItem';

export function SidebarNav() {
  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-4 px-2 py-4 flex-1 overflow-y-auto">
      {navGroups.map((group) => {
        const items = navItems.filter((item) => item.group === group);
        if (items.length === 0) return null;

        return (
          <div key={group}>
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-sidebar-text opacity-60 select-none">
              {group}
            </p>
            <div role="list" className="flex flex-col gap-0.5">
              {items.map((item) => (
                <SidebarNavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
