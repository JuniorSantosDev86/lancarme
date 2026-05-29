import { greeting } from '../data/mockData';

export function WelcomeHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-ink">
        Olá, {greeting.name}! 👋
      </h1>
      <p className="text-sm text-ink-muted mt-1">{greeting.subtitle}</p>
      <p className="text-xs text-ink-muted mt-0.5">{greeting.date}</p>
    </div>
  );
}
