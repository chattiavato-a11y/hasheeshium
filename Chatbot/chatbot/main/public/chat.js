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
const languageToggleButton = document.getElementById("language-toggle");
const capabilityDot = document.getElementById("capability-dot");
const capabilityLabel = document.getElementById("capability-label");
const samplePromptButtons = document.querySelectorAll(".sample-prompts__chip");

const LANGUAGE_CONFIG = {
        en: {
                greeting:
                        "Hello! I'm Chattia, the OPS website assistant. Ask about our service pillars, solutions, metrics, contact options, or how to apply and I'll reply in English with details from the site.",
                switchNotice: "Switched to English. I'll pull answers from the OPS website sections.",
                placeholder: "Ask about OPS services, metrics, or contact options...",
        },
        es: {
                greeting:
                        "¡Hola! Soy Chattia, la asistente del sitio OPS. Pregunta sobre los pilares, soluciones, métricas, opciones de contacto o cómo postularte y responderé en español usando la información oficial.",
                switchNotice:
                        "Cambio a español. Compartiré respuestas basadas en las secciones del sitio OPS.",
                placeholder: "Pregunta sobre servicios OPS, métricas o contacto...",
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

if (languageToggleButton) {
        languageToggleButton.addEventListener("click", () => {
                const nextLanguage = activeLanguage === "en" ? "es" : "en";
                setLanguage(nextLanguage);
        });
}

userInput.placeholder = LANGUAGE_CONFIG[activeLanguage].placeholder;
updateSamplePromptsForLanguage(activeLanguage);
updateLanguageToggleButton(activeLanguage);
samplePromptButtons.forEach((button) => {
        button.addEventListener("click", () => {
                const prompt = activeLanguage === "es" ? button.dataset.promptEs : button.dataset.promptEn;
                const safePrompt = prompt || button.textContent || "";
                if (!safePrompt || isProcessing) return;
                userInput.disabled = false;
                userInput.value = safePrompt;
                userInput.dispatchEvent(new Event("input"));
                userInput.focus();
        });
});

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
        if (language === activeLanguage) {
                return;
        }

        activeLanguage = language;
        userInput.placeholder = LANGUAGE_CONFIG[language].placeholder;
        updateSamplePromptsForLanguage(language);
        updateLanguageToggleButton(language);

        const notice = LANGUAGE_CONFIG[language].switchNotice;
        addMessageToChat("assistant", notice);
        chatHistory.push({ role: "assistant", content: notice });
}

function detectCapabilities() {
        const webgpu = typeof navigator !== "undefined" && "gpu" in navigator;
        const hasML = typeof navigator !== "undefined" && "ml" in navigator;
        const webllm = typeof window !== "undefined" && Boolean(window.WebLLM);
        return {
                webgpu,
                webnn: hasML,
                webml: hasML,
                webllm,
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
                ].filter(Boolean);
                capabilityLabel.textContent = `On-device acceleration detected: ${enabled.join(", ")}`;
        } else {
                capabilityLabel.textContent = "Routing to Cloudflare Workers AI";
        }
}

function updateSamplePromptsForLanguage(language) {
        samplePromptButtons.forEach((button) => {
                const label = language === "es" ? button.dataset.labelEs : button.dataset.labelEn;
                if (label) {
                        button.textContent = label;
                }
                const prompt = language === "es" ? button.dataset.promptEs : button.dataset.promptEn;
                if (prompt) {
                        button.setAttribute("aria-label", prompt);
                }
        });
}

function updateLanguageToggleButton(language) {
        if (!languageToggleButton) return;

        const isEnglish = language === "en";
        const currentLabel = isEnglish ? "English" : "Spanish";
        languageToggleButton.textContent = isEnglish ? "EN" : "ES";
        languageToggleButton.dataset.language = language;
        languageToggleButton.setAttribute(
                "aria-label",
                `Toggle language. Currently ${currentLabel}. Click to switch to ${isEnglish ? "Spanish" : "English"}.`,
        );
}
