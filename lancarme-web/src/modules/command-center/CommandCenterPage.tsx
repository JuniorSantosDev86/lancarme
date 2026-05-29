import { demoLabel } from './data/mockData';
import { WelcomeHeader } from './components/WelcomeHeader';
import { OverviewCards } from './components/OverviewCards';
import { NextActionsPanel } from './components/NextActionsPanel';
import { RecentActivity } from './components/RecentActivity';
import { AiCreditsCard } from './components/AiCreditsCard';
import { QuickActions } from './components/QuickActions';
import { PerformanceChart } from './components/PerformanceChart';
import { LaunchProgress } from './components/LaunchProgress';

export function CommandCenterPage() {
  return (
    <div>
      {/* Identificação global de ambiente demonstrativo */}
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
          {demoLabel}
        </span>
      </div>

      <WelcomeHeader />
      <OverviewCards />

      {/* Layout de duas colunas em desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna principal (2/3) */}
        <div className="lg:col-span-2 flex flex-col">
          <PerformanceChart />
          <NextActionsPanel />
        </div>

        {/* Coluna lateral (1/3) */}
        <div className="flex flex-col">
          <RecentActivity />
          <AiCreditsCard />
          <QuickActions />
          <LaunchProgress />
        </div>
      </div>
    </div>
  );
}
