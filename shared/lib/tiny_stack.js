const hasWindow = () => typeof window !== "undefined";

const resolveNavigator = () => {
  if (!hasWindow()) return {};
  return window.navigator || {};
};

const resolveDocumentLang = () => {
  if (!hasWindow() || !window.document) return "en";
  const { documentElement } = window.document;
  return documentElement?.lang || "en";
};

export const DeviceClass = (() => {
  const navigatorInfo = resolveNavigator();
  const cores = navigatorInfo.hardwareConcurrency || 4;
  const hasWebGPU = Boolean(navigatorInfo.gpu || (hasWindow() && window.navigator?.gpu));
  if (hasWebGPU && cores >= 8) return "pro";
  if (cores >= 4) return "standard";
  return "lite";
})();

export function hasNativeSTT() {
  if (!hasWindow()) return false;
  const w = window;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function hasSpeechSynthesis() {
  if (!hasWindow()) return false;
  return Boolean(window.speechSynthesis);
}

export function startSTT(onText, { lang, interim = true, onEnd, onError } = {}) {
  if (!hasNativeSTT()) {
    return { stop: () => {}, supported: false };
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = lang || resolveDocumentLang();
  recognition.continuous = true;
  recognition.interimResults = interim;

  recognition.onresult = (event) => {
    if (typeof onText !== "function") return;
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join(" ")
      .trim();
    const lastResult = event.results[event.results.length - 1];
    const isFinal = lastResult ? Boolean(lastResult.isFinal) : true;
    onText(transcript, { isFinal, event });
  };

  recognition.onerror = (event) => {
    if (typeof onError === "function") {
      onError(event);
    }
  };

  recognition.onend = (event) => {
    if (typeof onEnd === "function") {
      onEnd(event);
    }
  };

  try {
    recognition.start();
  } catch (error) {
    if (typeof onError === "function") {
      onError(error);
    }
    return { stop: () => {}, supported: false };
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch (error) {
        if (typeof onError === "function") {
          onError(error);
        }
      }
    },
    supported: true
  };
}

export function speak(text, lang = "en") {
  if (!hasSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.pitch = 1;
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

const buildCacheKey = (key) => `${DeviceClass}:${key}`;

export async function cachePut(key, value) {
  if (!hasWindow() || !window.localStorage) return;
  try {
    window.localStorage.setItem(buildCacheKey(key), JSON.stringify(value));
  } catch (error) {
    console.warn("tiny_stack cachePut failed", error);
  }
}

export async function cacheGet(key) {
  if (!hasWindow() || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(buildCacheKey(key));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("tiny_stack cacheGet failed", error);
    return null;
  }
}

export async function tinyLLM_draft(prompt, ctx = {}) {
  try {
    const response = await fetch("/api/secure/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, ...ctx })
    });
    if (!response.ok) {
      throw new Error(`Draft endpoint responded with ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("tinyLLM_draft fallback triggered", error);
    return { error: true };
  }
}
