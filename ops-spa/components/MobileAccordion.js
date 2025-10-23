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

export function createMobileActions(copy) {
  const container = document.createElement("div");
  container.className = "mobile-actions";

  const header = document.createElement("header");
  const title = document.createElement("strong");
  title.textContent = copy.title;
  const subtitle = document.createElement("span");
  subtitle.className = "hint";
  subtitle.textContent = copy.subtitle;
  header.appendChild(title);
  header.appendChild(subtitle);

  const group = document.createElement("div");
  group.className = "accordion";

  const join = document.createElement("button");
  join.type = "button";
  join.innerHTML = `${renderIcon("join")}<span>${copy.join}</span>`;
  join.addEventListener("click", async () => {
    const module = await lazyLoadModule("/comm-us/join.js");
    module.openJoinModal();
  });
  join.insertAdjacentElement("afterend", createHoneypot());

  const contact = document.createElement("button");
  contact.type = "button";
  contact.innerHTML = `${renderIcon("contact")}<span>${copy.contact}</span>`;
  contact.addEventListener("click", async () => {
    const module = await lazyLoadModule("/comm-us/contact.js");
    module.openContactModal();
  });
  contact.insertAdjacentElement("afterend", createHoneypot());

  const chat = document.createElement("button");
  chat.type = "button";
  chat.innerHTML = `${renderIcon("chat")}<span>${copy.chat}</span>`;
  chat.addEventListener("click", async () => {
    const module = await lazyLoadModule("/chatbot/widget.js");
    module.openChattia();
  });
  chat.insertAdjacentElement("afterend", createHoneypot());

  group.appendChild(join);
  group.appendChild(contact);
  group.appendChild(chat);

  container.appendChild(header);
  container.appendChild(group);

  const media = window.matchMedia("(min-width: 901px)");
  function syncVisibility() {
    container.style.display = media.matches ? "none" : "grid";
  }
  syncVisibility();
  media.addEventListener("change", syncVisibility);

  return {
    element: container,
    update(copy) {
      title.textContent = copy.title;
      subtitle.textContent = copy.subtitle;
      join.querySelector("span").textContent = copy.join;
      contact.querySelector("span").textContent = copy.contact;
      chat.querySelector("span").textContent = copy.chat;
    }
  };
}
