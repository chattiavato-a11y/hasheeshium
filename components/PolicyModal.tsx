import { useEffect, useRef } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import useDraggable from '../hooks/useDraggable';

type PolicyVariant = 'terms' | 'cookies' | 'policy';

interface PolicyModalProps {
  variant: PolicyVariant;
  onClose: () => void;
}

interface PolicySection {
  heading: string;
  body: string;
}

interface PolicyCopy {
  title: string;
  intro: string;
  sections: PolicySection[];
  acknowledgement: string;
  close: string;
}

const policyCopy: Record<PolicyVariant, Record<'en' | 'es', PolicyCopy>> = {
  terms: {
    en: {
      title: 'Terms & Conditions',
      intro:
        'These Terms & Conditions describe how you may engage with OPS Online Support digital experiences and managed services. By continuing, you agree to operate within regulated, security-first workflows.',
      sections: [
        {
          heading: 'Responsible Use',
          body:
            'OPS Online Support assets are provided to evaluate or request secure services. Do not upload confidential or regulated data without a signed agreement. All interactions are monitored for compliance and abuse detection.'
        },
        {
          heading: 'Service Commitments',
          body:
            'Response times, deliverables, and availability are governed by mutually executed statements of work. Digital previews and playbooks do not constitute legal guarantees until commercial terms are finalized.'
        },
        {
          heading: 'Data Protection',
          body:
            'Information shared via forms or Chattia is encrypted in transit and at rest, retained under PCI DSS Requirement 10 guidelines, and removed upon request in accordance with GDPR/CCPA obligations.'
        }
      ],
      acknowledgement: 'I acknowledge the OPS Online Support Terms & Conditions',
      close: 'Close'
    },
    es: {
      title: 'Términos y Condiciones',
      intro:
        'Estos Términos y Condiciones describen cómo puede interactuar con las experiencias digitales y servicios administrados de OPS Online Support. Al continuar, acepta operar dentro de flujos de trabajo regulados y con prioridad en la seguridad.',
      sections: [
        {
          heading: 'Uso Responsable',
          body:
            'Los activos de OPS Online Support se ofrecen para evaluar o solicitar servicios seguros. No cargue datos confidenciales o regulados sin un acuerdo firmado. Todas las interacciones se monitorean para cumplimiento y detección de abusos.'
        },
        {
          heading: 'Compromisos de Servicio',
          body:
            'Los tiempos de respuesta, entregables y disponibilidad se rigen por declaraciones de trabajo ejecutadas mutuamente. Las demostraciones digitales y playbooks no constituyen garantías legales hasta que se formalicen los términos comerciales.'
        },
        {
          heading: 'Protección de Datos',
          body:
            'La información compartida mediante formularios o Chattia se cifra en tránsito y en reposo, se conserva bajo las pautas del Requisito 10 de PCI DSS y se elimina a solicitud de acuerdo con las obligaciones de GDPR/CCPA.'
        }
      ],
      acknowledgement: 'Reconozco los Términos y Condiciones de OPS Online Support',
      close: 'Cerrar'
    }
  },
  cookies: {
    en: {
      title: 'Cookies Consent',
      intro:
        'OPS Online Support uses strictly-necessary cookies to maintain secure sessions and optional analytics cookies to improve customer experience (CX). We do not sell personal data.',
      sections: [
        {
          heading: 'Essential Cookies',
          body:
            'Authentication, language preference, and security controls rely on encrypted, first-party cookies aligned with OPS CySec Core protections. Blocking them may degrade functionality.'
        },
        {
          heading: 'Analytics Cookies',
          body:
            'Anonymized telemetry helps us measure Core Web Vitals, accessibility, and incident readiness. Analytics cookies are activated only after consent and can be revoked at any time.'
        },
        {
          heading: 'Managing Preferences',
          body:
            'You can update consent from this banner or by contacting privacy@opsonlinesupport.example. Requests are honored within 30 days and logged for audit accountability.'
        }
      ],
      acknowledgement: 'Save cookie preferences',
      close: 'Close'
    },
    es: {
      title: 'Consentimiento de Cookies',
      intro:
        'OPS Online Support utiliza cookies estrictamente necesarias para mantener sesiones seguras y cookies analíticas opcionales para mejorar la experiencia del cliente (CX). No vendemos datos personales.',
      sections: [
        {
          heading: 'Cookies Esenciales',
          body:
            'La autenticación, las preferencias de idioma y los controles de seguridad dependen de cookies cifradas de primera parte alineadas con las protecciones de OPS CySec Core. Bloquearlas puede degradar la funcionalidad.'
        },
        {
          heading: 'Cookies Analíticas',
          body:
            'La telemetría anonimizada nos ayuda a medir Core Web Vitals, accesibilidad y preparación ante incidentes. Las cookies analíticas se activan solo después del consentimiento y pueden revocarse en cualquier momento.'
        },
        {
          heading: 'Gestión de Preferencias',
          body:
            'Puede actualizar el consentimiento desde este banner o contactando a privacy@opsonlinesupport.example. Las solicitudes se atienden dentro de 30 días y se registran para responsabilidad de auditoría.'
        }
      ],
      acknowledgement: 'Guardar preferencias de cookies',
      close: 'Cerrar'
    }
  },
  policy: {
    en: {
      title: 'Website Policy',
      intro:
        'Our Website Policy covers accessibility, security, and governance expectations for every OPS Online Support property.',
      sections: [
        {
          heading: 'Accessibility & Inclusion',
          body:
            'Interfaces are crafted to meet WCAG 2.1 AA guidelines, with bilingual content, reduced-motion options, and screen reader landmarks. Feedback is welcomed at accessibility@opsonlinesupport.example.'
        },
        {
          heading: 'Security & Privacy',
          body:
            'We enforce HSTS, CSP, X-Frame-Options, and modern TLS configurations. Personal information is processed under least-privilege controls mapped to NIST CSF, CISA, and PCI DSS.'
        },
        {
          heading: 'Governance & Updates',
          body:
            'Policy reviews occur quarterly. Material updates are timestamped within release notes and version-controlled to maintain transparency for auditors and customers alike.'
        }
      ],
      acknowledgement: 'I understand the OPS Online Support Website Policy',
      close: 'Close'
    },
    es: {
      title: 'Política del Sitio Web',
      intro:
        'Nuestra Política del Sitio Web cubre expectativas de accesibilidad, seguridad y gobernanza para cada propiedad de OPS Online Support.',
      sections: [
        {
          heading: 'Accesibilidad e Inclusión',
          body:
            'Las interfaces se diseñan para cumplir con las pautas WCAG 2.1 AA, con contenido bilingüe, opciones de reducción de movimiento y marcadores para lectores de pantalla. Puede enviar comentarios a accessibility@opsonlinesupport.example.'
        },
        {
          heading: 'Seguridad y Privacidad',
          body:
            'Aplicamos HSTS, CSP, X-Frame-Options y configuraciones TLS modernas. La información personal se procesa bajo controles de mínimo privilegio alineados con NIST CSF, CISA y PCI DSS.'
        },
        {
          heading: 'Gobernanza y Actualizaciones',
          body:
            'La política se revisa trimestralmente. Las actualizaciones importantes se registran con marcas de tiempo en las notas de lanzamiento y se controlan mediante versiones para mantener la transparencia con auditores y clientes.'
        }
      ],
      acknowledgement: 'Entiendo la Política del Sitio Web de OPS Online Support',
      close: 'Cerrar'
    }
  }
};

const PolicyModal = ({ variant, onClose }: PolicyModalProps) => {
  const { language } = useExperience();
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const copy = policyCopy[variant][language];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useDraggable(modalRef, headerRef);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal-content policy-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`policy-${variant}-title`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header" ref={headerRef}>
          <h3 id={`policy-${variant}-title`}>{copy.title}</h3>
          <button type="button" className="close-modal" aria-label={copy.close} onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content-body">
          <p>{copy.intro}</p>
          <dl className="policy-list">
            {copy.sections.map((section) => (
              <div key={section.heading} className="policy-list-item">
                <dt>{section.heading}</dt>
                <dd>{section.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="modal-actions">
          <button type="button" className="modal-btn" onClick={onClose}>
            {copy.acknowledgement}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
