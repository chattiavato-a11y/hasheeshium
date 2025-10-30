import type { SupportedLanguage } from "./types";

export interface KnowledgeDocument {
        id: string;
        language: SupportedLanguage;
        title: string;
        service: string;
        audience: string;
        content: string;
}

export interface RetrievalOptions {
        language?: SupportedLanguage;
        limit?: number;
}

export interface RetrievalResult {
        document: KnowledgeDocument;
        score: number;
        snippet: string;
}

const DOCUMENTS: KnowledgeDocument[] = [
        {
                id: "ops-overview-hero",
                language: "en",
                title: "OPS Online Support Overview",
                service: "Homepage",
                audience: "Prospective Clients",
                content:
                        "OPS Online Support provides experienced remote professionals across Business Operations, Contact Center, IT Support, and Professionals On Demand. The homepage promises 24/7 coverage with follow-the-sun expertise so daily tasks are completed, objectives are met, projects hit their deadlines, and goals are accomplished.",
        },
        {
                id: "ops-service-pillars",
                language: "en",
                title: "Service Pillars",
                service: "Homepage",
                audience: "Operations Leaders",
                content:
                        "The Service Pillars section states that OPS delivers business continuity, customer loyalty, and operational clarity through dedicated pods. Business Operations keeps financial hygiene, stakeholder updates, and executive dashboards on track with billing accuracy and procurement visibility. Contact Center pods focus on omni-channel routing with sentiment cues and refreshed knowledge to nurture loyalty. IT Support teams align security, IT, and continuity with documented triage, resolution pathways, and integrated telemetry. Professionals pod provides insight teams for predictive analytics, sprint-ready insights, and feedback frameworks that prioritize user delight.",
        },
        {
                id: "ops-solutions",
                language: "en",
                title: "Solutions",
                service: "Homepage",
                audience: "Decision Makers",
                content:
                        "Solutions tailored to operations let organizations choose remote professionals that plug into managed workflows. Business Operations coverage handles accurate billing, clean payables and receivables, vendor coordination, and admin support plus marketing. Contact Center specialists provide relationship-driven, rapid-resolution support across channels. IT Support covers help desk tiers I and II, ticketing, incident handling, and complex fixes. Professionals On Demand supply skilled assistants and specialists for temporary or long-term projects and consultants.",
        },
        {
                id: "ops-metrics",
                language: "en",
                title: "Metrics",
                service: "Homepage",
                audience: "Stakeholders",
                content:
                        "The metrics section summarizes OPS impact: 24/7/365 follow-the-sun support pods with leads in LATAM and APAC; 40% faster resolution time by combining AI copilots with human focus; 99.95% availability guarantees backed by high-availability infrastructure; and 12x security posture improvement aligned to OPS CyberSec Core for audit readiness.",
        },
        {
                id: "ops-journey",
                language: "en",
                title: "Engagement Journey",
                service: "Homepage",
                audience: "Prospective Clients",
                content:
                        "OPS describes a journey that moves from Discover and instrument, to Launch with confidence, and then Continuously optimize. A call-to-action invites visitors to book a discovery call, promising that once OPS understands the ecosystem it will assemble a talented team within 72 hours.",
        },
        {
                id: "ops-contact-overview",
                language: "en",
                title: "Contact OPS",
                service: "Contact Page",
                audience: "Leads",
                content:
                        "The contact page headline says Book a Discovery Call or Hire Remote Professionals. Visitors are asked to share goals, preferred engagement, and timeline, and operations leads respond within one business day. Options include booking a discovery call, talking to OPS about ongoing operations, integrations, and compliance coverage, or hiring remote professionals matched to operations, CX, IT support, or professionals on demand.",
        },
        {
                id: "ops-contact-form",
                language: "en",
                title: "Contact Form Details",
                service: "Contact Page",
                audience: "Site Visitors",
                content:
                        "The contact form collects full name, work email, company, role, and an ideal start window with choices ranging from immediate to exploring options. It requires selecting an intent and providing context and objectives, with OPS noting that information is kept confidential and replies arrive within one business day.",
        },
        {
                id: "ops-apply-overview",
                language: "en",
                title: "Apply as a Remote Professional",
                service: "Apply Page",
                audience: "Applicants",
                content:
                        "The apply page invites professionals to tell OPS about their craft, industries, and preferred ways of working. OPS reviews every application within 5 to 7 business days. Applicants supply name, email, location, an optional LinkedIn or portfolio link, years of experience, a specialty such as business operations, contact center, IT support, professionals on demand, or analytics and insights, plus the tools and platforms they master.",
        },
        {
                id: "ops-apply-showcase",
                language: "en",
                title: "Showcase Your OPS Story",
                service: "Apply Page",
                audience: "Applicants",
                content:
                        "Applicants can build modular cards under sections like Skills, Education, Certification, Hobbies, and Continued Education. Instructions encourage listing toolkits, degrees, credentials, and interests, using plus and minus controls to curate entries and accepting a section to lock it before submitting the application.",
        },
];

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
        const limit = options.limit ?? 3;
        const results = scored.slice(0, limit);

        if (!results.length && language !== "en") {
                return retrieveDocuments(query, { ...options, language: "en", limit });
        }

        return results;
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
