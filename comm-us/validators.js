const namePattern = /^[a-zA-ZÀ-ÿ'\-\s]{2,60}$/;
const emailPattern = /^[\w.!#$%&'*+/=?`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/;
const phonePattern = /^[+()\d\s-]{7,20}$/;
const commentPattern = /^[\wÀ-ÿ0-9\s.,;:?!@()'"/-]{10,800}$/;

function validateField(value, pattern, errorKey) {
  if (!value || !pattern.test(value)) {
    return {
      ok: false,
      error: errorKey
    };
  }
  return { ok: true };
}

export function validateName(value) {
  return validateField(value.trim(), namePattern, "name");
}

export function validateEmail(value) {
  return validateField(value.trim(), emailPattern, "email");
}

export function validatePhone(value) {
  return validateField(value.trim(), phonePattern, "phone");
}

export function validateComments(value) {
  const trimmed = value.trim();
  if (!commentPattern.test(trimmed)) {
    return {
      ok: false,
      error: "comments"
    };
  }
  return { ok: true };
}

export function buildValidationSummary(payload) {
  const validators = [
    ["name", validateName],
    ["email", validateEmail],
    ["phone", validatePhone],
    ["comments", validateComments]
  ];
  const errors = [];
  for (const [key, fn] of validators) {
    const result = fn(payload[key] ?? "");
    if (!result.ok) {
      errors.push(result.error);
    }
  }
  return {
    ok: errors.length === 0,
    errors
  };
}
