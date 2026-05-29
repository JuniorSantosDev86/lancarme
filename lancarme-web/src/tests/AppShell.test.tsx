import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from '../components/layout/AppShell';

vi.mock('../hooks/useHealthStatus', () => ({
  useHealthStatus: vi.fn().mockReturnValue({
    isLoading: true,
    isFetching: false,
    isSuccess: false,
    data: undefined,
  }),
}));

function renderShell(children?: React.ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AppShell>{children ?? <div>Conteúdo de teste</div>}</AppShell>
    </QueryClientProvider>,
  );
}

describe('AppShell', () => {
  it('renderiza a identidade "Lançar.me"', () => {
    renderShell();
    expect(screen.getByText('Lançar.me')).toBeInTheDocument();
  });

  it('renderiza elemento <header> (topbar)', () => {
    renderShell();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renderiza elemento <main> (área de conteúdo)', () => {
    renderShell();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renderiza o conteúdo passado via children', () => {
    renderShell(<p>Olá Command Center</p>);
    expect(screen.getByText('Olá Command Center')).toBeInTheDocument();
  });

  it('renderiza a navegação principal', () => {
    renderShell();
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
  });
});
