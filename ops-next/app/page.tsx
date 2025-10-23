'use client';

import { useEffect, useState } from 'react';
import { getHeroCopy, getServiceList } from '../../shared/lib/i18n.js';
import { getState, initState, onStateChange } from '../../shared/lib/state.js';
import { Nav } from '../components/Nav';
import { Hero } from '../components/Hero';
import { CardGrid } from '../components/CardGrid';
import { Footer } from '../components/Footer';
import { FabStack } from '../components/FabStack';
import { MobileActions } from '../components/MobileActions';

type Service = Parameters<typeof CardGrid>[0]['services'][number];

type HeroCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
};

export default function Page() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [hero, setHero] = useState<HeroCopy | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    initState();
    const current = getState();
    setLang(current.lang as 'en' | 'es');
    loadLanguage(current.lang as 'en' | 'es');
    const unsubscribe = onStateChange((next) => {
      setLang(next.lang as 'en' | 'es');
      loadLanguage(next.lang as 'en' | 'es');
    });
    return () => {
      unsubscribe();
    };
  }, []);

  async function loadLanguage(nextLang: 'en' | 'es') {
    const heroCopy = await getHeroCopy(nextLang);
    const serviceList = await getServiceList(nextLang);
    setHero(heroCopy as HeroCopy);
    setServices(serviceList as Service[]);
  }

  const cardCopy = buildCardCopy(lang);
  const footerCopy = buildFooterCopy(lang);
  const fabCopy = buildFabCopy(lang);
  const mobileCopy = buildMobileCopy(lang);

  return (
    <>
      <Nav />
      <main>
        {hero ? <Hero {...hero} /> : null}
        <CardGrid services={services} title={cardCopy.title} openLabel={cardCopy.openLabel} />
        <Footer text={footerCopy.disclaimer} />
      </main>
      <FabStack labels={fabCopy} />
      <MobileActions copy={mobileCopy} />
    </>
  );
}

function buildFabCopy(lang: 'en' | 'es') {
  return {
    join: lang === 'es' ? 'Unirse' : 'Join',
    contact: lang === 'es' ? 'Contactar' : 'Contact',
    chat: 'Chattia'
  };
}

function buildMobileCopy(lang: 'en' | 'es') {
  return {
    title: lang === 'es' ? 'Acciones rápidas' : 'Quick actions',
    subtitle: lang === 'es' ? 'Siempre listas en tu dispositivo' : 'Always ready on device',
    join: lang === 'es' ? 'Unirse' : 'Join',
    contact: lang === 'es' ? 'Contactar' : 'Contact',
    chat: 'Chattia'
  };
}

function buildCardCopy(lang: 'en' | 'es') {
  return {
    title: lang === 'es' ? 'Gremios OPS' : 'OPS Guilds',
    openLabel: lang === 'es' ? 'Ver detalles' : 'View details'
  };
}

function buildFooterCopy(lang: 'en' | 'es') {
  return {
    disclaimer:
      lang === 'es'
        ? 'OPS CySec Core combina NIST CSF, CISA y PCI DSS con experiencias inclusivas y listas para exportación estática.'
        : 'OPS CySec Core blends NIST CSF, CISA, and PCI DSS guardrails with inclusive, static-export ready experiences.'
  };
}
