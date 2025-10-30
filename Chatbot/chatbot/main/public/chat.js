/**
 * LLM Chat App Frontend
 *
 * Handles the chat UI interactions and communication with the backend API.
 */

// DOM elements
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const typingIndicator = document.getElementById("typing-indicator");
const langEnButton = document.getElementById("lang-en");
const langEsButton = document.getElementById("lang-es");
const capabilityDot = document.getElementById("capability-dot");
const capabilityLabel = document.getElementById("capability-label");

const LANGUAGE_CONFIG = {
        en: {
                greeting:
                        "Hello! I'm your OPS Edge Intelligence copilot. Ask about Business Ops pods, CX modernization, or OPS CyberSec Core safeguards and I'll respond in English.",
                switchNotice: "Switched to English. I'll keep responses aligned to OPS service pillars.",
                placeholder: "Type your message here...",
        },
        es: {
                greeting:
                        "¡Hola! Soy tu copiloto OPS Edge Intelligence. Pregunta sobre células de Operaciones, Contact Center o guardas OPS CyberSec Core y responderé en español.",
                switchNotice:
                        "Cambio a español. Mantendré las respuestas alineadas a los pilares de servicio OPS.",
                placeholder: "Escribe tu mensaje aquí...",
        },
};

const clientCapabilities = detectCapabilities();
updateCapabilityBadge(clientCapabilities);

let activeLanguage = "en";

// Chat state
let chatHistory = [
        {
                role: "assistant",
                content: LANGUAGE_CONFIG.en.greeting,
        },
];
let isProcessing = false;

// Seed the UI with the initial greeting
addMessageToChat("assistant", LANGUAGE_CONFIG.en.greeting);

// Auto-resize textarea as user types
userInput.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
});

// Send message on Enter (without Shift)
userInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
        }
});

// Send button click handler
sendButton.addEventListener("click", sendMessage);

langEnButton.addEventListener("click", () => setLanguage("en"));
langEsButton.addEventListener("click", () => setLanguage("es"));

userInput.placeholder = LANGUAGE_CONFIG[activeLanguage].placeholder;

/**
 * Sends a message to the chat API and processes the response
 */
async function sendMessage() {
        const message = userInput.value.trim();

        // Don't send empty messages or parallel requests
        if (message === "" || isProcessing) return;

        // Disable input while processing
        isProcessing = true;
        userInput.disabled = true;
        sendButton.disabled = true;

        // Add user message to chat
        addMessageToChat("user", message);

        // Clear input
        userInput.value = "";
        userInput.style.height = "auto";

        // Show typing indicator
        typingIndicator.classList.add("visible");

        // Add message to history
        chatHistory.push({ role: "user", content: message });

        try {
                // Create new assistant response element
                const assistantMessageEl = document.createElement("div");
                assistantMessageEl.className = "message assistant-message";
                assistantMessageEl.innerHTML = "<p></p>";
                chatMessages.appendChild(assistantMessageEl);

                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Send request to API
                const response = await fetch("/api/chat", {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                                messages: chatHistory,
                                metadata: {
                                        preferredLanguage: activeLanguage,
                                        clientCapabilities,
                                },
                        }),
                });

                // Handle errors
                if (!response.ok) {
                        throw new Error("Failed to get response");
                }

                // Process streaming response
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let responseText = "";

                while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                                break;
                        }

                        // Decode chunk
                        const chunk = decoder.decode(value, { stream: true });

                        // Process SSE format
                        const lines = chunk.split("\n");
                        for (const rawLine of lines) {
                                try {
                                        const trimmed = rawLine.trim();
                                        if (trimmed === "") continue;

                                        const payload = trimmed.startsWith("data:")
                                                ? trimmed.slice(5).trim()
                                                : trimmed;

                                        if (payload === "" || payload === "[DONE]") {
                                                continue;
                                        }

                                        const jsonData = JSON.parse(payload);
                                        if (jsonData.response) {
                                                // Append new content to existing text
                                                responseText += jsonData.response;
                                                assistantMessageEl.querySelector("p").textContent = responseText;

                                                // Scroll to bottom
                                                chatMessages.scrollTop = chatMessages.scrollHeight;
                                        }
                                } catch (e) {
                                        console.error("Error parsing JSON:", e);
                                }
                        }
                }

                // Add completed response to chat history
                chatHistory.push({ role: "assistant", content: responseText });
        } catch (error) {
                console.error("Error:", error);
                const fallbackMessage =
                        activeLanguage === "es"
                                ? "Lo siento, ocurrió un problema al procesar tu solicitud."
                                : "Sorry, there was an error processing your request.";
                addMessageToChat("assistant", fallbackMessage);
        } finally {
                // Hide typing indicator
                typingIndicator.classList.remove("visible");

                // Re-enable input
                isProcessing = false;
                userInput.disabled = false;
                sendButton.disabled = false;
                userInput.focus();
        }
}

/**
 * Helper function to add message to chat
 */
function addMessageToChat(role, content) {
        const messageEl = document.createElement("div");
        messageEl.className = `message ${role}-message`;
        messageEl.innerHTML = `<p>${content}</p>`;
        chatMessages.appendChild(messageEl);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setLanguage(language) {
        if (language === activeLanguage) return;

        activeLanguage = language;
        langEnButton.classList.toggle("active", language === "en");
        langEsButton.classList.toggle("active", language === "es");
        langEnButton.setAttribute("aria-checked", language === "en" ? "true" : "false");
        langEsButton.setAttribute("aria-checked", language === "es" ? "true" : "false");

        userInput.placeholder = LANGUAGE_CONFIG[language].placeholder;

        const notice = LANGUAGE_CONFIG[language].switchNotice;
        addMessageToChat("assistant", notice);
        chatHistory.push({ role: "assistant", content: notice });
}

function detectCapabilities() {
        const webgpu = typeof navigator !== "undefined" && "gpu" in navigator;
        const hasML = typeof navigator !== "undefined" && "ml" in navigator;
        const webllm = typeof window !== "undefined" && Boolean(window.WebLLM);
        const tinyllm = typeof window !== "undefined" && Boolean(window.TinyLLM || window.tinyllm);
        const navigatorTiny =
                typeof navigator !== "undefined" && navigator && "tinyml" in navigator
                        ? navigator.tinyml
                        : undefined;
        const tinyml = typeof window !== "undefined" && Boolean(window.TinyML || window.tinyml || navigatorTiny);
        const tinyai = typeof window !== "undefined" && Boolean(window.TinyAI || window.tinyAI);
        return {
                webgpu,
                webnn: hasML,
                webml: hasML,
                webllm,
                tinyllm,
                tinyml,
                tinyai,
        };
}

function updateCapabilityBadge(capabilities) {
        const ready = Object.values(capabilities).some(Boolean);
        capabilityDot.classList.toggle("ready", ready);
        if (ready) {
                const enabled = [
                        capabilities.webgpu ? "WebGPU" : null,
                        capabilities.webnn ? "WebNN" : null,
                        capabilities.webml && !capabilities.webnn ? "WebML" : null,
                        capabilities.webllm ? "WebLLM" : null,
                        capabilities.tinyllm ? "TinyLLM" : null,
                        capabilities.tinyml ? "TinyML" : null,
                        capabilities.tinyai ? "TinyAI" : null,
                ].filter(Boolean);
                capabilityLabel.textContent = `On-device acceleration detected: ${enabled.join(", ")}. Gemini fallback engages when retrieval confidence dips.`;
        } else {
                capabilityLabel.textContent = "Routing to Cloudflare Workers AI with Gemini/TinyLLM fallback guidance";
        }
}
