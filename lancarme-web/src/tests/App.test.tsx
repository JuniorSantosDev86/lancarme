import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';

vi.mock('../hooks/useHealthStatus', () => ({
  useHealthStatus: vi.fn().mockReturnValue({
    isLoading: true,
    isFetching: false,
    isSuccess: false,
    data: undefined,
  }),
}));

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('renderiza a identidade "Lançar.me" na sidebar', () => {
    renderApp();
    expect(screen.getByText('Lançar.me')).toBeInTheDocument();
  });

  it('renderiza a topbar com papel de banner', () => {
    renderApp();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renderiza a área principal de conteúdo', () => {
    renderApp();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renderiza o Command Center com saudação ao usuário', () => {
    renderApp();
    expect(screen.getByText(/Olá, Gabriel!/)).toBeInTheDocument();
  });

  it('renderiza o ApiStatusIndicator na topbar', () => {
    renderApp();
    expect(screen.getByLabelText('Consultando API')).toBeInTheDocument();
  });

  it('exibe identificação de visualização demonstrativa', () => {
    renderApp();
    expect(screen.getByText('Visualização demonstrativa')).toBeInTheDocument();
  });

  it('não tem react-router-dom (sem BrowserRouter no DOM)', () => {
    const { container } = renderApp();
    expect(container.querySelector('[data-router]')).toBeNull();
  });
});
