import { collectDeviceHeuristics } from "./security.js";

let cachedEndpoint;

function resolveEndpoint() {
  if (cachedEndpoint !== undefined) {
    return cachedEndpoint;
  }

  let endpoint = "";
  if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_CHATTIA_ENDPOINT) {
    endpoint = process.env.NEXT_PUBLIC_CHATTIA_ENDPOINT;
  }

  if (!endpoint && typeof window !== "undefined" && window.__CHATTIA_ENDPOINT__) {
    endpoint = window.__CHATTIA_ENDPOINT__;
  }

  if (!endpoint && typeof document !== "undefined" && document.documentElement?.dataset?.chattiaEndpoint) {
    endpoint = document.documentElement.dataset.chattiaEndpoint;
  }

  cachedEndpoint = endpoint || null;
  return cachedEndpoint;
}

export function hasChattiaEndpoint() {
  return Boolean(resolveEndpoint());
}

export async function invokeChattiaWorker({
  prompt,
  lang,
  sanitizedWarnings = [],
  retrieval,
  policyMessage,
  timeout = 15000
}) {
  const endpoint = resolveEndpoint();
  if (!endpoint) {
    return {
      ok: false,
      reason: "missing-endpoint"
    };
  }

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null;

  const heuristics = collectDeviceHeuristics();
  const payload = {
    prompt,
    lang,
    heuristics,
    sanitizedWarnings,
    retrieval,
    orchestration: {
      prefer: ["tiny-llm", "tiny-ml", "tiny-ai"],
      escalateTo: ["llm", "ml", "ai"],
      policy: "local-first"
    },
    policyMessage
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      credentials: "omit",
      mode: "cors",
      signal: controller ? controller.signal : undefined
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: `worker-${response.status}`
      };
    }

    const data = await response.json().catch(() => ({}));
    return {
      ok: true,
      data
    };
  } catch (error) {
    return {
      ok: false,
      reason: error && typeof error === "object" && "name" in error ? error.name : "network",
      error
    };
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
