import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarNav } from './SidebarNav';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="p-0 w-72 bg-sidebar-bg border-r border-white/10 flex flex-col"
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/15 rounded-md flex items-center justify-center ring-1 ring-white/20">
              <span className="text-white font-bold text-sm tracking-tight">L</span>
            </div>
            <span className="text-white font-bold text-base tracking-tight">Lançar.me</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu de navegação"
            className="p-1.5 rounded-md text-sidebar-text hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-1 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>

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
      </SheetContent>
    </Sheet>
  );
}
