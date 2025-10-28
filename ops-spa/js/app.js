import { initState, onStateChange, getState } from "../../shared/lib/state.js";
import { getHeroCopy, getServiceList } from "../../shared/lib/i18n.js";
import { createNav } from "../components/Nav.js";
import { createHero } from "../components/Hero.js";
import { createCardGrid } from "../components/CardGrid.js";
import { createFooter } from "../components/Footer.js";
import { createFabStack } from "../components/FabStack.js";
import { createMobileActions } from "../components/MobileAccordion.js";

const app = document.getElementById("app");
const main = document.createElement("main");

initState();

const state = getState();
const nav = createNav(buildNavCopy(state.lang));
app.appendChild(nav);
app.appendChild(main);

const fab = createFabStack(buildFabCopy(state.lang));
document.body.appendChild(fab.element);

const mobile = createMobileActions(buildMobileCopy(state.lang));
document.body.appendChild(mobile.element);

render(state.lang);

onStateChange((next) => {
  render(next.lang);
  fab.update(buildFabCopy(next.lang));
  mobile.update(buildMobileCopy(next.lang));
});

async function render(lang) {
  const heroCopy = await getHeroCopy(lang);
  const services = await getServiceList(lang);
  main.innerHTML = "";
  main.appendChild(createHero(heroCopy));
  main.appendChild(createCardGrid(services, buildCardCopy(lang), lang));
  main.appendChild(createFooter(buildFooterCopy(lang)));
}

function buildNavCopy(lang) {
  return {
    brand: "OPS Online Support",
    langToggle: lang === "es" ? "ES" : "EN",
    themeToggle: lang === "es" ? "Oscuro" : "Dark",
    join: lang === "es" ? "Unirse" : "Join",
    contact: lang === "es" ? "Contactar" : "Contact",
    chat: lang === "es" ? "Chattia" : "Chattia",
    langToggleLabel: (next) => (next === "es" ? "ES" : "EN"),
    themeToggleLabel: (next) => (next === "es" ? "Oscuro" : "Dark"),
    joinLabel: (next) => (next === "es" ? "Unirse" : "Join"),
    contactLabel: (next) => (next === "es" ? "Contactar" : "Contact"),
    chatLabel: (next) => (next === "es" ? "Chattia" : "Chattia")
  };
}

function buildFabCopy(lang) {
  return {
    join: lang === "es" ? "Unirse" : "Join",
    contact: lang === "es" ? "Contactar" : "Contact",
    chat: lang === "es" ? "Chattia" : "Chattia",
    stackLabel: lang === "es" ? "Acciones rápidas" : "Quick actions"
  };
}

function buildMobileCopy(lang) {
  return {
    title: lang === "es" ? "Acciones rápidas" : "Quick actions",
    subtitle: lang === "es" ? "Siempre listas en tu dispositivo" : "Always ready on device",
    join: lang === "es" ? "Unirse" : "Join",
    contact: lang === "es" ? "Contactar" : "Contact",
    chat: lang === "es" ? "Chattia" : "Chattia"
  };
}

function buildCardCopy(lang) {
  return {
    title: lang === "es" ? "Gremios OPS" : "OPS Guilds",
    openLabel: lang === "es" ? "Ver detalles" : "View details"
  };
}

function buildFooterCopy(lang) {
  return {
    disclaimer:
      lang === "es"
        ? "OPS CySec Core combina NIST CSF, CISA y PCI DSS con experiencias inclusivas y listas para exportación estática."
        : "OPS CySec Core blends NIST CSF, CISA, and PCI DSS guardrails with inclusive, static-export ready experiences."
  };
}
