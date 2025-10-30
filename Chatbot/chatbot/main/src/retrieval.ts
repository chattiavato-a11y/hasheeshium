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
                id: "ops-overview-en",
                language: "en",
                title: "OPS Overview",
                service: "OPS Website Hero",
                audience: "Prospective Clients",
                content:
                        "OPS Online Support delivers remote professionals across Business Operations, Contact Center, IT Support, and Professionals On Demand. The hero promise emphasizes momentum, follow-the-sun coverage, and assembling the right team within 72 hours when you book a discovery call.",
        },
        {
                id: "ops-pillars-en",
                language: "en",
                title: "Service Pillars",
                service: "Service Pillars",
                audience: "Operations Leaders",
                content:
                        "Four service pillars anchor the program: Business Operations keeps billing accuracy, procurement visibility, and executive dashboards; Contact Center agents combine omni-channel routing with sentiment cues; IT Support pods maintain documented incident response and telemetry; Professionals focus on predictive analytics and feedback frameworks for growth.",
        },
        {
                id: "ops-solutions-en",
                language: "en",
                title: "Solutions Catalog",
                service: "Solutions",
                audience: "Prospective Clients",
                content:
                        "Solutions align to each pillar. Business Operations manages payables, receivables, vendor coordination, and marketing support. Contact Center covers multi-channel, relationship-first conversations. IT Support spans Tier I-II help desk, ticketing, and incident handling. Professionals On Demand provide short and long-term specialists you can plug into projects quickly.",
        },
        {
                id: "ops-metrics-en",
                language: "en",
                title: "Impact Metrics",
                service: "Metrics",
                audience: "Decision Makers",
                content:
                        "Key impact metrics include 24/7/365 follow-the-sun pods with mirrored playbooks, 40% faster resolution time thanks to AI copilots, 99.95% availability commitments, and a 12x security posture improvement aligned to the OPS CyberSec Core framework.",
        },
        {
                id: "ops-journey-en",
                language: "en",
                title: "Client Journey",
                service: "Engagement Workflow",
                audience: "Prospective Clients",
                content:
                        "Every engagement follows a transparent journey: Discover and instrument priorities, Launch with confidence using shared telemetry, and Continuously optimize. Calls to action invite booking a discovery call or contacting OPS for tailored remote professionals.",
        },
        {
                id: "ops-contact-en",
                language: "en",
                title: "Contact Options",
                service: "Contact Form",
                audience: "Operations Leads",
                content:
                        "The contact form captures name, work email, company, role, preferred start timeline, and objectives. Visitors can book a discovery call, talk to OPS about ongoing operations, or request remote professionals. OPS commits to keeping information confidential and replying within one business day.",
        },
        {
                id: "ops-apply-en",
                language: "en",
                title: "Apply as Professional",
                service: "Talent Applications",
                audience: "Remote Professionals",
                content:
                        "Professionals can apply by sharing name, email, location, profile link, experience, specialty, and mastered tools. Dynamic sections let applicants showcase skills, education, certifications, hobbies, and continued learning. OPS reviews applications within 5–7 business days and highlights remote-first opportunities.",
        },
        {
                id: "ops-assurances-en",
                language: "en",
                title: "Assurances & Highlights",
                service: "Trust Strip",
                audience: "Prospective Clients",
                content:
                        "OPS reassures clients with clear scopes, reliable coverage, plain communication, and flexible engagement. The hero section reiterates that daily tasks stay on track, CSAT reaches 98%, and business operations benefit from follow-the-sun expertise and remote specialists ready to onboard quickly.",
        },
        {
                id: "ops-overview-es",
                language: "es",
                title: "Resumen OPS",
                service: "Portal OPS",
                audience: "Clientes Potenciales",
                content:
                        "OPS Online Support ofrece profesionales remotos para Operaciones de Negocio, Contact Center, Soporte TI y Profesionales On Demand. La promesa central es mantener el impulso de tu empresa con cobertura 24/7 y conformar el equipo correcto en 72 horas después de agendar una llamada de descubrimiento.",
        },
        {
                id: "ops-pillars-es",
                language: "es",
                title: "Pilares de Servicio",
                service: "Pilares",
                audience: "Líderes de Operaciones",
                content:
                        "Cuatro pilares sostienen la oferta: Operaciones de Negocio garantiza facturación precisa, visibilidad de proveedores y tableros ejecutivos; Contact Center combina enrutamiento multicanal con señales de sentimiento; Soporte TI mantiene rutas documentadas de incidentes y telemetría; Profesionales impulsan analítica predictiva y marcos de retroalimentación.",
        },
        {
                id: "ops-solutions-es",
                language: "es",
                title: "Catálogo de Soluciones",
                service: "Soluciones",
                audience: "Clientes Potenciales",
                content:
                        "Cada solución corresponde a un pilar. Operaciones de Negocio gestiona cuentas por pagar y cobrar, coordinación con proveedores y soporte administrativo y de marketing. Contact Center ofrece conversaciones multicanal centradas en la relación. Soporte TI cubre mesa de ayuda niveles I-II, ticketing e incidentes. Profesionales On Demand aportan especialistas temporales o de largo plazo para proyectos.",
        },
        {
                id: "ops-metrics-es",
                language: "es",
                title: "Métricas Clave",
                service: "Impacto",
                audience: "Tomadores de Decisiones",
                content:
                        "Las métricas destacadas incluyen pods 24/7/365 con playbooks espejados, 40% más rapidez en resoluciones gracias a copilotos de IA, 99.95% de disponibilidad y una mejora de 12x en postura de seguridad alineada con OPS CyberSec Core.",
        },
        {
                id: "ops-journey-es",
                language: "es",
                title: "Recorrido del Cliente",
                service: "Flujo de Compromiso",
                audience: "Clientes Potenciales",
                content:
                        "El recorrido incluye Descubrir e instrumentar prioridades, Lanzar con confianza usando telemetría compartida y Optimizar continuamente. Las llamadas a la acción invitan a agendar una llamada de descubrimiento o contactar a OPS para profesionales remotos.",
        },
        {
                id: "ops-contact-es",
                language: "es",
                title: "Opciones de Contacto",
                service: "Formulario de Contacto",
                audience: "Líderes de Operaciones",
                content:
                        "El formulario solicita nombre, correo laboral, empresa, rol, ventana de inicio preferida y objetivos. Puedes reservar una llamada de descubrimiento, hablar con OPS sobre operaciones en curso o solicitar profesionales remotos. OPS promete confidencialidad y respuesta en un día hábil.",
        },
        {
                id: "ops-apply-es",
                language: "es",
                title: "Postularse como Profesional",
                service: "Talento",
                audience: "Profesionales Remotos",
                content:
                        "Las personas candidatas comparten datos básicos, experiencia, especialidad y herramientas dominadas. Se incluyen secciones dinámicas para detallar habilidades, educación, certificaciones, hobbies y aprendizaje continuo. OPS revisa cada aplicación en 5 a 7 días hábiles y ofrece oportunidades remotas.",
        },
        {
                id: "ops-assurances-es",
                language: "es",
                title: "Garantías y Destacados",
                service: "Confianza",
                audience: "Clientes Potenciales",
                content:
                        "OPS ofrece scopes claros, cobertura confiable, comunicación simple y modelos flexibles. Se recalca que las tareas diarias se cumplen, el CSAT llega a 98% y las operaciones aprovechan experiencia global con especialistas listos para integrarse rápidamente.",
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
