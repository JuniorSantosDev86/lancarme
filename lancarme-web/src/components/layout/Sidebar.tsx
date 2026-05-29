import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarNav } from './SidebarNav';

export function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-full bg-sidebar-bg flex-shrink-0"
      aria-label="Menu lateral"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
        <div className="w-8 h-8 bg-white/15 rounded-md flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
          <span className="text-white font-bold text-sm tracking-tight">L</span>
        </div>
        <span className="text-white font-bold text-base tracking-tight">Lançar.me</span>
      </div>

      {/* Navigation */}
      <SidebarNav />

      {/* Footer */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-white/10">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">GS</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">Gabriel Silva</p>
          <p className="text-xs text-sidebar-text opacity-70 truncate">Admin</p>
        </div>
      </div>
    </aside>
  );
}
