/**
 * Type definitions for the LLM chat application.
 */

export type SupportedLanguage = "en" | "es";

export interface Env {
        /**
         * Binding for the Workers AI API.
         */
        AI: Ai;

	/**
	 * Binding for static assets.
	 */
	ASSETS: { fetch: (request: Request) => Promise<Response> };
}

/**
 * Represents a chat message.
 */
export interface ChatMessage {
        role: "system" | "user" | "assistant";
        content: string;
}

export interface ClientCapabilities {
        webgpu?: boolean;
        webnn?: boolean;
        webml?: boolean;
        webllm?: boolean;
}

export interface ChatRequestPayload {
        messages: ChatMessage[];
        metadata?: {
                preferredLanguage?: SupportedLanguage;
                clientCapabilities?: ClientCapabilities;
        };
}

export interface KnowledgeDocument {
        id: string;
        language: SupportedLanguage;
        title: string;
        service: string;
        audience: string;
        content: string;
}
