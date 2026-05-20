const DEFAULT_TIMEOUT_MS = 3_000;

export class ApiClientError extends Error {
  constructor(message = 'Não foi possível consultar a API.') {
    super(message);
    this.name = 'ApiClientError';
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

export async function apiGet<T>(path: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiClientError();
    }

    return (await response.json()) as T;
  } catch {
    throw new ApiClientError();
  } finally {
    window.clearTimeout(timeoutId);
  }
}
