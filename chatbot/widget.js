import { lockBodyScroll, unlockBodyScroll, trapFocus, bindModalLifecycle, makeDraggable } from "../shared/lib/hci.js";
import { initState, getState, toggleLang, toggleTheme, onStateChange } from "../shared/lib/state.js";
import { renderIcon } from "../shared/lib/icons/index.js";
import { enforceSafety } from "./safety.js";

let modalInstance = null;
let engineModulePromise = null;
let sttModulePromise = null;
let speechModule = null;

function loadEngine() {
  if (!engineModulePromise) {
    engineModulePromise = import("./engine.js");
  }
  return engineModulePromise;
}

function loadSpeechModule() {
  if (!sttModulePromise) {
    sttModulePromise = import("./stt.js");
  }
  return sttModulePromise;
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
  loadSpeechModule().then((module) => {
    speechModule = module;
    const { createSpeechController, speak } = module;
    speech = {
      controller: createSpeechController({
        lang: currentLang === "es" ? "es-ES" : "en-US",
        onResult: (transcript) => {
          input.value = transcript;
          handleSubmit();
        },
        onError: () => micBtn.classList.remove("active"),
        onEnd: () => micBtn.classList.remove("active")
      }),
      speak
    };
    if (!speech.controller.supported) {
      micBtn.style.display = "none";
    }
  });

  micBtn.addEventListener("click", () => {
    if (!speech || !speech.controller || !speech.controller.supported) return;
    if (speech.controller.isActive()) {
      speech.controller.stop();
      micBtn.classList.remove("active");
    } else {
      speech.controller.start();
      micBtn.classList.add("active");
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
    const query = input.value.trim();
    if (!query) return;
    if (honeypot.value.trim().length > 0) {
      appendMessage(messageList, { role: "assistant", content: strings.honeypot });
      input.value = "";
      return;
    }
    input.value = "";
    appendMessage(messageList, { role: "user", content: query });
    sendBtn.disabled = true;
    micBtn.disabled = true;

    const safety = enforceSafety(query, currentLang);
    if (!safety.allowed) {
      appendMessage(messageList, { role: "assistant", content: safety.response });
      sendBtn.disabled = false;
      micBtn.disabled = false;
      return;
    }

    try {
      const { ask } = await loadEngine();
      const result = await ask(query, currentLang);
      appendMessage(messageList, {
        role: "assistant",
        content: result.answer,
        citations: result.citations,
        highlights: result.hits.flatMap((hit) => hit.highlights)
      });
      if (speech && speech.speak) {
        speech.speak(result.answer, currentLang === "es" ? "es-ES" : "en-US");
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
    if (speech && speech.controller && speech.controller.supported) {
      speech.controller.stop();
      if (speechModule) {
        speech.controller = speechModule.createSpeechController({
          lang: currentLang === "es" ? "es-ES" : "en-US",
          onResult: (transcript) => {
            input.value = transcript;
            handleSubmit();
          },
          onError: () => micBtn.classList.remove("active"),
          onEnd: () => micBtn.classList.remove("active")
        });
        if (!speech.controller.supported) {
          micBtn.style.display = "none";
        } else {
          micBtn.style.display = "";
        }
      }
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
      contact: "Contactar"
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
    contact: "Contact"
  };
}
