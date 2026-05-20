import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchHealthStatus } from '../services/healthService';

describe('healthService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna o status quando a resposta segue o contrato', async () => {
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

    await expect(fetchHealthStatus()).resolves.toEqual({
      status: 'UP',
      service: 'lancarme-api',
      version: '0.1.0',
    });
  });

  it('falha quando a resposta inclui campos fora do contrato', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'UP',
          service: 'lancarme-api',
          version: '0.1.0',
          database: 'postgres',
        }),
      }),
    );

    await expect(fetchHealthStatus()).rejects.toThrow('Resposta inválida da API.');
  });

  it('falha com erro sanitizado quando a rede falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED postgres')));

    await expect(fetchHealthStatus()).rejects.toThrow('Não foi possível consultar a API.');
  });

  it('falha com erro sanitizado quando a API retorna indisponibilidade', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'internal stack trace' }),
      }),
    );

    await expect(fetchHealthStatus()).rejects.toThrow('Não foi possível consultar a API.');
  });
});
