import { AppShell } from '@/components/layout/AppShell';
import { CommandCenterPage } from '@/modules/command-center/CommandCenterPage';

export function App() {
  return (
    <AppShell>
      <CommandCenterPage />
    </AppShell>
  );
}
