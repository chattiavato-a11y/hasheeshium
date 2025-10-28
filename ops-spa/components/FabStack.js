import { lazyLoadModule, prefetchModule } from "../../shared/lib/lazy.js";
import { renderIcon } from "../../shared/lib/icons/index.js";

function createHoneypot() {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "website";
  input.className = "hidden-input";
  input.setAttribute("aria-hidden", "true");
  input.tabIndex = -1;
  input.autocomplete = "off";
  return input;
}

function createFabButton({ icon, label, modulePath, onResolve }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fab-button";

  const iconWrap = document.createElement("span");
  iconWrap.className = "fab-icon";
  iconWrap.setAttribute("aria-hidden", "true");
  iconWrap.innerHTML = renderIcon(icon);

  const labelNode = document.createElement("span");
  labelNode.className = "fab-label";
  labelNode.textContent = label;

  button.append(iconWrap, labelNode);

  button.addEventListener("click", async () => {
    const module = await lazyLoadModule(modulePath);
    onResolve(module);
  });

  button.addEventListener(
    "pointerenter",
    () => {
      prefetchModule(modulePath);
    },
    { once: true }
  );

  return { button, labelNode };
}

export function createFabStack(copy) {
  const container = document.createElement("div");
  container.className = "fab-stack";
  container.setAttribute("role", "complementary");
  container.setAttribute("aria-label", copy.stackLabel);

  const join = createFabButton({
    icon: "join",
    label: copy.join,
    modulePath: "/comm-us/join.js",
    onResolve(module) {
      module.openJoinModal();
    }
  });
  const contact = createFabButton({
    icon: "contact",
    label: copy.contact,
    modulePath: "/comm-us/contact.js",
    onResolve(module) {
      module.openContactModal();
    }
  });
  const chat = createFabButton({
    icon: "chat",
    label: copy.chat,
    modulePath: "/chatbot/widget.js",
    onResolve(module) {
      module.openChattia();
    }
  });

  container.append(join.button, createHoneypot());
  container.append(contact.button, createHoneypot());
  container.append(chat.button, createHoneypot());

  const media = window.matchMedia("(min-width: 901px)");
  const syncVisibility = () => {
    const isDesktop = media.matches;
    container.style.display = isDesktop ? "flex" : "none";
    container.toggleAttribute("aria-hidden", !isDesktop);
    if ("inert" in container) {
      container.inert = !isDesktop;
    }
  };
  syncVisibility();

  const useModernListener = typeof media.addEventListener === "function";
  if (useModernListener) {
    media.addEventListener("change", syncVisibility);
  } else if (typeof media.addListener === "function") {
    media.addListener(syncVisibility);
  }

  return {
    element: container,
    update(nextCopy) {
      container.setAttribute("aria-label", nextCopy.stackLabel);
      join.labelNode.textContent = nextCopy.join;
      contact.labelNode.textContent = nextCopy.contact;
      chat.labelNode.textContent = nextCopy.chat;
    },
    destroy() {
      if (useModernListener && typeof media.removeEventListener === "function") {
        media.removeEventListener("change", syncVisibility);
      } else if (!useModernListener && typeof media.removeListener === "function") {
        media.removeListener(syncVisibility);
      }
      container.remove();
    }
  };
}
