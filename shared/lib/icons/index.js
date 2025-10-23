const ICONS = {
  join: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a5 5 0 0 1 4.57 6.91l4.25 4.25a2 2 0 0 1-2.82 2.82l-4.25-4.25A5 5 0 1 1 12 2Zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6Zm-7.71 9.29a1 1 0 0 1 1.42 0L9 16.59V21a1 1 0 0 1-1.45.89l-3-1.5A1 1 0 0 1 4 19.5v-3.91l.29-.29ZM14 14a1 1 0 0 1 1 1v6a1 1 0 0 1-1.45.9l-3-1.5A1 1 0 0 1 10 19.5V15a1 1 0 0 1 1.71-.71l1.29 1.3l1.29-1.3A1 1 0 0 1 14 14Z"/></svg>`,
  contact: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14.59l-3.29-3.3a1 1 0 0 0-.71-.29H6a2 2 0 0 1-2-2ZM6 6v7h10.59L18 14.41V6ZM7 19h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2Z"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4.59l-4.7 4.7A1 1 0 0 1 9 20v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 4a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2Zm0 4a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 4a1 1 0 0 1 1 1V6.1A6 6 0 0 1 17.9 11H19a1 1 0 0 1 0 2h-1.1A6 6 0 0 1 13 17.9V19a1 1 0 0 1-2 0v-1.1A6 6 0 0 1 6.1 13H5a1 1 0 0 1 0-2h1.1A6 6 0 0 1 11 6.1V5a1 1 0 0 1 1-1Z"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M11.5 2a1 1 0 0 1 .95 1.3a7 7 0 0 0 8.24 8.84a1 1 0 0 1 1.09 1.45A9 9 0 1 1 11.2 2.05a.98.98 0 0 1 .3-.05Zm-4 5.34A7 7 0 0 0 16.66 16a9 9 0 0 1-9.16-8.66Z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 1-9.95 11.1A10 10 0 0 1 12 2Zm7.92 8H16.2a15.85 15.85 0 0 0-1.27-4.46A8 8 0 0 1 19.92 10Zm-5.72 0h-3.4a13.84 13.84 0 0 1 1.7-4.42A13.92 13.92 0 0 1 14.2 10Zm-5.38 0H4.08a8 8 0 0 1 5-4.52A15.77 15.77 0 0 0 8.82 10Zm.09 2H4.2a8 8 0 0 0 5 4.7A15.54 15.54 0 0 1 8.91 12Zm3.93 0h-1.68A11.9 11.9 0 0 0 12 16.65A11.81 11.81 0 0 0 12.84 12Zm2.52 0h3.43a8 8 0 0 1-5.21 4.83A13.68 13.68 0 0 0 15.36 12Z"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Zm7 8a1 1 0 0 1 2 0a9 9 0 0 1-8 8.94V22h3a1 1 0 0 1 0 2H8a1 1 0 1 1 0-2h3v-3.06A9 9 0 0 1 3 10a1 1 0 0 1 2 0a7 7 0 0 0 14 0Z"/></svg>`,
  send: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="m3.4 2.2l18.15 9.08a1 1 0 0 1 0 1.84L3.4 22.2a1 1 0 0 1-1.36-1.2l2.26-6.78L15 12L4.3 9.78L2.04 3a1 1 0 0 1 1.36-1.2Z"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.34 4.93a1 1 0 0 1 1.41 0L12 9.17l4.24-4.24a1 1 0 1 1 1.41 1.42L13.41 10.6l4.24 4.24a1 1 0 0 1-1.41 1.41L12 12l-4.24 4.24a1 1 0 0 1-1.41-1.41l4.24-4.24l-4.24-4.25a1 1 0 0 1 0-1.41Z"/></svg>`
};

export function renderIcon(name) {
  const svg = ICONS[name];
  if (!svg) return '';
  return svg;
}

export function injectIcon(name, element) {
  if (!element) return;
  element.innerHTML = renderIcon(name);
}

export default ICONS;
