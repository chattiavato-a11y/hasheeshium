import { toggleLang, toggleTheme, onStateChange, getState } from "../../shared/lib/state.js";
import { lazyLoadModule } from "../../shared/lib/lazy.js";
import { renderIcon } from "../../shared/lib/icons/index.js";

function createHoneypot() {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "website";
  input.className = "hidden-input";
  input.setAttribute("aria-hidden", "true");
  return input;
}

export function createNav(copy) {
  const nav = document.createElement("nav");
  nav.className = "navbar";
  const inner = document.createElement("div");
  inner.className = "nav-inner";

  const brand = document.createElement("a");
  brand.href = "#top";
  brand.textContent = copy.brand;
  brand.style.fontWeight = "700";
  brand.style.fontSize = "1.1rem";

  const actions = document.createElement("div");
  actions.className = "nav-actions";

  const langBtn = document.createElement("button");
  langBtn.type = "button";
  langBtn.className = "toggle-btn";
  langBtn.textContent = copy.langToggle;
  langBtn.addEventListener("click", () => toggleLang());

  const themeBtn = document.createElement("button");
  themeBtn.type = "button";
  themeBtn.className = "toggle-btn";
  themeBtn.textContent = copy.themeToggle;
  themeBtn.addEventListener("click", () => toggleTheme());

  const joinBtn = document.createElement("button");
  joinBtn.type = "button";
  joinBtn.innerHTML = `${renderIcon("join")}<span>${copy.join}</span>`;
  joinBtn.className = "toggle-btn";
  joinBtn.addEventListener("click", async () => {
    const module = await lazyLoadModule("/comm-us/join.js");
    module.openJoinModal();
  });
  joinBtn.insertAdjacentElement("afterend", createHoneypot());

  const contactBtn = document.createElement("button");
  contactBtn.type = "button";
  contactBtn.innerHTML = `${renderIcon("contact")}<span>${copy.contact}</span>`;
  contactBtn.className = "toggle-btn";
  contactBtn.addEventListener("click", async () => {
    const module = await lazyLoadModule("/comm-us/contact.js");
    module.openContactModal();
  });
  contactBtn.insertAdjacentElement("afterend", createHoneypot());

  const chatBtn = document.createElement("button");
  chatBtn.type = "button";
  chatBtn.innerHTML = `${renderIcon("chat")}<span>${copy.chat}</span>`;
  chatBtn.className = "toggle-btn";
  chatBtn.addEventListener("click", async () => {
    const module = await lazyLoadModule("/chatbot/widget.js");
    module.openChattia();
  });
  chatBtn.insertAdjacentElement("afterend", createHoneypot());

  actions.appendChild(langBtn);
  actions.appendChild(themeBtn);
  actions.appendChild(joinBtn);
  actions.appendChild(contactBtn);
  actions.appendChild(chatBtn);

  inner.appendChild(brand);
  inner.appendChild(actions);
  nav.appendChild(inner);

  const state = getState();
  langBtn.setAttribute("aria-pressed", state.lang === "es" ? "true" : "false");
  themeBtn.setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");

  onStateChange((next) => {
    langBtn.setAttribute("aria-pressed", next.lang === "es" ? "true" : "false");
    themeBtn.setAttribute("aria-pressed", next.theme === "dark" ? "true" : "false");
    langBtn.textContent = copy.langToggleLabel(next.lang);
    themeBtn.textContent = copy.themeToggleLabel(next.lang);
    joinBtn.querySelector("span").textContent = copy.joinLabel(next.lang);
    contactBtn.querySelector("span").textContent = copy.contactLabel(next.lang);
    chatBtn.querySelector("span").textContent = copy.chatLabel(next.lang);
  });

  return nav;
}
