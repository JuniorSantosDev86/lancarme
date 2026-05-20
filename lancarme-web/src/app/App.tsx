import { useHealthStatus } from '../hooks/useHealthStatus';

export function App() {
  const healthQuery = useHealthStatus();
  const isOperational = healthQuery.isSuccess && healthQuery.data.status === 'UP';

  return (
    <main className="min-h-screen bg-field px-6 py-10 text-ink">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="border-b border-ink/10 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Fundação técnica
          </p>
          <h1 className="mt-3 text-4xl font-bold">Lançar.me</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/75">
            Tela inicial técnica em PT-BR para validar a comunicação entre a web
            e a API antes dos módulos de produto.
          </p>
        </header>

        <section
          aria-live="polite"
          className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Status da API</h2>
              <p className="mt-2 text-sm text-ink/70">
                Contrato público: <code>GET /api/v1/health</code>
              </p>
            </div>

            <span
              data-testid="api-status-badge"
              className={[
                'inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold',
                healthQuery.isLoading || healthQuery.isFetching
                  ? 'bg-warning/10 text-warning'
                  : isOperational
                    ? 'bg-accent/10 text-accent'
                    : 'bg-danger/10 text-danger',
              ].join(' ')}
            >
              {healthQuery.isLoading || healthQuery.isFetching
                ? 'Consultando'
                : isOperational
                  ? 'Operacional'
                  : 'Indisponível'}
            </span>
          </div>

          <div className="mt-6" data-testid="api-status-message">
            {healthQuery.isLoading || healthQuery.isFetching ? (
              <p>Aguardando resposta da API...</p>
            ) : isOperational ? (
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-semibold">Serviço</dt>
                  <dd>{healthQuery.data.service}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Status</dt>
                  <dd>API operacional</dd>
                </div>
                <div>
                  <dt className="font-semibold">Versão</dt>
                  <dd>{healthQuery.data.version}</dd>
                </div>
              </dl>
            ) : (
              <p>
                Não foi possível consultar a API agora. Confirme se o backend
                está rodando em <code>http://localhost:8080</code>.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
