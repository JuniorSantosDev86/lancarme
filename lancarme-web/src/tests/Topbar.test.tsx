import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Topbar } from '../components/layout/Topbar';

vi.mock('../hooks/useHealthStatus', () => ({
  useHealthStatus: vi.fn().mockReturnValue({
    isLoading: true,
    isFetching: false,
    isSuccess: false,
    data: undefined,
  }),
}));

function renderTopbar(onMenuOpen = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <Topbar onMenuOpen={onMenuOpen} />
    </QueryClientProvider>,
  );
}

describe('Topbar', () => {
  it('renderiza o botão hambúrguer com aria-label correto', () => {
    renderTopbar();
    expect(screen.getByRole('button', { name: 'Abrir menu de navegação' })).toBeInTheDocument();
  });

  it('botão hambúrguer invoca callback ao ser clicado', async () => {
    const onMenuOpen = vi.fn();
    renderTopbar(onMenuOpen);
    const btn = screen.getByRole('button', { name: 'Abrir menu de navegação' });
    await userEvent.click(btn);
    expect(onMenuOpen).toHaveBeenCalledTimes(1);
  });

  it('renderiza nome de usuário estático "Gabriel Silva"', () => {
    renderTopbar();
    expect(screen.getByText('Gabriel Silva')).toBeInTheDocument();
  });

  it('renderiza o ApiStatusIndicator na topbar', () => {
    renderTopbar();
    expect(screen.getByLabelText('Consultando API')).toBeInTheDocument();
  });

  it('não renderiza nenhum ícone decorativo como button clicável', () => {
    renderTopbar();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });
});
