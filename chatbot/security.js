const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;
const HTML_TAGS = /<\/?[a-z][^>]*>/gi;
const SCRIPT_SIGNATURE = /<\s*script|javascript:|data:text\/html|document\.cookie|eval\s*\(|function\s*\(|=>|import\s*\(|fetch\s*\(|onerror\s*=|onload\s*=/i;
const ENCODED_PAYLOAD = /%3C|%3E|%28|%29|%3B|%60|%22|%27/gi;
const SQL_SIGNATURE = /(UNION\s+SELECT|SELECT\s+\*|DROP\s+TABLE|INSERT\s+INTO|UPDATE\s+[a-z0-9_]+\s+SET)/i;
const SHELL_SIGNATURE = /(\|\||&&|;\s*rm\b|;\s*curl\b|;\s*wget\b|;\s*cat\b)/i;
const URL_PATTERN = /(https?:\/\/|www\.)/i;

function resetAndTest(regex, value) {
  regex.lastIndex = 0;
  return regex.test(value);
}

function resetAndReplace(regex, value, replacement) {
  regex.lastIndex = 0;
  return value.replace(regex, replacement);
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

export function sanitizeUtterance(value, { maxLength = 600 } = {}) {
  const original = typeof value === "string" ? value : "";
  let sanitized = original.slice(0, maxLength);
  const warnings = [];
  let blocked = false;

  if (!sanitized.trim()) {
    return { original, cleanText: "", warnings: [], blocked: false };
  }

  if (resetAndTest(CONTROL_CHARS, sanitized)) {
    sanitized = resetAndReplace(CONTROL_CHARS, sanitized, " ");
    warnings.push("control-characters-stripped");
  }

  if (resetAndTest(HTML_TAGS, sanitized)) {
    sanitized = resetAndReplace(HTML_TAGS, sanitized, " ");
    warnings.push("html-tags-removed");
  }

  if (resetAndTest(ENCODED_PAYLOAD, sanitized)) {
    sanitized = resetAndReplace(ENCODED_PAYLOAD, sanitized, " ");
    warnings.push("encoded-payload-removed");
  }

  if (resetAndTest(URL_PATTERN, sanitized)) {
    sanitized = resetAndReplace(URL_PATTERN, sanitized, " ");
    warnings.push("url-removed");
  }

  if (SCRIPT_SIGNATURE.test(original)) {
    blocked = true;
    warnings.push("script-signature-detected");
  }

  if (SQL_SIGNATURE.test(original)) {
    blocked = true;
    warnings.push("sql-signature-detected");
  }

  if (SHELL_SIGNATURE.test(original)) {
    blocked = true;
    warnings.push("shell-signature-detected");
  }

  sanitized = normalizeWhitespace(sanitized);

  if (!sanitized) {
    blocked = true;
    warnings.push("empty-after-sanitization");
  }

  return { original, cleanText: sanitized, warnings, blocked };
}

export function describeSanitization(warnings, lang = "en") {
  if (!warnings || warnings.length === 0) {
    return null;
  }
  const messages = {
    en: {
      "control-characters-stripped": "Non-speech control characters were removed.",
      "html-tags-removed": "HTML markup was cleared before processing.",
      "encoded-payload-removed": "Encoded payload fragments were removed.",
      "url-removed": "URLs were stripped from the utterance.",
      "script-signature-detected": "Potential script content detected.",
      "sql-signature-detected": "Potential database manipulation detected.",
      "shell-signature-detected": "Shell command pattern detected.",
      "empty-after-sanitization": "No meaningful content remained after sanitization."
    },
    es: {
      "control-characters-stripped": "Se eliminaron caracteres de control no hablados.",
      "html-tags-removed": "Se limpiaron las etiquetas HTML antes de procesar.",
      "encoded-payload-removed": "Se quitaron fragmentos codificados sospechosos.",
      "url-removed": "Se eliminaron las URL de la transcripción.",
      "script-signature-detected": "Se detectó posible contenido de script.",
      "sql-signature-detected": "Se detectó posible manipulación de base de datos.",
      "shell-signature-detected": "Se detectó un patrón de comando de shell.",
      "empty-after-sanitization": "No quedó contenido útil tras la sanitización."
    }
  };

  const dictionary = messages[lang] || messages.en;
  return warnings.map((warning) => dictionary[warning] || warning);
}

export function collectDeviceHeuristics() {
  if (typeof navigator === "undefined") {
    return {
      hasWebGPU: false,
      hardwareConcurrency: 0,
      deviceMemory: 0,
      recommendedModel: "llama-3.2-1b",
      rationale: "server-side-render"
    };
  }

  const hasWebGPU = typeof navigator.gpu !== "undefined";
  const hardwareConcurrency = navigator.hardwareConcurrency || 0;
  const deviceMemory = navigator.deviceMemory || 0;

  let recommendedModel = "llama-3.2-1b";
  if (hasWebGPU && deviceMemory >= 12 && hardwareConcurrency >= 8) {
    recommendedModel = "llama-3.2-3b";
  } else if (hasWebGPU && deviceMemory >= 8) {
    recommendedModel = "qwen2.5-1.5b";
  } else if (hasWebGPU) {
    recommendedModel = "llama-3.2-1b";
  } else if (deviceMemory >= 4 && hardwareConcurrency >= 4) {
    recommendedModel = "piper-medium";
  }

  return {
    hasWebGPU,
    hardwareConcurrency,
    deviceMemory,
    recommendedModel,
    rationale: hasWebGPU
      ? "webgpu-available"
      : deviceMemory >= 4
      ? "cpu-tier"
      : "fallback"
  };
}
