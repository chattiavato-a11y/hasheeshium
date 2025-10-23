export interface SanitizedField<T = string> {
  original: T;
  sanitized: T;
  warnings: string[];
}

const dangerousPattern = /[<>`"'\\]/g;
const controlChars = /[\u0000-\u001F\u007F]/g;
const urlPattern = /https?:\/\//gi;

export const sanitizeString = (value: string, maxLength = 500): SanitizedField<string> => {
  const warnings: string[] = [];
  let sanitized = value.trim();

  if (sanitized.length > maxLength) {
    warnings.push(`Value truncated to ${maxLength} characters.`);
    sanitized = sanitized.slice(0, maxLength);
  }

  if (dangerousPattern.test(sanitized)) {
    warnings.push('Dangerous characters removed.');
    sanitized = sanitized.replace(dangerousPattern, '');
  }

  if (controlChars.test(sanitized)) {
    warnings.push('Control characters removed.');
    sanitized = sanitized.replace(controlChars, '');
  }

  if (urlPattern.test(sanitized)) {
    warnings.push('Inline URLs stripped to prevent injection.');
    sanitized = sanitized.replace(urlPattern, '');
  }

  return {
    original: value,
    sanitized,
    warnings
  };
};

export const sanitizeEmail = (value: string): SanitizedField<string> => {
  const result = sanitizeString(value, 320);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(result.sanitized)) {
    result.warnings.push('Email address failed RFC validation.');
  }
  return result;
};

export const sanitizeFormPayload = <T extends Record<string, unknown>>(payload: T) => {
  const sanitizedEntries = Object.entries(payload).map(([key, value]) => {
    if (typeof value === 'string') {
      return [key, sanitizeString(value) as SanitizedField<string>];
    }
    if (Array.isArray(value)) {
      return [
        key,
        value.map((item) => (typeof item === 'string' ? sanitizeString(item) : { original: item, sanitized: item, warnings: [] }))
      ];
    }
    return [key, { original: value, sanitized: value, warnings: [] }];
  });

  return Object.fromEntries(sanitizedEntries) as {
    [K in keyof T]: T[K] extends string
      ? SanitizedField<string>
      : T[K] extends Array<infer U>
        ? U extends string
          ? SanitizedField<string>[]
          : SanitizedField<U>[]
        : SanitizedField<T[K]>;
  };
};
