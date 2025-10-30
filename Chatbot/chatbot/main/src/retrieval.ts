import type { KnowledgeDocument, SupportedLanguage } from "./types";
import { KNOWLEDGE_DOCUMENTS } from "./documents";

export interface RetrievalOptions {
        language?: SupportedLanguage;
        limit?: number;
}

export interface RetrievalResult {
        document: KnowledgeDocument;
        score: number;
        snippet: string;
}

const DOCUMENTS: KnowledgeDocument[] = KNOWLEDGE_DOCUMENTS;

type TermFrequency = Map<string, number>;

type DocumentVector = {
        length: number;
        termFrequency: TermFrequency;
};

type Index = {
        vectors: Record<string, DocumentVector>;
        inverseDocumentFrequency: Map<string, number>;
        averageDocumentLength: number;
};

const STOPWORDS: Record<SupportedLanguage, Set<string>> = {
        en: new Set([
                "a",
                "an",
                "and",
                "are",
                "as",
                "at",
                "be",
                "but",
                "by",
                "for",
                "if",
                "in",
                "into",
                "is",
                "it",
                "no",
                "not",
                "of",
                "on",
                "or",
                "such",
                "that",
                "the",
                "their",
                "then",
                "there",
                "these",
                "they",
                "this",
                "to",
                "was",
                "will",
                "with",
        ]),
        es: new Set([
                "a",
                "al",
                "con",
                "de",
                "del",
                "el",
                "en",
                "es",
                "la",
                "las",
                "los",
                "lo",
                "para",
                "por",
                "que",
                "se",
                "sin",
                "su",
                "sus",
                "un",
                "una",
                "y",
        ]),
};

const TOKEN_REGEX = /[\p{L}\p{N}]+/gu;

const INDEX: Index = buildIndex();

export function detectLanguage(
        text: string,
        fallback: SupportedLanguage = "en",
): SupportedLanguage {
        const lowered = text.toLowerCase();
        const spanishSignals = [
                " el ",
                " la ",
                " los ",
                " las ",
                " qué",
                " quién",
                " cómo",
                " dónde",
                " por qué",
                "¿",
                "¡",
                "ción",
        ];
        let score = 0;
        for (const signal of spanishSignals) {
                if (lowered.includes(signal)) {
                        score += 1;
                }
        }
        const accented = /[áéíóúñü¿¡]/u;
        if (accented.test(lowered)) {
                score += 2;
        }
        return score >= 2 ? "es" : fallback;
}

export function retrieveDocuments(
        query: string,
        options: RetrievalOptions = {},
): RetrievalResult[] {
        const language = options.language ?? "en";
        const tokens = tokenize(query, language);
        const uniqueTokens = Array.from(new Set(tokens));

        const scored: RetrievalResult[] = [];

        for (const doc of DOCUMENTS) {
                if (doc.language !== language) {
                        continue;
                }

                const vector = INDEX.vectors[doc.id];
                if (!vector) continue;

                let score = 0;
                for (const token of uniqueTokens) {
                        score += bm25(token, vector, INDEX);
                }

                if (score > 0) {
                        scored.push({
                                document: doc,
                                score,
                                snippet: buildSnippet(doc, tokens),
                        });
                }
        }

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, options.limit ?? 3);
}

function buildIndex(): Index {
        const vectors: Record<string, DocumentVector> = {};
        const documentFrequency: Map<string, number> = new Map();
        let totalLength = 0;

        for (const doc of DOCUMENTS) {
                const tokens = tokenize(doc.content, doc.language);
                const termFrequency: TermFrequency = new Map();

                for (const token of tokens) {
                        termFrequency.set(token, (termFrequency.get(token) ?? 0) + 1);
                }

                totalLength += tokens.length;
                vectors[doc.id] = {
                        length: tokens.length,
                        termFrequency,
                };

                for (const token of new Set(tokens)) {
                        documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
                }
        }

        const totalDocs = DOCUMENTS.length;
        const inverseDocumentFrequency: Map<string, number> = new Map();
        for (const [token, df] of documentFrequency.entries()) {
                        // Apply BM25 IDF with smoothing to avoid division by zero
                const value = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
                inverseDocumentFrequency.set(token, value);
        }

        return {
                vectors,
                inverseDocumentFrequency,
                averageDocumentLength: totalLength / totalDocs,
        };
}

function bm25(token: string, vector: DocumentVector, index: Index): number {
        const tf = vector.termFrequency.get(token);
        if (!tf) return 0;

        const idf = index.inverseDocumentFrequency.get(token) ?? 0;
        const k1 = 1.5;
        const b = 0.75;
        const numerator = tf * (k1 + 1);
        const denominator =
                tf +
                k1 *
                        (1 - b + (b * vector.length) / (index.averageDocumentLength || 1));
        return idf * (numerator / denominator);
}

function tokenize(text: string, language: SupportedLanguage): string[] {
        const matches = text.toLowerCase().match(TOKEN_REGEX);
        if (!matches) return [];
        const stopwords = STOPWORDS[language];
        return matches.filter((token) => !stopwords.has(token));
}

function buildSnippet(doc: KnowledgeDocument, queryTokens: string[]): string {
        const loweredContent = doc.content.toLowerCase();
        for (const token of queryTokens) {
                const needle = token.toLowerCase();
                const index = loweredContent.indexOf(needle);
                if (index >= 0) {
                        const start = Math.max(0, index - 60);
                        const end = Math.min(doc.content.length, index + 120);
                        return doc.content.slice(start, end).trim();
                }
        }
        return doc.content.slice(0, 180).trim();
}
