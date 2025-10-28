import { lockBodyScroll, unlockBodyScroll, trapFocus, bindModalLifecycle, makeDraggable } from "../shared/lib/hci.js";
import { initState, getState, toggleLang, toggleTheme, onStateChange } from "../shared/lib/state.js";
import { renderIcon } from "../shared/lib/icons/index.js";
import { enforceSafety, policyMessage } from "./safety.js";
import { sanitizeUtterance, describeSanitization } from "./security.js";
import { hasChattiaEndpoint, invokeChattiaWorker } from "./cloudflare.js";
import { orchestrateRuntimeLayers } from "../shared/lib/runtime_orchestration.js";

let modalInstance = null;
let engineModulePromise = null;
let stackModulePromise = null;
let tinyStackModule = null;

function loadEngine() {
  if (!engineModulePromise) {
    engineModulePromise = import("./engine.js");
  }
  return engineModulePromise;
}

function loadTinyStackModule() {
  if (!stackModulePromise) {
    stackModulePromise = import("../shared/lib/tiny_stack.js");
  }
  return stackModulePromise;
}

function createToggleButton(label, pressed) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "toggle-btn";
  button.textContent = label;
  if (pressed) button.setAttribute("aria-pressed", "true");
  button.style.minWidth = "88px";
  return button;
}

async function ensureJoinModal() {
  const module = await import("../comm-us/join.js");
  module.openJoinModal();
}

async function ensureContactModal() {
  const module = await import("../comm-us/contact.js");
  module.openContactModal();
}

function appendMessage(list, { role, content, citations = [], highlights = [] }) {
  const item = document.createElement("div");
  item.className = `chat-msg chat-${role}`;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  const paragraphs = content.split(/\n+/);
  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    bubble.appendChild(p);
  });

  if (citations.length > 0) {
    const refs = document.createElement("ul");
    refs.className = "chat-citations";
    citations.forEach((cite) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "link-btn";
      button.textContent = cite.title;
      button.addEventListener("click", () => {
        if (cite.url.startsWith("/")) {
          window.location.href = cite.url;
        } else {
          window.location.hash = cite.url;
        }
      });
      li.appendChild(button);
      refs.appendChild(li);
    });
    bubble.appendChild(refs);
  }

  if (highlights.length > 0) {
    const highlightList = document.createElement("ul");
    highlightList.className = "chat-highlights";
    highlights.forEach((highlight) => {
      const li = document.createElement("li");
      li.textContent = highlight;
      highlightList.appendChild(li);
    });
    bubble.appendChild(highlightList);
  }

  item.appendChild(bubble);
  list.appendChild(item);
  list.scrollTop = list.scrollHeight;
}

function createToolbelt(strings) {
  const wrapper = document.createElement("div");
  wrapper.className = "chat-tools";
  const joinBtn = document.createElement("button");
  joinBtn.type = "button";
  joinBtn.textContent = strings.join;
  joinBtn.className = "toggle-btn";
  joinBtn.addEventListener("click", () => ensureJoinModal());
  const contactBtn = document.createElement("button");
  contactBtn.type = "button";
  contactBtn.textContent = strings.contact;
  contactBtn.className = "toggle-btn";
  contactBtn.addEventListener("click", () => ensureContactModal());
  wrapper.appendChild(joinBtn);
  wrapper.appendChild(contactBtn);
  return { wrapper, joinBtn, contactBtn };
}

export async function openChattia() {
  initState();
  if (modalInstance) {
    return modalInstance;
  }
  const state = getState();
  let currentLang = state.lang;
  let strings = getStrings(currentLang);
  let notifiedMissingWorker = false;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const shell = document.createElement("div");
  shell.className = "modal-shell chat-shell";
  shell.style.width = "min(92vw, 560px)";
  shell.style.maxHeight = "80vh";
  shell.setAttribute("role", "dialog");
  shell.setAttribute("aria-modal", "true");
  shell.setAttribute("aria-label", strings.title);

  const header = document.createElement("header");
  header.className = "modal-header chat-header";

  const titleWrap = document.createElement("div");
  const title = document.createElement("h2");
  title.textContent = strings.title;
  titleWrap.appendChild(title);
  const subtitle = document.createElement("p");
  subtitle.className = "hint";
  subtitle.textContent = strings.subtitle;
  titleWrap.appendChild(subtitle);

  const controls = document.createElement("div");
  controls.className = "toggle-group";

  const langToggle = createToggleButton(strings.langToggle, state.lang === "es");
  langToggle.addEventListener("click", () => toggleLang());

  const themeToggle = createToggleButton(strings.themeToggle, state.theme === "dark");
  themeToggle.addEventListener("click", () => toggleTheme());

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "toggle-btn";
  closeBtn.innerHTML = renderIcon("close");
  closeBtn.setAttribute("aria-label", strings.close);

  controls.appendChild(langToggle);
  controls.appendChild(themeToggle);
  controls.appendChild(closeBtn);

  header.appendChild(titleWrap);
  header.appendChild(controls);

  const chatArea = document.createElement("div");
  chatArea.className = "chat-area";

  const messageList = document.createElement("div");
  messageList.className = "chat-scroll";
  chatArea.appendChild(messageList);

  const toolbelt = createToolbelt(strings);
  chatArea.appendChild(toolbelt.wrapper);

  const form = document.createElement("form");
  form.className = "chat-input";
  form.noValidate = true;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = strings.placeholder;
  input.required = true;

  const sendBtn = document.createElement("button");
  sendBtn.type = "submit";
  sendBtn.innerHTML = renderIcon("send");
  sendBtn.setAttribute("aria-label", strings.send);

  const honeypot = document.createElement("input");
  honeypot.type = "text";
  honeypot.name = "website";
  honeypot.className = "hidden-input";
  honeypot.setAttribute("aria-hidden", "true");
  sendBtn.insertAdjacentElement("afterend", honeypot);

  const micBtn = document.createElement("button");
  micBtn.type = "button";
  micBtn.className = "toggle-btn";
  micBtn.innerHTML = renderIcon("mic");
  micBtn.setAttribute("aria-label", strings.mic);

  form.appendChild(micBtn);
  form.appendChild(input);
  form.appendChild(sendBtn);

  const footer = document.createElement("div");
  footer.className = "modal-footer chat-footer";
  footer.appendChild(form);

  shell.appendChild(header);
  shell.appendChild(chatArea);
  shell.appendChild(footer);
  backdrop.appendChild(shell);

  lockBodyScroll();
  document.body.appendChild(backdrop);
  const releaseFocus = trapFocus(shell);
  const releaseLifecycle = bindModalLifecycle(backdrop, () => close());
  const releaseDrag = makeDraggable(shell, header);

  closeBtn.addEventListener("click", () => close());

  let speech;
  loadTinyStackModule().then(async (module) => {
    tinyStackModule = module;
    const { startSTT, speak, hasNativeSTT, cacheGet } = module;
    const hasBrowserSTT =
      typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    const supportsSTT = typeof hasNativeSTT === "function" ? hasNativeSTT() : hasBrowserSTT;
    if (typeof startSTT !== "function") {
      micBtn.style.display = "none";
      return;
    }
    let session = null;
    let active = false;

    const resetSession = () => {
      active = false;
      session = null;
      micBtn.classList.remove("active");
    };

    speech = {
      supported: supportsSTT,
      isActive: () => active,
      start: () => {
        if (!supportsSTT || active) return;
        micBtn.classList.add("active");
        active = true;
        session = startSTT(
          (transcript, meta = {}) => {
            if (!transcript) return;
            input.value = transcript;
            if (meta.isFinal) {
              speech.stop();
              handleSubmit();
            }
          },
          {
            lang: currentLang === "es" ? "es-ES" : "en-US",
            onError: () => resetSession(),
            onEnd: () => resetSession()
          }
        );
        if (!session || session.supported === false) {
          resetSession();
          speech.supported = false;
          micBtn.style.display = "none";
        }
      },
      stop: () => {
        if (!session) return;
        try {
          session.stop && session.stop();
        } catch (error) {
          console.warn("Chattia STT stop error", error);
        }
        resetSession();
      },
      speak: (text, language) => {
        if (typeof speak === "function") {
          speak(text, language);
        }
      }
    };

    if (!supportsSTT) {
      micBtn.style.display = "none";
    }

    if (typeof cacheGet === "function") {
      try {
        const cached = await cacheGet("chattia:last");
        if (cached && cached.answer && !messageList.querySelector(".chat-history")) {
          const history = document.createElement("div");
          history.className = "chat-msg chat-assistant chat-history";
          const bubble = document.createElement("div");
          bubble.className = "chat-bubble";
          const title = document.createElement("p");
          title.className = "hint";
          title.textContent = strings.previous ||
            (currentLang === "es" ? "Última respuesta guardada" : "Last saved response");
          const body = document.createElement("p");
          body.textContent = cached.answer;
          bubble.appendChild(title);
          bubble.appendChild(body);
          history.appendChild(bubble);
          messageList.appendChild(history);
          messageList.scrollTop = messageList.scrollHeight;
        }
      } catch (error) {
        console.warn("Unable to hydrate cached Chattia history", error);
      }
    }
  });

  micBtn.addEventListener("click", () => {
    if (!speech || !speech.supported) return;
    if (speech.isActive()) {
      speech.stop();
    } else {
      speech.start();
    }
  });

  function close() {
    releaseFocus();
    releaseLifecycle();
    releaseDrag();
    backdrop.remove();
    unlockBodyScroll();
    modalInstance = null;
  }

  async function handleSubmit() {
    const rawValue = input.value;
    const query = rawValue.trim();
    if (!query) return;
    if (honeypot.value.trim().length > 0) {
      appendMessage(messageList, { role: "assistant", content: strings.honeypot });
      input.value = "";
      return;
    }

    const sanitized = sanitizeUtterance(query);
    const notices = describeSanitization(sanitized.warnings, currentLang);

    input.value = "";

    if (sanitized.blocked) {
      appendMessage(messageList, { role: "assistant", content: strings.sanitizedBlocked });
      if (notices && notices.length > 0) {
        appendMessage(messageList, {
          role: "assistant",
          content: `${strings.sanitizedNotice}\n${notices.map((notice) => `• ${notice}`).join("\n")}`
        });
      }
      return;
    }

    const safeQuery = sanitized.cleanText;
    appendMessage(messageList, { role: "user", content: safeQuery });

    sendBtn.disabled = true;
    micBtn.disabled = true;

    if (notices && notices.length > 0) {
      appendMessage(messageList, {
        role: "assistant",
        content: `${strings.sanitizedNotice}\n${notices.map((notice) => `• ${notice}`).join("\n")}`
      });
    }

    const safety = enforceSafety(safeQuery, currentLang);
    if (!safety.allowed) {
      appendMessage(messageList, { role: "assistant", content: safety.response });
      sendBtn.disabled = false;
      micBtn.disabled = false;
      return;
    }

    const workerConfigured = hasChattiaEndpoint();
    if (!workerConfigured && !notifiedMissingWorker) {
      appendMessage(messageList, { role: "assistant", content: strings.remoteUnavailable });
      notifiedMissingWorker = true;
    }

    try {
      let runtimeMeta = null;
      let result;

      const orchestration = await orchestrateRuntimeLayers(safeQuery, { lang: currentLang });

      if (orchestration?.ok && orchestration.result) {
        runtimeMeta = orchestration;
        result = orchestration.result;
      } else {
        if (orchestration?.reason === "policy") {
          appendMessage(messageList, { role: "assistant", content: strings.policyBlocked });
          sendBtn.disabled = false;
          micBtn.disabled = false;
          return;
        }

        if (orchestration?.reason === "confidence") {
          appendMessage(messageList, { role: "assistant", content: strings.lowConfidence });
        } else if (orchestration && orchestration.reason !== "empty" && orchestration.reason !== "unsupported") {
          appendMessage(messageList, { role: "assistant", content: strings.retrievalError });
        }

        const { ask } = await loadEngine();
        result = await ask(safeQuery, currentLang);

        if ((!result || result.hits.length === 0) && tinyStackModule?.tinyLLM_draft) {
          const llm = await tinyStackModule.tinyLLM_draft(safeQuery, { language: currentLang });
          if (llm && !llm.error && llm.answer) {
            result = {
              answer: llm.answer,
              citations: llm.citations || [],
              hits: llm.hits || []
            };
          }
        }
      }

      if (!result || !result.answer) {
        appendMessage(messageList, { role: "assistant", content: strings.error });
      } else {
        appendMessage(messageList, {
          role: "assistant",
          content: result.answer,
          citations: result.citations,
          highlights: (result.hits || []).flatMap((hit) => hit.highlights || [])
        });
        if (speech && speech.speak) {
          speech.speak(result.answer, currentLang === "es" ? "es-ES" : "en-US");
        }
        if (tinyStackModule?.cachePut) {
          await tinyStackModule.cachePut("chattia:last", {
            query: safeQuery,
            answer: result.answer,
            timestamp: Date.now()
          });
        }
      }

      if (workerConfigured) {
        const retrieval = {
          answer: result?.answer,
          citations: result?.citations,
          highlights: (result?.hits || []).map((hit) => ({
            id: hit.doc.id,
            title: hit.doc.title,
            url: hit.doc.url,
            score: hit.score,
            highlights: hit.highlights
          })),
          metrics: runtimeMeta?.metrics || null
        };
        const workerResponse = await invokeChattiaWorker({
          prompt: safeQuery,
          lang: currentLang,
          sanitizedWarnings: sanitized.warnings,
          retrieval,
          policyMessage: policyMessage(currentLang)
        });
        if (workerResponse.ok && workerResponse.data) {
          const workerData = workerResponse.data;
          const workerMessage =
            workerData.message || workerData.answer || workerData.output || workerData.response;
          const workerCitations = Array.isArray(workerData.citations) ? workerData.citations : [];
          if (workerMessage) {
            appendMessage(messageList, {
              role: "assistant",
              content: `${strings.remotePrefix}\n${workerMessage}`,
              citations: workerCitations
            });
            if (speech && speech.speak) {
              speech.speak(workerMessage, currentLang === "es" ? "es-ES" : "en-US");
            }
          }
        } else if (workerResponse.reason && workerResponse.reason !== "missing-endpoint") {
          appendMessage(messageList, { role: "assistant", content: strings.remoteError });
          console.warn("Chattia Cloudflare worker error", workerResponse.reason, workerResponse.error);
        }
      }
    } catch (error) {
      appendMessage(messageList, { role: "assistant", content: strings.error });
      console.error("Chattia engine error", error);
    } finally {
      sendBtn.disabled = false;
      micBtn.disabled = false;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSubmit();
  });

  appendMessage(messageList, { role: "assistant", content: strings.welcome });

  modalInstance = { close, element: shell };

  onStateChange((next) => {
    currentLang = next.lang;
    strings = getStrings(next.lang);
    langToggle.setAttribute("aria-pressed", next.lang === "es" ? "true" : "false");
    langToggle.textContent = strings.langToggle;
    themeToggle.setAttribute("aria-pressed", next.theme === "dark" ? "true" : "false");
    themeToggle.textContent = strings.themeToggle;
    title.textContent = strings.title;
    subtitle.textContent = strings.subtitle;
    closeBtn.setAttribute("aria-label", strings.close);
    input.placeholder = strings.placeholder;
    sendBtn.setAttribute("aria-label", strings.send);
    micBtn.setAttribute("aria-label", strings.mic);
    toolbelt.joinBtn.textContent = strings.join;
    toolbelt.contactBtn.textContent = strings.contact;
    if (speech && speech.supported) {
      speech.stop();
    }
  });

  return modalInstance;
}

function getStrings(lang) {
  if (lang === "es") {
    return {
      title: "Chattia Copiloto",
      subtitle: "Asistente bilingüe en el dispositivo",
      langToggle: "ES",
      themeToggle: "Oscuro",
      close: "Cerrar",
      placeholder: "Describe tu reto u objetivo...",
      send: "Enviar",
      mic: "Dictado",
      welcome: "Hola, soy Chattia. Puedo enlazar servicios OPS, activar formularios y compartir prácticas de ciberseguridad.",
      error: "Algo salió mal al consultar el runbook local.",
      honeypot: "Detuvimos el envío automático. Vuelve a intentarlo manualmente.",
      join: "Unirse",
      contact: "Contactar",
      previous: "Última respuesta guardada",
      sanitizedBlocked: "La solicitud se bloqueó después de sanitizar el contenido.",
      sanitizedNotice: "Resumen de sanitización:",
      remoteUnavailable: "El orquestador remoto no está configurado aún. Continuaré con el runbook local.",
      remoteError: "El Worker remoto no pudo procesar esta solicitud.",
      remotePrefix: "Worker remoto:",
      retrievalError: "No se pudo recuperar suficiente contenido remoto; usaré el runbook local.",
      policyBlocked: "Los filtros de política bloquearon esa solicitud. Prueba otra redacción o contacta a OPS.",
      lowConfidence: "No encontré suficientes coincidencias de alta confianza todavía. Usaré el runbook local." 
    };
  }
  return {
    title: "Chattia Copilot",
    subtitle: "On-device bilingual assistant",
    langToggle: "EN",
    themeToggle: "Dark",
    close: "Close",
    placeholder: "Share your challenge or intent...",
    send: "Send",
    mic: "Dictate",
    welcome: "Hi, I'm Chattia. I can point you to OPS services, surface forms, and share cybersecurity practices.",
    error: "Something went wrong reaching the local runbook.",
    honeypot: "Automation detected. Please try again manually.",
    join: "Join",
    contact: "Contact",
    previous: "Last saved response",
    sanitizedBlocked: "The request was blocked after sanitization.",
    sanitizedNotice: "Sanitization summary:",
    remoteUnavailable: "The remote orchestrator isn't configured yet. Falling back to the local runbook.",
    remoteError: "The remote Worker couldn't process that request.",
    remotePrefix: "Remote Worker:",
    retrievalError: "Unable to reach enough remote context. I'll rely on the local runbook.",
    policyBlocked: "Policy filters blocked that request. Try another phrasing or contact OPS.",
    lowConfidence: "I didn't find enough high-confidence OPS runbook matches yet. I'll lean on the local runbook."
  };
}
