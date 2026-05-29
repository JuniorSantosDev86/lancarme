import { useHealthStatus } from '@/hooks/useHealthStatus';

export function ApiStatusIndicator() {
  const healthQuery = useHealthStatus();
  const isLoading = healthQuery.isLoading || healthQuery.isFetching;
  const isOperational = healthQuery.isSuccess && healthQuery.data.status === 'UP';

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-ink-muted" aria-live="polite" aria-label="Consultando API">
        <span className="inline-block w-2 h-2 rounded-full bg-ink-muted animate-pulse" aria-hidden="true" />
        <span className="hidden sm:inline">Consultando API</span>
      </div>
    );
  }

  if (isOperational) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-success" aria-live="polite" aria-label="API operacional">
        <span className="inline-block w-2 h-2 rounded-full bg-success" aria-hidden="true" />
        <span className="hidden sm:inline">API operacional</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-danger" aria-live="polite" aria-label="API indisponível">
      <span className="inline-block w-2 h-2 rounded-full bg-danger" aria-hidden="true" />
      <span className="hidden sm:inline">API indisponível</span>
    </div>
  );
}
