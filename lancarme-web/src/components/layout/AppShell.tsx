import type { ReactNode } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileDrawer } from './MobileDrawer';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isOpen, open, close } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Mobile drawer */}
      <MobileDrawer isOpen={isOpen} onClose={close} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar onMenuOpen={open} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
