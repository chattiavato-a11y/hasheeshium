const STORAGE_KEY = "ops-hci-state";
const DEFAULT_STATE = { theme: "light", lang: "en" };

let currentState = { ...DEFAULT_STATE };
const subscribers = new Set();
let initialized = false;

function applyState(state) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("lang", state.lang);
  if (state.theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("State persistence blocked", err);
  }
}

function hydrate() {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        theme: parsed.theme === "dark" ? "dark" : "light",
        lang: parsed.lang === "es" ? "es" : "en"
      };
    }
  } catch (err) {
    console.warn("Unable to read persisted state", err);
  }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    theme: prefersDark ? "dark" : "light",
    lang: DEFAULT_STATE.lang
  };
}

export function initState() {
  if (initialized) return currentState;
  currentState = hydrate();
  applyState(currentState);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const next = JSON.parse(event.newValue);
          currentState = {
            theme: next.theme === "dark" ? "dark" : "light",
            lang: next.lang === "es" ? "es" : "en"
          };
          applyState(currentState);
          subscribers.forEach((fn) => fn(currentState));
        } catch (err) {
          console.error("Failed to sync state", err);
        }
      }
    });
  }
  initialized = true;
  return currentState;
}

export function getState() {
  return currentState;
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function update(partial) {
  currentState = { ...currentState, ...partial };
  applyState(currentState);
  subscribers.forEach((fn) => fn(currentState));
}

export function toggleTheme() {
  initState();
  const nextTheme = currentState.theme === "dark" ? "light" : "dark";
  update({ theme: nextTheme });
  return nextTheme;
}

export function setTheme(theme) {
  initState();
  update({ theme: theme === "dark" ? "dark" : "light" });
}

export function toggleLang() {
  initState();
  const nextLang = currentState.lang === "en" ? "es" : "en";
  update({ lang: nextLang });
  return nextLang;
}

export function setLang(lang) {
  initState();
  update({ lang: lang === "es" ? "es" : "en" });
}

export function onStateChange(fn) {
  initState();
  fn(currentState);
  return subscribe(fn);
}
