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

export function createFabStack(copy) {
  const container = document.createElement("div");
  container.className = "fab-stack";

  const join = document.createElement("button");
  join.type = "button";
  join.className = "fab-button";
  join.innerHTML = `${renderIcon("join")}<span>${copy.join}</span>`;
  join.addEventListener("click", async () => {
    const module = await lazyLoadModule("/comm-us/join.js");
    module.openJoinModal();
  });
  join.insertAdjacentElement("afterend", createHoneypot());

  const contact = document.createElement("button");
  contact.type = "button";
  contact.className = "fab-button";
  contact.innerHTML = `${renderIcon("contact")}<span>${copy.contact}</span>`;
  contact.addEventListener("click", async () => {
    const module = await lazyLoadModule("/comm-us/contact.js");
    module.openContactModal();
  });
  contact.insertAdjacentElement("afterend", createHoneypot());

  const chat = document.createElement("button");
  chat.type = "button";
  chat.className = "fab-button";
  chat.innerHTML = `${renderIcon("chat")}<span>${copy.chat}</span>`;
  chat.addEventListener("click", async () => {
    const module = await lazyLoadModule("/chatbot/widget.js");
    module.openChattia();
  });
  chat.insertAdjacentElement("afterend", createHoneypot());

  container.appendChild(join);
  container.appendChild(contact);
  container.appendChild(chat);

  const media = window.matchMedia("(min-width: 901px)");
  function syncVisibility() {
    container.style.display = media.matches ? "flex" : "none";
  }
  syncVisibility();
  media.addEventListener("change", syncVisibility);

  return {
    element: container,
    update(nextCopy) {
      join.querySelector("span").textContent = nextCopy.join;
      contact.querySelector("span").textContent = nextCopy.contact;
      chat.querySelector("span").textContent = nextCopy.chat;
    }
  };
}
