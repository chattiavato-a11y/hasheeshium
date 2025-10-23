const corporaCache = new Map();

function normalizeLang(lang) {
  return lang === "es" ? "es" : "en";
}

function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñüàèìòùç\s]/gi, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

async function loadCorpus(language) {
  const lang = normalizeLang(language);
  if (corporaCache.has(lang)) {
    return corporaCache.get(lang);
  }
  const basePath = `/chatbot/corpora/${lang}`;
  const indexResponse = await fetch(`${basePath}/index.json`, {
    credentials: "same-origin",
    cache: "no-store"
  });
  if (!indexResponse.ok) {
    throw new Error(`Unable to load corpora index for ${lang}`);
  }
  const files = await indexResponse.json();
  const docs = await Promise.all(
    files.map(async (file) => {
      const res = await fetch(`${basePath}/${file}`, {
        credentials: "same-origin",
        cache: "no-store"
      });
      if (!res.ok) {
        throw new Error(`Unable to load corpus file ${file}`);
      }
      const data = await res.json();
      const tokens = tokenize(`${data.text} ${(data.terms || []).join(" ")}`);
      const frequency = new Map();
      tokens.forEach((token) => {
        frequency.set(token, (frequency.get(token) || 0) + 1);
      });
      return {
        ...data,
        tokens,
        frequency,
        length: tokens.length
      };
    })
  );
  const inverted = new Map();
  docs.forEach((doc, index) => {
    doc.frequency.forEach((count, term) => {
      if (!inverted.has(term)) inverted.set(term, []);
      inverted.get(term).push({ index, count });
    });
  });
  const avgDocLength = docs.reduce((sum, doc) => sum + doc.length, 0) / Math.max(docs.length, 1);
  const corpus = { docs, inverted, avgDocLength };
  corporaCache.set(lang, corpus);
  return corpus;
}

function scoreDocs(queryTokens, corpus) {
  const { docs, inverted, avgDocLength } = corpus;
  const scores = new Array(docs.length).fill(0);
  const uniqueTokens = Array.from(new Set(queryTokens));
  const totalDocs = docs.length;
  uniqueTokens.forEach((token) => {
    const postings = inverted.get(token);
    if (!postings) return;
    const df = postings.length;
    const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
    postings.forEach(({ index, count }) => {
      const doc = docs[index];
      const numerator = count * (1.5 + 1);
      const denominator = count + 1.5 * (1 - 0.75 + 0.75 * (doc.length / avgDocLength || 1));
      scores[index] += idf * (numerator / denominator);
    });
  });
  return scores;
}

function extractHighlights(doc, queryTokens) {
  const sentences = doc.text.split(/(?<=[.!?])\s+/);
  const tokens = new Set(queryTokens);
  const matches = [];
  sentences.forEach((sentence) => {
    const sentenceTokens = tokenize(sentence);
    if (sentenceTokens.some((token) => tokens.has(token))) {
      matches.push(sentence.trim());
    }
  });
  return matches.slice(0, 3);
}

function composeAnswer(question, hits, lang) {
  if (hits.length === 0) {
    return lang === "es"
      ? "Aún no tengo datos para esa pregunta. Prueba reformularla o explora los servicios desde el menú."
      : "I do not have local data for that yet. Try reframing the question or explore the services from the menu.";
  }
  const intros = {
    en: "Here's what I found across OPS runbooks:",
    es: "Esto es lo que encontré en los runbooks OPS:"
  };
  const summaryParts = hits.map((hit) => {
    const { doc, highlights } = hit;
    const snippet = highlights[0] || doc.text.slice(0, 180);
    return `• ${snippet}`;
  });
  return `${intros[lang] || intros.en}\n${summaryParts.join("\n")}`;
}

export async function ask(question, language = "en") {
  const lang = normalizeLang(language);
  const corpus = await loadCorpus(lang);
  const queryTokens = tokenize(question);
  const scores = scoreDocs(queryTokens, corpus);
  const scored = scores
    .map((score, index) => ({ score, index }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const hits = scored.map(({ score, index }) => {
    const doc = corpus.docs[index];
    return {
      score,
      doc,
      highlights: extractHighlights(doc, queryTokens)
    };
  });
  const answer = composeAnswer(question, hits, lang);
  const citations = hits.map(({ doc }) => ({ id: doc.id, title: doc.title, url: doc.url })).slice(0, 3);
  return {
    answer,
    hits,
    citations
  };
}

export async function preload(language = "en") {
  await loadCorpus(language);
}
