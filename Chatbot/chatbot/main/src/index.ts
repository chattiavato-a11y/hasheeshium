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

// Default system prompt
const BASE_SYSTEM_PROMPT = `You are Chattia, the OPS Online Support website assistant. Answer only with information that appears in the supplied OPS website excerpts. If the snippets do not contain the requested details, say that the site does not cover that yet and invite the user to ask about OPS services, contact options, or application steps. Never invent policies, metrics, timelines, or advice that are not present in the provided OPS website text.`;

const LANGUAGE_TONES: Record<SupportedLanguage, string> = {
        en: "Respond in clear, operations-focused US English. Reference OPS website sections (Service Pillars, Solutions, Journey, Contact, Apply) and suggest the most relevant next step.",
        es: "Responde en español neutro orientado a operaciones. Menciona las secciones del sitio OPS (Pilares, Soluciones, Recorrido, Contacto, Postúlate) e invita a la siguiente acción adecuada.",
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
	try {
		// Parse JSON request body
                const payload = (await request.json()) as ChatRequestPayload;
                const incomingMessages = Array.isArray(payload?.messages)
                        ? [...payload.messages]
                        : [];

                const metadata = payload?.metadata ?? {};

                const filteredMessages = incomingMessages.filter(
                        (msg): msg is ChatMessage =>
                                msg != null && typeof msg.content === "string" && !!msg.role,
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

                const capabilityNotes = buildCapabilityNotes(metadata.clientCapabilities);

                const systemPromptSections = [BASE_SYSTEM_PROMPT, LANGUAGE_TONES[detectedLanguage]];
                if (capabilityNotes) {
                        systemPromptSections.push(capabilityNotes);
                }
                if (knowledgeContext) {
                        systemPromptSections.push(
                                `OPS website excerpts:\n\n${knowledgeContext}\n\nUse only these excerpts while responding. If information is missing, explain that the site has not published it yet.`,
                        );
                } else {
                        systemPromptSections.push(
                                "No OPS website excerpts matched the latest question. Respond by letting the user know that the site does not cover that topic yet and encourage questions about the published OPS services, contact options, or application process.",
                        );
                }

                const systemPrompt = systemPromptSections.join("\n\n");

                const messages: ChatMessage[] = [
                        { role: "system", content: systemPrompt },
                        ...filteredMessages.filter((msg) => msg.role !== "system"),
                ];

		const response = await env.AI.run(
			MODEL_ID,
			{
				messages,
				max_tokens: 1024,
			},
			{
				returnRawResponse: true,
				// Uncomment to use AI Gateway
				// gateway: {
				//   id: "YOUR_GATEWAY_ID", // Replace with your AI Gateway ID
				//   skipCache: false,      // Set to true to bypass cache
				//   cacheTtl: 3600,        // Cache time-to-live in seconds
				// },
			},
		);

		// Return streaming response
		return response;
	} catch (error) {
		console.error("Error processing chat request:", error);
		return new Response(
			JSON.stringify({ error: "Failed to process request" }),
			{
				status: 500,
				headers: { "content-type": "application/json" },
			},
		);
	}
}

function buildCapabilityNotes(capabilities?: ClientCapabilities): string | undefined {
        if (!capabilities) return undefined;

        const available: string[] = [];
        if (capabilities.webgpu) {
                available.push("Client supports WebGPU for on-device acceleration.");
        }
        if (capabilities.webnn) {
                available.push("WebNN APIs available for neural execution.");
        }
        if (capabilities.webml) {
                available.push("WebML runtime detected on the client.");
        }
        if (capabilities.webllm) {
                available.push(
                        "Browser is capable of running compact WebLLM bundles; prefer edge summaries and keep responses lightweight to pair with on-device generation.",
                );
        }

        if (!available.length) return undefined;

        return `Client capability signals: ${available.join(" ")}`;
}
