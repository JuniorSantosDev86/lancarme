import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApiStatusIndicator } from '../components/shared/ApiStatusIndicator';

vi.mock('../hooks/useHealthStatus', () => ({
  useHealthStatus: vi.fn(),
}));

import { useHealthStatus } from '../hooks/useHealthStatus';

function renderIndicator() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ApiStatusIndicator />
    </QueryClientProvider>,
  );
}

describe('ApiStatusIndicator', () => {
  it('exibe "Consultando API" durante loading', () => {
    vi.mocked(useHealthStatus).mockReturnValue({
      isLoading: true,
      isFetching: false,
      isSuccess: false,
      data: undefined,
    } as ReturnType<typeof useHealthStatus>);

    renderIndicator();

    expect(screen.getByLabelText('Consultando API')).toBeInTheDocument();
  });

  it('exibe "API operacional" quando status é UP', () => {
    vi.mocked(useHealthStatus).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      data: { status: 'UP', service: 'lancarme-api', version: '0.1.0' },
    } as ReturnType<typeof useHealthStatus>);

    renderIndicator();

    expect(screen.getByLabelText('API operacional')).toBeInTheDocument();
  });

  it('exibe "API indisponível" quando a API falha', () => {
    vi.mocked(useHealthStatus).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      data: undefined,
    } as ReturnType<typeof useHealthStatus>);

    renderIndicator();

    expect(screen.getByLabelText('API indisponível')).toBeInTheDocument();
  });
});
