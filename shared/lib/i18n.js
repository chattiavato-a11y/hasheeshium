const servicesCache = new Map();

function normalizeLang(lang) {
  return lang === "es" ? "es" : "en";
}

async function fetchJson(path) {
  const response = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

export async function loadServices(lang = "en") {
  const key = normalizeLang(lang);
  if (servicesCache.has(key)) {
    return servicesCache.get(key);
  }
  const data = await fetchJson(`/shared/data/services.${key}.json`);
  servicesCache.set(key, data);
  return data;
}

export async function getHeroCopy(lang = "en") {
  const data = await loadServices(lang);
  return data.hero;
}

export async function getServiceList(lang = "en") {
  const data = await loadServices(lang);
  return data.services;
}
