import { MetricCard } from '@/components/shared/MetricCard';
import { overviewCards } from '../data/mockData';

export function OverviewCards() {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {overviewCards.map((card) => (
          <MetricCard
            key={card.id}
            label={card.label}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
          />
        ))}
      </div>
    </div>
  );
}
