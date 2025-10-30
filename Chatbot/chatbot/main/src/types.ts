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

        /**
         * Secret for calling Google Gemini.
         */
        GEMINI_API_KEY?: string;

        /**
         * Optional override for the Gemini model identifier.
         */
        GEMINI_MODEL?: string;

        /**
         * Optional override for the Gemini endpoint base URL.
         */
        GEMINI_API_URL?: string;
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
        tinyllm?: boolean;
        tinyml?: boolean;
        tinyai?: boolean;
}

export interface ChatRequestPayload {
        messages: ChatMessage[];
        metadata?: {
                preferredLanguage?: SupportedLanguage;
                clientCapabilities?: ClientCapabilities;
        };
}
