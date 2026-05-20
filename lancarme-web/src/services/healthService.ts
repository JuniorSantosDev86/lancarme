import { apiGet, ApiClientError } from './apiClient';
import type { HealthResponse } from '../types/health';

function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const keys = Object.keys(candidate);

  return (
    keys.length === 3 &&
    candidate.status === 'UP' &&
    candidate.service === 'lancarme-api' &&
    typeof candidate.version === 'string' &&
    candidate.version.length > 0
  );
}

export async function fetchHealthStatus(): Promise<HealthResponse> {
  const response = await apiGet<unknown>('/health');

  if (!isHealthResponse(response)) {
    throw new ApiClientError('Resposta inválida da API.');
  }

  return response;
}
