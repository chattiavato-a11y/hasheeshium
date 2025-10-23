function createHoneypot() {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "website";
  input.className = "hidden-input";
  input.setAttribute("aria-hidden", "true");
  return input;
}

export function createHero(copy) {
  const section = document.createElement("section");
  section.className = "hero";

  const eyebrow = document.createElement("span");
  eyebrow.className = "badge";
  eyebrow.textContent = copy.eyebrow;

  const title = document.createElement("h1");
  title.textContent = copy.title;

  const subtitle = document.createElement("p");
  subtitle.textContent = copy.subtitle;

  const cta = document.createElement("button");
  cta.type = "button";
  cta.textContent = copy.primaryCta;
  cta.addEventListener("click", () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  });
  cta.insertAdjacentElement("afterend", createHoneypot());

  section.appendChild(eyebrow);
  section.appendChild(title);
  section.appendChild(subtitle);
  section.appendChild(cta);

  return section;
}
