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
                id: "ops-discover-en",
                language: "en",
                title: "Discover: Operational Intelligence Intake",
                service: "Business Operations Pods",
                audience: "Strategy Leads",
                content:
                        "Our Discover phase blends rapid telemetry triage with bilingual intake interviews. We baseline customer journeys, compliance controls, and legacy tooling to expose modernization priorities that deliver measurable ROI in 30 days.",
        },
        {
                id: "ops-cc-en",
                language: "en",
                title: "Contact Center Modernization",
                service: "Contact Center & CX Pods",
                audience: "CX Directors",
                content:
                        "The contact center pod unifies IVR, chat, and workforce automation. BM25-indexed playbooks align AI routing, PCI-secure payment flows, and sentiment telemetry to lift CSAT while compressing handle time.",
        },
        {
                id: "ops-it-en",
                language: "en",
                title: "IT Support Automation",
                service: "IT Service Desk Pods",
                audience: "IT Operations",
                content:
                        "IT support pods orchestrate zero-touch provisioning, CMDB drift detection, and Just-In-Time access. Workers AI copilots surface resolution snippets in English and Spanish to uphold NIST CSF and CISA Essentials baselines.",
        },
        {
                id: "ops-discover-es",
                language: "es",
                title: "Descubrir: Ingreso de Inteligencia Operativa",
                service: "Células de Operaciones Empresariales",
                audience: "Líderes de Estrategia",
                content:
                        "La fase Descubrir combina triage de telemetría con entrevistas bilingües. Establecemos la línea base de viajes de cliente, controles de cumplimiento y herramientas heredadas para priorizar modernizaciones con retorno comprobable en 30 días.",
        },
        {
                id: "ops-cc-es",
                language: "es",
                title: "Modernización del Contact Center",
                service: "Células de Contact Center y Experiencia",
                audience: "Directores de CX",
                content:
                        "La célula de contact center unifica IVR, chat y automatización de personal. Los playbooks BM25 alinean enrutamiento con IA, pagos seguros PCI y telemetría de sentimiento para elevar el CSAT y reducir el tiempo de atención.",
        },
        {
                id: "ops-it-es",
                language: "es",
                title: "Automatización de Soporte de TI",
                service: "Células de Mesa de Servicio TI",
                audience: "Operaciones de TI",
                content:
                        "Las células de soporte TI orquestan aprovisionamiento sin intervención, detección de desviaciones CMDB y acceso Just-In-Time. Los copilotos de Workers AI muestran fragmentos de resolución en inglés y español para mantener los marcos NIST CSF y CISA Essentials.",
        },
        {
                id: "ops-secure-en",
                language: "en",
                title: "Secure by Design Guardrails",
                service: "OPS CyberSec Core",
                audience: "Security Officers",
                content:
                        "OPS CyberSec Core fuses NIST CSF, PCI DSS 4.0, and CISA Cyber Essentials. Every pod enforces MFA, encrypted audit logs, and documented incident workflows to compress MTTR while satisfying regulatory evidence requirements.",
        },
        {
                id: "ops-secure-es",
                language: "es",
                title: "Barandillas Secure by Design",
                service: "OPS CyberSec Core",
                audience: "Oficiales de Seguridad",
                content:
                        "OPS CyberSec Core integra NIST CSF, PCI DSS 4.0 y CISA Cyber Essentials. Cada célula aplica MFA, bitácoras cifradas y flujos de incidentes documentados para reducir el MTTR y cumplir con la evidencia regulatoria.",
        },
        {
                id: "ops-services-ops-en",
                language: "en",
                title: "OPS Business Operations Pod Mix",
                service: "Business Operations Pods",
                audience: "COO & Logistics Leaders",
                content:
                        "The Business Operations pod blends executive assistants, administrative specialists, and multimodal logistics aides across air, ocean, land, dispatch, import/export, and logistics account management. Each assistant is OPS-vetted for SLA tracking, KPI visibility, and process governance to scale resilient supply chains.",
        },
        {
                id: "ops-services-ops-es",
                language: "es",
                title: "Mezcla de Célula de Operaciones Empresariales",
                service: "Células de Operaciones Empresariales",
                audience: "Líderes de Operaciones y Logística",
                content:
                        "La célula de Operaciones Empresariales combina asistentes ejecutivos, especialistas administrativos y auxiliares logísticos multimodales en aéreo, marítimo, terrestre, despacho, importación/exportación y gestión de cuentas. Cada asistente está validado por OPS para seguimiento de SLA, visibilidad de KPI y gobernanza de procesos que escalan cadenas resilientes.",
        },
        {
                id: "ops-services-cc-en",
                language: "en",
                title: "OPS Contact Center Experience Grid",
                service: "Contact Center & CX Pods",
                audience: "Customer Experience Directors",
                content:
                        "OPS Contact Center programs deliver 24/7 inbound and outbound orchestration, multilingual chat and email, CRM integrations across Salesforce and HubSpot, and social sentiment telemetry. Quality monitoring loops pair BM25-playbooks with human QA to keep CSAT five-star while reducing handle time.",
        },
        {
                id: "ops-services-cc-es",
                language: "es",
                title: "Rejilla de Experiencia del Centro de Contacto OPS",
                service: "Células de Contact Center y Experiencia",
                audience: "Directores de Experiencia del Cliente",
                content:
                        "Los programas del Centro de Contacto OPS ofrecen orquestación 24/7 de llamadas entrantes y salientes, chat y correo multilingüe, integraciones CRM con Salesforce y HubSpot, y telemetría de sentimiento social. Los bucles de monitoreo de calidad combinan playbooks BM25 con QA humana para mantener un CSAT de cinco estrellas reduciendo el tiempo de atención.",
        },
        {
                id: "ops-services-it-en",
                language: "en",
                title: "OPS IT Support Talent Lattice",
                service: "IT Service Desk Pods",
                audience: "IT Operations",
                content:
                        "OPS IT Support provides tiered help desk, DevOps assistants, and front-end/back-end/full-stack coverage. Pods automate provisioning, CI/CD deployments, and infrastructure scripting with audit-ready observability across PCI and NIST guardrails.",
        },
        {
                id: "ops-services-it-es",
                language: "es",
                title: "Trama de Talento de Soporte TI OPS",
                service: "Células de Mesa de Servicio TI",
                audience: "Operaciones de TI",
                content:
                        "El soporte TI de OPS entrega mesa de ayuda por niveles, asistentes DevOps y cobertura front-end/back-end/full-stack. Las células automatizan el aprovisionamiento, despliegues CI/CD y scripting de infraestructura con observabilidad lista para auditorías bajo los resguardos PCI y NIST.",
        },
        {
                id: "ops-services-pro-en",
                language: "en",
                title: "OPS Professionals Network",
                service: "OPS Talent Guild",
                audience: "People Operations",
                content:
                        "OPS Professionals connect businesses with remote sysadmins, DevOps strategists, finance controllers, HR specialists, and logistics program managers. Each professional is NDA-backed, compliance trained, and ready for project or retained engagements.",
        },
        {
                id: "ops-services-pro-es",
                language: "es",
                title: "Red de Profesionales OPS",
                service: "Gremio de Talento OPS",
                audience: "Operaciones de Personas",
                content:
                        "Los Profesionales OPS conectan a las empresas con administradores de sistemas remotos, estrategas DevOps, controladores financieros, especialistas de RR. HH. y gerentes de programas logísticos. Cada profesional cuenta con NDA, formación en cumplimiento y disponibilidad para compromisos por proyecto o retención.",
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
