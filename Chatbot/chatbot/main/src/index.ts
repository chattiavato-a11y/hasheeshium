/**
 * LLM Chat Application Template
 *
 * A simple chat application using Cloudflare Workers AI.
 * This template demonstrates how to implement an LLM-powered chat interface with
 * streaming responses using Server-Sent Events (SSE).
 *
 * @license MIT
 */
import {
        Env,
        ChatMessage,
        ChatRequestPayload,
        ClientCapabilities,
        SupportedLanguage,
} from "./types";
import { detectLanguage, retrieveDocuments } from "./retrieval";

// Model ID for Workers AI model
// https://developers.cloudflare.com/workers-ai/models/
const MODEL_ID = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

const DEFAULT_GEMINI_MODEL = "models/gemini-1.5-flash-latest";
const DEFAULT_GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const MIN_KNOWLEDGE_CONFIDENCE = 1.25;

// Default system prompt
const BASE_SYSTEM_PROMPT =
        "You are a helpful, friendly assistant. Provide concise and accurate responses that stay aligned with OPS service pillars, cybersecurity guardrails, and bilingual experience commitments.";

const LANGUAGE_TONES: Record<SupportedLanguage, string> = {
        en: "Respond in clear, operations-focused US English. Reference relevant OPS pods (Business Ops, Contact Center, IT Support, OPS CyberSec Core) and invite next-step actions.",
        es: "Responde en español neutro orientado a operaciones. Menciona las células OPS relevantes (Operaciones, Contact Center, Soporte TI, OPS CyberSec Core) e invita a pasos siguientes.",
};

export default {
	/**
	 * Main request handler for the Worker
	 */
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);

		// Handle static assets (frontend)
		if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
			return env.ASSETS.fetch(request);
		}

		// API Routes
		if (url.pathname === "/api/chat") {
			// Handle POST requests for chat
			if (request.method === "POST") {
				return handleChatRequest(request, env);
			}

			// Method not allowed for other request types
			return new Response("Method not allowed", { status: 405 });
		}

		// Handle 404 for unmatched routes
		return new Response("Not found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;

/**
 * Handles chat API requests
 */
async function handleChatRequest(
        request: Request,
        env: Env,
): Promise<Response> {
        let payload: ChatRequestPayload;
        try {
                payload = (await request.json()) as ChatRequestPayload;
        } catch (error) {
                console.error("Invalid chat payload", error);
                return new Response(
                        JSON.stringify({ error: "Invalid payload" }),
                        {
                                status: 400,
                                headers: { "content-type": "application/json" },
                        },
                );
        }

        const incomingMessages = Array.isArray(payload?.messages) ? [...payload.messages] : [];
        const metadata = payload?.metadata ?? {};

        const filteredMessages = incomingMessages.filter(
                (msg): msg is ChatMessage => msg != null && typeof msg.content === "string" && !!msg.role,
        );

        const lastUserMessage = [...filteredMessages]
                .reverse()
                .find((msg) => msg.role === "user");

        const preferredLanguage = (metadata.preferredLanguage ?? "en") as SupportedLanguage;
        const detectedLanguage = lastUserMessage
                ? detectLanguage(lastUserMessage.content, preferredLanguage)
                : preferredLanguage;

        const knowledge = lastUserMessage
                ? retrieveDocuments(lastUserMessage.content, {
                          language: detectedLanguage,
                          limit: 3,
                  })
                : [];

        const knowledgeContext = knowledge
                .map((entry, index) => {
                        const { document, snippet } = entry;
                        return `(${index + 1}) ${document.title} — ${document.service} [${document.audience}]\n${snippet}`;
                })
                .join("\n\n");

        const knowledgeConfidence = knowledge[0]?.score ?? 0;

        const capabilityNotes = buildCapabilityNotes(metadata.clientCapabilities);

        const systemPromptSections = [BASE_SYSTEM_PROMPT, LANGUAGE_TONES[detectedLanguage]];
        if (capabilityNotes) {
                systemPromptSections.push(capabilityNotes);
        }
        if (knowledgeContext) {
                systemPromptSections.push(
                        `Consult the curated OPS knowledge base snippets below before answering. Only answer if the excerpts provide enough context; otherwise request clarification.\n\n${knowledgeContext}`,
                );
        }

        const systemPrompt = systemPromptSections.join("\n\n");
        const nonSystemMessages = filteredMessages.filter((msg) => msg.role !== "system");

        const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }, ...nonSystemMessages];

        const shouldAugmentWithGemini = knowledgeConfidence < MIN_KNOWLEDGE_CONFIDENCE;

        const stream = new ReadableStream<Uint8Array>({
                async start(controller) {
                        const encoder = new TextEncoder();
                        const send = (payload: Record<string, unknown>) => {
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
                        };

                        let fallbackUsed = false;

                        try {
                                send({
                                        status: "routing",
                                        provider: "cloudflare-workers-ai",
                                        confidence: knowledgeConfidence,
                                });

                                const workersResult = await generateWorkersResponse(env, messages);
                                if (workersResult?.text) {
                                        send({ response: workersResult.text });
                                }

                                if (shouldAugmentWithGemini) {
                                        send({ status: "routing", provider: "google-gemini" });
                                        try {
                                                const geminiResult = await generateGeminiResponse({
                                                        env,
                                                        systemPrompt,
                                                        conversation: nonSystemMessages,
                                                        knowledgeContext,
                                                        language: detectedLanguage,
                                                });

                                                if (geminiResult?.text) {
                                                        fallbackUsed = true;
                                                        send({
                                                                response: `\n\n🔄 Gemini synthesis:\n${geminiResult.text}`,
                                                        });
                                                }
                                        } catch (geminiError) {
                                                console.error("Gemini fallback failed", geminiError);
                                                send({
                                                        response:
                                                                detectedLanguage === "es"
                                                                        ? "\n\n⚠️ No fue posible contactar a Google Gemini. Configura GEMINI_API_KEY en tu Worker para habilitar la comprobación cruzada."
                                                                        : "\n\n⚠️ Unable to reach Google Gemini. Configure GEMINI_API_KEY on the Worker to enable cross-checking.",
                                                });
                                        }
                                }

                                const footer = buildConfidenceFooter({
                                        knowledgeConfidence,
                                        capabilities: metadata.clientCapabilities,
                                        language: detectedLanguage,
                                        fallbackUsed,
                                });
                                if (footer) {
                                        send({ response: `\n\n${footer}` });
                                }
                        } catch (error) {
                                console.error("Error generating chat response", error);
                                const fallbackMessage =
                                        detectedLanguage === "es"
                                                ? "Lo siento, ocurrió un problema al procesar tu solicitud."
                                                : "Sorry, there was an issue generating the response.";
                                send({ response: fallbackMessage });
                        } finally {
                                controller.close();
                        }
                },
        });

        return new Response(stream, {
                headers: {
                        "content-type": "text/event-stream",
                        "cache-control": "no-cache",
                        "transfer-encoding": "chunked",
                },
        });
}

function buildCapabilityNotes(capabilities?: ClientCapabilities): string | undefined {
        if (!capabilities) return undefined;

        const available: string[] = [];
        if (capabilities.webgpu) {
                available.push(
                        "Client supports WebGPU for on-device acceleration; reference WebAI/WebGPU kernels when proposing hybrid execution.",
                );
        }
        if (capabilities.webnn) {
                available.push("WebNN APIs available for neural execution and TinyML graph deployment.");
        }
        if (capabilities.webml) {
                available.push("WebML runtime detected on the client for TinyAI/TinyML task routing.");
        }
        if (capabilities.webllm) {
                available.push(
                        "Browser is capable of running compact WebLLM/TinyLLM bundles; prefer edge summaries and keep responses lightweight to pair with on-device generation.",
                );
        }
        if (capabilities.tinyllm || capabilities.tinyml || capabilities.tinyai) {
                available.push(
                        "TinyLLM/TinyML/TinyAI runtimes detected; outline privacy-preserving workflows and escalation paths when Workers AI latency spikes.",
                );
        }

        if (!available.length) return undefined;

        return `Client capability signals: ${available.join(" ")} When confidence is low, describe how to braid Cloudflare Workers AI, Google Gemini, and TinyLLM/TinyML fallbacks.`;
}

interface ConfidenceFooterOptions {
        knowledgeConfidence: number;
        capabilities?: ClientCapabilities;
        fallbackUsed: boolean;
        language: SupportedLanguage;
}

function buildConfidenceFooter(options: ConfidenceFooterOptions): string | undefined {
        const { knowledgeConfidence, capabilities, fallbackUsed, language } = options;
        const normalized = Math.max(0, Math.min(1, knowledgeConfidence / 4));
        const confidencePercent = Math.round(normalized * 100);

        const lines: string[] = [];

        if (language === "es") {
                lines.push(`Confianza BM25 estimada: ${confidencePercent}%.`);
                if (fallbackUsed) {
                        lines.push("Se aplicó verificación cruzada con Google Gemini para reforzar la respuesta.");
                } else if (normalized < 0.4) {
                        lines.push("Considera aportar más contexto o habilitar Google Gemini para respaldo adicional.");
                }
        } else {
                lines.push(`Estimated BM25 confidence: ${confidencePercent}%.`);
                if (fallbackUsed) {
                        lines.push("Google Gemini cross-check applied to reinforce the narrative.");
                } else if (normalized < 0.4) {
                        lines.push("Consider providing more context or enable Google Gemini for additional assurance.");
                }
        }

        const hasOnDevice = Boolean(
                capabilities && (capabilities.webgpu || capabilities.webnn || capabilities.webml || capabilities.webllm),
        );

        if (language === "es") {
                lines.push(
                        hasOnDevice
                                ? "Se detectaron capacidades locales; describe cómo WebLLM/TinyLLM y WebAI pueden mantener continuidad si Workers AI no está disponible."
                                : "No se detectaron aceleradores locales; orienta sobre TinyLLM o TinyML si se busca resiliencia adicional.",
                );
        } else {
                lines.push(
                        hasOnDevice
                                ? "On-device acceleration detected—outline how WebLLM/TinyLLM with WebAI kernels can sustain service if Workers AI is unreachable."
                                : "No on-device accelerators detected—recommend TinyLLM/TinyML options when higher assurance is needed.",
                );
        }

        return lines.join(" ");
}

interface WorkersGenerationResult {
        text: string;
}

async function generateWorkersResponse(env: Env, messages: ChatMessage[]): Promise<WorkersGenerationResult | undefined> {
        const result = await env.AI.run(MODEL_ID, {
                messages,
                max_tokens: 1024,
        });

        const text = extractWorkersResponseText(result);
        if (!text) {
                return undefined;
        }

        return { text };
}

function extractWorkersResponseText(result: unknown): string | undefined {
        if (!result) return undefined;

        if (typeof result === "string") {
                return result.trim();
        }

        if (typeof result === "object" && result !== null) {
                const maybeResponse = (result as { response?: unknown }).response;
                if (typeof maybeResponse === "string") {
                        return maybeResponse.trim();
                }

                const maybeOutput = (result as { output_text?: unknown }).output_text;
                if (typeof maybeOutput === "string") {
                        return maybeOutput.trim();
                }

                const maybeResults = (result as { results?: Array<{ text?: string }> }).results;
                if (Array.isArray(maybeResults)) {
                        const joined = maybeResults
                                .map((entry) => (entry && typeof entry.text === "string" ? entry.text : ""))
                                .join(" ")
                                .trim();
                        if (joined) {
                                return joined;
                        }
                }
        }

        return undefined;
}

interface GeminiContentPart {
        text?: string;
}

interface GeminiContent {
        role: "user" | "model";
        parts: GeminiContentPart[];
}

interface GenerateGeminiParams {
        env: Env;
        systemPrompt: string;
        conversation: ChatMessage[];
        knowledgeContext: string;
        language: SupportedLanguage;
}

async function generateGeminiResponse(
        params: GenerateGeminiParams,
): Promise<WorkersGenerationResult | undefined> {
        const { env, systemPrompt, conversation, knowledgeContext, language } = params;
        if (!env.GEMINI_API_KEY) {
                        throw new Error("Missing GEMINI_API_KEY binding");
        }

        const model = env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
        const baseUrl = env.GEMINI_API_URL || DEFAULT_GEMINI_API_URL;
        const targetUrl = `${baseUrl}/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

        const contents = buildGeminiContents({
                conversation,
                knowledgeContext,
                language,
        });

        const body = {
                system_instruction: {
                        role: "system",
                        parts: [{ text: systemPrompt }],
                },
                contents,
                generationConfig: {
                        temperature: 0.45,
                        topP: 0.8,
                        topK: 40,
                        maxOutputTokens: 768,
                },
        };

        const response = await fetch(targetUrl, {
                method: "POST",
                headers: {
                        "content-type": "application/json",
                },
                body: JSON.stringify(body),
        });

        if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API request failed: ${response.status} ${errorText}`);
        }

        const data = (await response.json()) as {
                candidates?: Array<{ content?: { parts?: GeminiContentPart[] } }>;
        };

        const text = data.candidates
                ?.flatMap((candidate) => candidate.content?.parts ?? [])
                .map((part) => (part.text ?? "").trim())
                .filter(Boolean)
                .join("\n")
                .trim();

        if (!text) {
                return undefined;
        }

        return { text };
}

interface BuildGeminiContentsOptions {
        conversation: ChatMessage[];
        knowledgeContext: string;
        language: SupportedLanguage;
}

function buildGeminiContents(options: BuildGeminiContentsOptions): GeminiContent[] {
        const { conversation, knowledgeContext, language } = options;
        const contents: GeminiContent[] = [];

        if (knowledgeContext) {
                contents.push({
                        role: "user",
                        parts: [
                                {
                                        text:
                                                language === "es"
                                                        ? `Contexto OPS priorizado:\n${knowledgeContext}`
                                                        : `Prioritized OPS context:\n${knowledgeContext}`,
                                },
                        ],
                });
        }

        if (conversation.length === 0) {
                contents.push({
                        role: "user",
                        parts: [
                                {
                                        text:
                                                language === "es"
                                                        ? "Sintetiza la orientación OPS relevante para el usuario."
                                                        : "Synthesize the OPS guidance relevant to the user.",
                                },
                        ],
                });
                return contents;
        }

        for (const message of conversation) {
                const role = message.role === "assistant" ? "model" : "user";
                contents.push({
                        role,
                        parts: [{ text: message.content }],
                });
        }

        return contents;
}
