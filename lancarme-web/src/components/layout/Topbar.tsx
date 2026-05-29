import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ApiStatusIndicator } from '@/components/shared/ApiStatusIndicator';

interface TopbarProps {
  onMenuOpen: () => void;
}

export function Topbar({ onMenuOpen }: TopbarProps) {
  return (
    <header
      role="banner"
      className="flex items-center justify-between h-14 px-4 bg-white border-b border-border flex-shrink-0"
    >
      {/* Left: hamburger (mobile only) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Abrir menu de navegação"
          className="lg:hidden p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 transition-colors"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <span className="font-semibold text-ink text-sm hidden lg:block">Command Center</span>
      </div>

      {/* Right: API status + user */}
      <div className="flex items-center gap-3">
        <ApiStatusIndicator />

        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-brand-light text-white text-xs font-semibold">GS</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-ink hidden sm:block">Gabriel Silva</span>
        </div>
      </div>
    </header>
  );
}
