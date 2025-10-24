const DISALLOWED = [
  /password/i,
  /credit\s*card/i,
  /ssn/i,
  /exploit/i,
  /hack/i,
  /malware/i,
  /phish/i,
  /sql\s*injection/i
];

const POLICY = {
  en: "Chattia can only discuss OPS services, cybersecurity readiness, accessibility, and platform operations. For other topics, connect with your security lead.",
  es: "Chattia solo aborda servicios OPS, preparación cibernética, accesibilidad y operaciones de plataforma. Para otros temas, contacta a tu líder de seguridad."
};

export function enforceSafety(message, lang = "en") {
  const trimmed = (message || "").trim();
  if (!trimmed) {
    return {
      allowed: false,
      reason: "empty",
      response: lang === "es" ? "Comparte más contexto para ayudarte." : "Please share more context so I can assist."
    };
  }
  for (const pattern of DISALLOWED) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        reason: "disallowed",
        response: POLICY[lang] || POLICY.en
      };
    }
  }
  return { allowed: true };
}

export function policyMessage(lang = "en") {
  return POLICY[lang] || POLICY.en;
}
