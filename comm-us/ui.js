import { lockBodyScroll, unlockBodyScroll, trapFocus, bindModalLifecycle, makeDraggable } from "../shared/lib/hci.js";
import { renderIcon } from "../shared/lib/icons/index.js";

export function openModal({ title, description, content, footer }) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const shell = document.createElement("div");
  shell.className = "modal-shell";
  shell.setAttribute("role", "dialog");
  shell.setAttribute("aria-modal", "true");
  shell.setAttribute("aria-label", title);

  const header = document.createElement("header");
  header.className = "modal-header";

  const headingGroup = document.createElement("div");
  headingGroup.style.display = "grid";
  headingGroup.style.gap = "6px";

  const h2 = document.createElement("h2");
  h2.textContent = title;
  h2.style.fontSize = "1.25rem";
  h2.style.margin = "0";
  headingGroup.appendChild(h2);

  if (description) {
    const p = document.createElement("p");
    p.className = "hint";
    p.textContent = description;
    headingGroup.appendChild(p);
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.innerHTML = renderIcon("close");
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.style.minWidth = "48px";
  closeBtn.classList.add("toggle-btn");

  const body = document.createElement("div");
  body.className = "modal-body";

  if (typeof content === "function") {
    const result = content(body);
    if (result instanceof HTMLElement) {
      body.appendChild(result);
    }
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }

  const footerEl = document.createElement("div");
  footerEl.className = "modal-footer";
  if (footer instanceof HTMLElement) {
    footerEl.appendChild(footer);
  } else if (typeof footer === "function") {
    footer(footerEl);
  }

  header.appendChild(headingGroup);
  header.appendChild(closeBtn);

  shell.appendChild(header);
  shell.appendChild(body);
  if (footer) {
    shell.appendChild(footerEl);
  }

  backdrop.appendChild(shell);

  lockBodyScroll();
  document.body.appendChild(backdrop);

  const releaseFocus = trapFocus(shell);
  const releaseLifecycle = bindModalLifecycle(backdrop, close);
  const releaseDrag = makeDraggable(shell, header);

  closeBtn.addEventListener("click", () => close());

  function close() {
    releaseFocus();
    releaseLifecycle();
    releaseDrag();
    backdrop.remove();
    unlockBodyScroll();
  }

  return { close, shell, body, footer: footerEl, header, backdrop };
}
