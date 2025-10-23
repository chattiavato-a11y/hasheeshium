const HONEYPOT_FIELD = "website";

export function createHoneypotInput() {
  const input = document.createElement("input");
  input.type = "text";
  input.name = HONEYPOT_FIELD;
  input.tabIndex = -1;
  input.autocomplete = "off";
  input.className = "hidden-input";
  input.setAttribute("aria-hidden", "true");
  input.setAttribute("data-honeypot", "true");
  return input;
}

export function honeypotTripped(container) {
  const field = container.querySelector(`[name="${HONEYPOT_FIELD}"]`);
  return field && field.value.trim().length > 0;
}

export function attachToButton(button) {
  if (!button || !button.parentElement) return;
  const trap = createHoneypotInput();
  button.insertAdjacentElement("afterend", trap);
}
