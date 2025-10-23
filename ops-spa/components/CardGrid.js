import { openServiceModal } from "./Modal.js";

function createHoneypot() {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "website";
  input.className = "hidden-input";
  input.setAttribute("aria-hidden", "true");
  return input;
}

export function createCardGrid(services, copy, lang) {
  const section = document.createElement("section");
  section.id = "services";
  const heading = document.createElement("h2");
  heading.textContent = copy.title;
  heading.style.fontSize = "1.75rem";
  section.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "card-grid";

  services.forEach((service) => {
    const card = document.createElement("article");
    card.className = "card";
    card.id = service.id;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = service.badge;

    const title = document.createElement("h3");
    title.textContent = service.title;

    const excerpt = document.createElement("p");
    excerpt.textContent = service.excerpt;

    const action = document.createElement("button");
    action.type = "button";
    action.textContent = copy.openLabel;
    action.addEventListener("click", () => openServiceModal(service, lang));
    action.insertAdjacentElement("afterend", createHoneypot());

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(excerpt);
    card.appendChild(action);
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}
