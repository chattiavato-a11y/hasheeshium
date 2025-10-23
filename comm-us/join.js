import { openModal } from "./ui.js";
import { initState, getState } from "../shared/lib/state.js";
import { buildValidationSummary } from "./validators.js";
import { createHoneypotInput, honeypotTripped } from "./honeypot.js";

const COPY = {
  en: {
    title: "Join OPS Guild",
    description: "Share a few details so we can align cohorts and security onboarding.",
    submit: "Save Interest",
    close: "Close",
    success: "Saved locally — copy the payload below and share securely.",
    error: "Please review the highlighted fields.",
    rateLimit: "You can submit again in a few seconds.",
    honeypot: "Submission blocked. Please clear any automation fields.",
    exportLabel: "Validated payload"
  },
  es: {
    title: "Únete al Gremio OPS",
    description: "Comparte algunos datos para alinear cohortes y onboarding seguro.",
    submit: "Guardar Interés",
    close: "Cerrar",
    success: "Guardado localmente — copia el payload a continuación y compártelo de forma segura.",
    error: "Revisa los campos resaltados.",
    rateLimit: "Podrás enviar nuevamente en unos segundos.",
    honeypot: "Envío bloqueado. Limpia cualquier campo automático.",
    exportLabel: "Payload validado"
  }
};

const FIELD_COPY = {
  en: {
    name: "Full name",
    email: "Work email",
    phone: "Secure phone",
    comments: "Comments & goals"
  },
  es: {
    name: "Nombre completo",
    email: "Correo de trabajo",
    phone: "Teléfono seguro",
    comments: "Comentarios y metas"
  }
};

let lastSubmittedAt = 0;

export function openJoinModal() {
  initState();
  const { lang } = getState();
  const strings = COPY[lang];
  const labels = FIELD_COPY[lang];

  const form = document.createElement("form");
  form.className = "form-grid";
  form.noValidate = true;

  const nameField = createField("name", labels.name, "text", 2, 60);
  const emailField = createField("email", labels.email, "email", 5, 120);
  const phoneField = createField("phone", labels.phone, "tel", 7, 20);
  const commentsField = createTextArea("comments", labels.comments, 10, 800);

  [nameField, emailField, phoneField, commentsField].forEach(({ wrapper }) => form.appendChild(wrapper));

  const status = document.createElement("div");
  status.setAttribute("role", "status");
  form.appendChild(status);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = strings.submit;

  const honeypot = createHoneypotInput();
  submitBtn.insertAdjacentElement("afterend", honeypot);

  const exportWrap = document.createElement("div");
  exportWrap.style.display = "grid";
  exportWrap.style.gap = "8px";
  exportWrap.style.marginTop = "12px";

  const exportLabel = document.createElement("label");
  exportLabel.textContent = strings.exportLabel;
  exportLabel.className = "hint";

  const exportArea = document.createElement("textarea");
  exportArea.readOnly = true;
  exportArea.rows = 6;
  exportArea.style.fontFamily = "var(--font-family-mono)";

  exportWrap.appendChild(exportLabel);
  exportWrap.appendChild(exportArea);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    status.className = "";
    const now = Date.now();
    if (now - lastSubmittedAt < 10000) {
      status.className = "alert";
      status.textContent = strings.rateLimit;
      return;
    }
    if (honeypotTripped(form)) {
      status.className = "alert";
      status.textContent = strings.honeypot;
      return;
    }
    const payload = {
      name: nameField.input.value,
      email: emailField.input.value,
      phone: phoneField.input.value,
      comments: commentsField.input.value
    };
    const result = buildValidationSummary(payload);
    [nameField, emailField, phoneField, commentsField].forEach((field) => field.wrapper.classList.remove("alert"));
    if (!result.ok) {
      status.className = "alert";
      status.textContent = strings.error;
      const map = {
        name: nameField,
        email: emailField,
        phone: phoneField,
        comments: commentsField
      };
      result.errors.forEach((key) => {
        map[key].wrapper.classList.add("alert");
      });
      return;
    }
    lastSubmittedAt = now;
    exportArea.value = JSON.stringify({ ...payload, submittedAt: new Date(now).toISOString() }, null, 2);
    status.className = "alert success";
    status.textContent = strings.success;
    form.reset();
    disableForCooldown(submitBtn, strings.submit);
  });

  const modal = openModal({
    title: strings.title,
    description: strings.description,
    content: (body) => {
      body.appendChild(form);
    },
    footer: (footerEl) => {
      footerEl.appendChild(submitBtn);
      footerEl.appendChild(exportWrap);
      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.textContent = strings.close;
      closeButton.classList.add("toggle-btn");
      closeButton.addEventListener("click", () => modal.close());
      const trap = createHoneypotInput();
      closeButton.insertAdjacentElement("afterend", trap);
      footerEl.appendChild(closeButton);
    }
  });

  return modal;
}

function disableForCooldown(button, label) {
  button.disabled = true;
  let remaining = 10;
  button.textContent = `${label} (${remaining}s)`;
  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timer);
      button.disabled = false;
      button.textContent = label;
    } else {
      button.textContent = `${label} (${remaining}s)`;
    }
  }, 1000);
}

function createField(name, labelText, type, min, max) {
  const wrapper = document.createElement("label");
  wrapper.htmlFor = name;
  const span = document.createElement("span");
  span.textContent = labelText;
  const input = document.createElement("input");
  input.id = name;
  input.name = name;
  input.type = type;
  input.minLength = min;
  input.maxLength = max;
  input.required = true;
  wrapper.appendChild(span);
  wrapper.appendChild(input);
  return { wrapper, input };
}

function createTextArea(name, labelText, min, max) {
  const wrapper = document.createElement("label");
  wrapper.htmlFor = name;
  const span = document.createElement("span");
  span.textContent = labelText;
  const textarea = document.createElement("textarea");
  textarea.id = name;
  textarea.name = name;
  textarea.minLength = min;
  textarea.maxLength = max;
  textarea.required = true;
  wrapper.appendChild(span);
  wrapper.appendChild(textarea);
  return { wrapper, input: textarea };
}
