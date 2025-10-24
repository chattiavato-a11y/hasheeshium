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

  const trimmedEndpoint = endpoint?.trim();

  if (!trimmedEndpoint) {
    return {
      ok: true,
      status: 204,
      warnings,
      message: 'Endpoint not configured. Payload sanitized locally for developer inspection.'
    };
  }

  let url: URL | null = null;

  try {
    url = new URL(trimmedEndpoint);
  } catch {
    return {
      ok: true,
      status: 204,
      warnings: [
        ...warnings,
        'Endpoint misconfigured. Payload sanitized locally so the static experience remains browser-only.'
      ],
      message: 'Invalid endpoint blocked. Ensure production deployments reference a hardened remote worker.'
    };
  }

  const disallowedHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']);

  if (disallowedHosts.has(url.hostname)) {
    return {
      ok: true,
      status: 204,
      warnings: [
        ...warnings,
        `Local endpoint ${url.hostname} blocked to keep the experience 100% browser-based.`
      ],
      message:
        'Local endpoints are disabled. Configure a remote, secured worker endpoint for production submissions.'
    };
  }

  const response = await fetch(url.toString(), {
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
