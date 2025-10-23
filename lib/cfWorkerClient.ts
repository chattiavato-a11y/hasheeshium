import { sanitizeFormPayload } from './sanitize';

type Method = 'POST' | 'PUT';

interface SendOptions<T> {
  endpoint?: string;
  payload: T;
  method?: Method;
}

export interface WorkerResponse {
  ok: boolean;
  status: number;
  warnings?: string[];
  message?: string;
}

export const sendToWorker = async <T extends Record<string, unknown>>({
  endpoint,
  payload,
  method = 'POST'
}: SendOptions<T>): Promise<WorkerResponse> => {
  const sanitizedPayload = sanitizeFormPayload(payload);
  const warnings = Object.values(sanitizedPayload)
    .flatMap((item) => (Array.isArray(item) ? item.flatMap((entry) => entry.warnings) : item.warnings))
    .filter(Boolean);

  if (!endpoint) {
    return {
      ok: true,
      status: 204,
      warnings,
      message: 'Endpoint not configured. Payload sanitized locally for developer inspection.'
    };
  }

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-OPS-CYSEC': 'true'
    },
    body: JSON.stringify({
      payload: Object.fromEntries(
        Object.entries(sanitizedPayload).map(([key, value]) => [
          key,
          Array.isArray(value)
            ? value.map((entry) => entry.sanitized)
            : (value as { sanitized: unknown }).sanitized
        ])
      ),
      metadata: {
        generatedAt: new Date().toISOString(),
        framework: 'OPS-CySec-Core-NextJS'
      }
    })
  });

  return {
    ok: response.ok,
    status: response.status,
    warnings
  };
};
