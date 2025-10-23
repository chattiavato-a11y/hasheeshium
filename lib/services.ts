export type Language = 'en' | 'es';

export type ServiceKey = 'ops' | 'cc' | 'it' | 'pro';

export interface LocalizedText {
  en: string;
  es: string;
}

export interface LocalizedList {
  en: string[];
  es: string[];
}

export interface ServiceModalContent {
  title: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  content: LocalizedText;
  video: LocalizedText;
  features: LocalizedList;
  learnHref: string;
}

export interface ServiceSummary {
  key: ServiceKey;
  iconClass: string;
  iconLabel: LocalizedText;
  badge: LocalizedText;
  spotlight: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  modal: ServiceModalContent;
}

export const services: ServiceSummary[] = [
  {
    key: 'ops',
    iconClass: 'fa-solid fa-briefcase',
    iconLabel: { en: 'Briefcase icon', es: 'Ícono de portafolio' },
    badge: { en: 'Ops Control Tower', es: 'Torre OPS' },
    spotlight: {
      en: 'Lean automation pods with compliance telemetry',
      es: 'Pods de automatización Lean con telemetría de cumplimiento'
    },
    title: {
      en: 'Business Operations',
      es: 'Operaciones Empresariales'
    },
    description: {
      en: 'Streamline processes, maximize efficiency, ensure compliance, and scale with precision.',
      es: 'Optimice procesos, mejore la eficiencia, asegure cumplimiento y escale con precisión.'
    },
    modal: {
      title: {
        en: 'Business Operations',
        es: 'Sobre Operaciones Empresariales'
      },
      image: 'https://placehold.co/96x96?text=OPS',
      imageAlt: { en: 'Business Operations', es: 'Operaciones Empresariales' },
      content: {
        en: 'Detailed content about our Business Operations services. We help optimize processes, boost efficiency, and drive growth through strategic support. Key areas: process optimization, supply chain management, quality assurance.',
        es: 'Contenido detallado sobre nuestros servicios de Operaciones Empresariales. Optimizamos procesos, mejoramos la eficiencia e impulsamos el crecimiento mediante apoyo estratégico.'
      },
      video: {
        en: 'Video placeholder',
        es: 'Marcador de video'
      },
      features: {
        en: [
          'Workflow digitization & automation',
          'Logistics & inventory efficiency',
          'Risk & compliance frameworks (NIST, ISO, CISA)',
          'Performance metric dashboards & analytics',
          'Remote training & Lean operations'
        ],
        es: [
          'Digitalización y automatización del flujo de trabajo',
          'Estrategias de eficiencia logística e inventario',
          'Marcos de riesgo y cumplimiento (NIST, ISO, CISA)',
          'Cuadros de métricas de rendimiento y analítica',
          'Capacitación remota y operaciones Lean'
        ]
      },
      learnHref: '/business-operations'
    }
  },
  {
    key: 'cc',
    iconClass: 'fa-solid fa-headset',
    iconLabel: { en: 'Headset icon', es: 'Ícono de auriculares' },
    badge: { en: 'CX Pods', es: 'Pods CX' },
    spotlight: {
      en: 'Empathetic omnichannel agents with sentiment radar',
      es: 'Agentes omnicanal empáticos con radar de sentimiento'
    },
    title: {
      en: 'Contact Center',
      es: 'Centro de Contacto'
    },
    description: {
      en: 'Enhance engagement with multilingual, multichannel support—24/7, data-driven, and empathetic.',
      es: 'Mejore la experiencia con soporte multicanal y multilingüe—24/7, basado en datos y empático.'
    },
    modal: {
      title: {
        en: 'Contact Center',
        es: 'Sobre el Centro de Contacto'
      },
      image: 'https://placehold.co/96x96?text=CC',
      imageAlt: { en: 'Contact Center', es: 'Centro de Contacto' },
      content: {
        en: 'Explore our comprehensive Contact Center solutions to elevate customer satisfaction at every touchpoint. Services include inbound/outbound calls, multichannel support, and advanced analytics.',
        es: 'Explore nuestras soluciones integrales de Centro de Contacto para elevar la satisfacción del cliente en cada punto de contacto. Incluye llamadas entrantes/salientes, soporte multicanal y analítica avanzada.'
      },
      video: {
        en: 'Video placeholder',
        es: 'Marcador de video'
      },
      features: {
        en: [
          '24/7 inbound/outbound call management',
          'Multilingual chat/email support',
          'CRM integration (HubSpot, Salesforce)',
          'Social media engagement & sentiment tracking',
          'Customer experience analytics & quality monitoring'
        ],
        es: [
          'Gestión de llamadas entrantes y salientes 24/7',
          'Soporte por chat y correo electrónico multilingüe',
          'Integración con CRM (HubSpot, Salesforce)',
          'Interacción en redes sociales y seguimiento de sentimiento',
          'Analítica de experiencia del cliente y monitoreo de calidad'
        ]
      },
      learnHref: '/contact-center'
    }
  },
  {
    key: 'it',
    iconClass: 'fa-solid fa-laptop-code',
    iconLabel: { en: 'Laptop icon', es: 'Ícono de laptop' },
    badge: { en: 'Cyber Mesh', es: 'Malla Ciber' },
    spotlight: {
      en: '24/7 NIST-hardened engineers orchestrating cloud + edge',
      es: 'Ingenieros 24/7 endurecidos por NIST orquestando nube + edge'
    },
    title: {
      en: 'IT Support',
      es: 'Soporte IT'
    },
    description: {
      en: 'Proactive, secure, real-time tech help, cloud management, and cyber defense for every business size.',
      es: 'Asistencia técnica proactiva y segura, gestión en la nube y ciberdefensa para cualquier empresa.'
    },
    modal: {
      title: {
        en: 'IT Support',
        es: 'Sobre Soporte IT'
      },
      image: 'https://placehold.co/96x96?text=IT',
      imageAlt: { en: 'IT Support', es: 'Soporte IT' },
      content: {
        en: 'Our IT Support services deliver reliable assistance to keep systems running smoothly and securely: help desk, network monitoring, cybersecurity, and cloud infrastructure management.',
        es: 'Nuestros servicios de Soporte IT brindan asistencia confiable para mantener los sistemas funcionando con seguridad: mesa de ayuda, monitoreo de red, ciberseguridad y gestión de infraestructura en la nube.'
      },
      video: {
        en: 'Video placeholder',
        es: 'Marcador de video'
      },
      features: {
        en: [
          '24/7 tech support & remote troubleshooting',
          'Real-time network & system monitoring',
          'Cybersecurity audits, patching, threat detection',
          'Cloud infrastructure setup & maintenance',
          'NIST, CISA, OPS Core CyberSec compliance'
        ],
        es: [
          'Soporte técnico 24/7 y solución remota de problemas',
          'Monitoreo en tiempo real de redes y sistemas',
          'Auditorías de ciberseguridad, parches y detección de amenazas',
          'Implementación y mantenimiento de infraestructura en la nube',
          'Cumplimiento con NIST, CISA y OPS Core CyberSec'
        ]
      },
      learnHref: '/it-support'
    }
  },
  {
    key: 'pro',
    iconClass: 'fa-solid fa-user-tie',
    iconLabel: { en: 'Professional icon', es: 'Ícono de profesional' },
    badge: { en: 'OPS Guild', es: 'Gremio OPS' },
    spotlight: {
      en: 'Cleared specialists embedded with AI copilots',
      es: 'Especialistas certificados integrados con copilotos IA'
    },
    title: {
      en: 'Professionals',
      es: 'Profesionales'
    },
    description: {
      en: 'OPS-vetted talent for IT, HR, projects, finance—contract or full-time, ready when you are.',
      es: 'Talento validado por OPS para TI, RRHH, proyectos y finanzas—contrato o tiempo completo, listo para usted.'
    },
    modal: {
      title: {
        en: 'Professionals',
        es: 'Sobre Profesionales'
      },
      image: 'https://placehold.co/96x96?text=PRO',
      imageAlt: { en: 'Professionals', es: 'Profesionales' },
      content: {
        en: 'Access our network of highly qualified professionals for project or long-term staffing. Experts in IT, project management, finance, and HR. OPS-vetted, NDA, compliance trained.',
        es: 'Acceda a nuestra red de profesionales altamente cualificados para proyectos o personal a largo plazo. Expertos en TI, gestión de proyectos, finanzas y RRHH. Validado por OPS, con NDA y formación en cumplimiento.'
      },
      video: {
        en: 'Video placeholder',
        es: 'Marcador de video'
      },
      features: {
        en: [
          'Remote IT professionals (SysAdmins, DevOps, Analysts)',
          'Project managers & agile consultants',
          'Finance and accounting professionals',
          'HR and recruitment experts',
          'OPS-vetted talent with NDA & compliance training',
          'Ask AI'
        ],
        es: [
          'Profesionales IT remotos (SysAdmins, DevOps, Analistas)',
          'Gerentes de proyecto y consultores ágiles',
          'Profesionales de finanzas y contabilidad',
          'Expertos en recursos humanos y reclutamiento',
          'Talento validado por OPS con NDA y formación en cumplimiento',
          'Preguntar AI'
        ]
      },
      learnHref: '/professionals'
    }
  }
];
