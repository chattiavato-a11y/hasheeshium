const DEFAULT_CONFIG = {
  bm25_min: 0.55,
  coverageNeeded: 1,
  k: 5
};

function resolveConfig() {
  if (typeof window === "undefined") {
    return { ...DEFAULT_CONFIG };
  }
  const overrides = window.opsSearchConfig || {};
  const bm25Min = typeof overrides.bm25_min === "number" ? overrides.bm25_min : DEFAULT_CONFIG.bm25_min;
  const coverageNeeded =
    typeof overrides.coverageNeeded === "number" ? overrides.coverageNeeded : DEFAULT_CONFIG.coverageNeeded;
  const k = typeof overrides.k === "number" ? overrides.k : DEFAULT_CONFIG.k;
  return {
    bm25_min: bm25Min,
    coverageNeeded,
    k
  };
}

async function postJSON(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, status: 0, error };
  }
}

function normalizeHits(rawHits = []) {
  if (!Array.isArray(rawHits)) return [];
  return rawHits.map((hit, index) => {
    const source = hit?.doc || hit || {};
    const id = source.id || hit?.id || `chunk-${index + 1}`;
    const title = source.title || source.heading || hit?.title || `Chunk #${index + 1}`;
    const url = source.url || hit?.url || "#";
    const text = source.text || source.content || hit?.text || "";
    const score = typeof hit?.score === "number" ? hit.score : typeof source.score === "number" ? source.score : 0;
    const highlights = Array.isArray(hit?.highlights) ? hit.highlights : [];
    return {
      score,
      doc: { id, title, url, text },
      highlights
    };
  });
}

function computeCoverage(hits, threshold) {
  return hits.filter((hit) => (hit.score || 0) >= threshold).length;
}

async function runPolicyPrecheck(query) {
  return postJSON("/api/secure/policy", { query, scope: "site-only" });
}

async function runRetrieval(query, k) {
  return postJSON("/api/secure/retrieve", { query, k });
}

async function runDraft(prompt, lang, hits) {
  const chunks = hits.map((hit) => ({
    id: hit.doc.id,
    title: hit.doc.title,
    url: hit.doc.url,
    text: hit.doc.text,
    score: hit.score
  }));
  return postJSON("/api/secure/draft", { prompt, lang, chunks });
}

export async function orchestrateRuntimeLayers(query, { lang } = {}) {
  const trimmed = (query || "").trim();
  if (!trimmed) {
    return { ok: false, reason: "empty" };
  }

  if (typeof fetch === "undefined") {
    return { ok: false, reason: "unsupported" };
  }

  const config = resolveConfig();

  const policy = await runPolicyPrecheck(trimmed);
  if (!policy.ok) {
    const status = policy.status || 0;
    if (status === 451) {
      return { ok: false, reason: "policy", status };
    }
    return { ok: false, reason: "policy-error", status };
  }

  const retrieval = await runRetrieval(trimmed, config.k);
  if (!retrieval.ok || !retrieval.data) {
    return { ok: false, reason: "retrieval", status: retrieval.status || 0 };
  }

  const rawData = retrieval.data || {};
  const hits = normalizeHits(rawData.hits || rawData.results || []);
  const bm25Max = typeof rawData.bm25_max === "number" ? rawData.bm25_max : 0;
  const coverage =
    typeof rawData.coverage === "number" ? rawData.coverage : computeCoverage(hits, config.bm25_min);

  if (bm25Max < config.bm25_min || coverage < config.coverageNeeded) {
    return {
      ok: false,
      reason: "confidence",
      metrics: { bm25_max: bm25Max, coverage },
      retrieval: rawData,
      hits
    };
  }

  const draft = await runDraft(trimmed, lang, hits);
  if (!draft.ok || !draft.data || !draft.data.answer) {
    return {
      ok: false,
      reason: "draft",
      status: draft.status || 0,
      metrics: { bm25_max: bm25Max, coverage },
      retrieval: rawData,
      hits
    };
  }

  const citations = Array.isArray(draft.data.citations) ? draft.data.citations : [];
  return {
    ok: true,
    metrics: { bm25_max: bm25Max, coverage },
    retrieval: rawData,
    result: {
      answer: draft.data.answer,
      citations,
      hits
    }
  };
}

export function getRuntimeSearchConfig() {
  return resolveConfig();
}
