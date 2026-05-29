import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CommandCenterPage } from '../modules/command-center/CommandCenterPage';

vi.mock('../hooks/useHealthStatus', () => ({
  useHealthStatus: vi.fn().mockReturnValue({
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    data: { status: 'UP', service: 'lancarme-api', version: '0.1.0' },
  }),
}));

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <CommandCenterPage />
    </QueryClientProvider>,
  );
}

describe('CommandCenterPage', () => {
  it('renderiza saudação ao usuário', () => {
    renderPage();
    expect(screen.getByText(/Olá, Gabriel!/)).toBeInTheDocument();
  });

  it('renderiza card de Receita', () => {
    renderPage();
    expect(screen.getByText('Receita')).toBeInTheDocument();
    expect(screen.getByText('R$ 127.450,00')).toBeInTheDocument();
  });

  it('renderiza card de Leads', () => {
    renderPage();
    expect(screen.getByText('Leads')).toBeInTheDocument();
    expect(screen.getByText('2.842')).toBeInTheDocument();
  });

  it('renderiza card de Vendas', () => {
    renderPage();
    expect(screen.getByText('Vendas')).toBeInTheDocument();
    expect(screen.getByText('148')).toBeInTheDocument();
  });

  it('renderiza card de ROAS', () => {
    renderPage();
    expect(screen.getByText('ROAS')).toBeInTheDocument();
    expect(screen.getByText('3,21')).toBeInTheDocument();
  });

  it('renderiza seção "Próximas Ações"', () => {
    renderPage();
    expect(screen.getByText('Próximas Ações')).toBeInTheDocument();
  });

  it('renderiza seção "Atividade Recente"', () => {
    renderPage();
    expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
  });

  it('renderiza seção "Créditos de IA"', () => {
    renderPage();
    expect(screen.getByText('Créditos de IA')).toBeInTheDocument();
  });

  it('renderiza seção "Ações Rápidas"', () => {
    renderPage();
    expect(screen.getByText('Ações Rápidas')).toBeInTheDocument();
  });

  it('renderiza seção "Desempenho Geral"', () => {
    renderPage();
    expect(screen.getByText('Desempenho Geral')).toBeInTheDocument();
  });

  it('renderiza progresso do lançamento', () => {
    renderPage();
    expect(screen.getByText('Lançamento Maio 2026')).toBeInTheDocument();
  });

  it('exibe identificação global de dados demonstrativos', () => {
    renderPage();
    expect(screen.getByText('Visualização demonstrativa')).toBeInTheDocument();
  });

  it('não há chamada de API real para métricas (dados estáticos)', () => {
    renderPage();
    expect(screen.queryByText(/Carregando/)).not.toBeInTheDocument();
  });
});
