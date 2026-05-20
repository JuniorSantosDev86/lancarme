import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza a tela técnica inicial em PT-BR', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => undefined)));

    renderApp();

    expect(screen.getByRole('heading', { name: 'Lançar.me' })).toBeInTheDocument();
    expect(screen.getByText('Status da API')).toBeInTheDocument();
    expect(screen.getByText('Consultando')).toBeInTheDocument();
    expect(screen.getByText('Aguardando resposta da API...')).toBeInTheDocument();
  });

  it('mostra estado operacional quando a API responde', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'UP',
          service: 'lancarme-api',
          version: '0.1.0',
        }),
      }),
    );

    renderApp();

    expect(await screen.findByText('Operacional')).toBeInTheDocument();
    expect(screen.getByText('API operacional')).toBeInTheDocument();
    expect(screen.getByText('0.1.0')).toBeInTheDocument();
  });

  it('mostra indisponibilidade quando a API não responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    renderApp();

    expect(await screen.findByText('Indisponível')).toBeInTheDocument();
    expect(
      screen.getByText(/Não foi possível consultar a API agora/),
    ).toBeInTheDocument();
  });
});
