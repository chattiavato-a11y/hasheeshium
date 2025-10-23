import { FormEvent, useState } from 'react';
import ServicePage from '../components/ServicePage';
import { sendToWorker } from '../lib/cfWorkerClient';

const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const ContactUsPage = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setStatus('submitting');
    setFeedback('');
    setWarnings([]);

    try {
      const response = await sendToWorker({
        endpoint,
        payload: {
          name: formData.get('name')?.toString() ?? '',
          email: formData.get('email')?.toString() ?? '',
          organization: formData.get('organization')?.toString() ?? '',
          interest: formData.get('interest')?.toString() ?? '',
          message: formData.get('message')?.toString() ?? ''
        }
      });

      setWarnings(response.warnings ?? []);
      setStatus(response.ok ? 'success' : 'error');
      setFeedback(
        response.ok
          ? response.message ?? 'Secure submission received. Our team will respond within one business day.'
          : 'Unable to complete secure submission. Please verify connectivity and retry.'
      );
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus('error');
      setFeedback('Unexpected issue while transmitting your request. Try again later or use Chattia.');
    }
  };

  return (
    <div>
      <ServicePage
        title="Contact Ops Online Support"
        description="Reach the OPS CySec Core team for consultations, demos, or partnership explorations."
        heroCopy="Engage our secure communications desk to explore services, request demos, or align on partnership models. All submissions are sanitized, encrypted, and logged for compliance traceability."
        eyebrow="OPS CySec Core | Secure Contact"
        heroHighlights={[
          'Data sanitized against injection prior to transit',
          'AES-256 encrypted at rest with audit-grade logging',
          'Response SLAs aligned to mission-critical requests'
        ]}
        sections={[]}
      />
      <div className="container content-section">
        <article className="content-card">
          <h2>Contact form</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label htmlFor="name">
              Name
              <input id="name" name="name" type="text" required maxLength={120} autoComplete="name" />
            </label>
            <label htmlFor="email">
              Work email
              <input id="email" name="email" type="email" required autoComplete="email" />
            </label>
            <label htmlFor="organization">
              Organization
              <input id="organization" name="organization" type="text" maxLength={160} placeholder="OPS Online Support" />
            </label>
            <label htmlFor="interest">
              Area of interest
              <select id="interest" name="interest" defaultValue="Operations">
                <option>Operations</option>
                <option>Contact Center</option>
                <option>IT Support</option>
                <option>Professionals Guild</option>
                <option>Chattia Concierge</option>
              </select>
            </label>
            <label htmlFor="message">
              Message
              <textarea id="message" name="message" rows={5} maxLength={1200} required />
            </label>
            <div>
              <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Transmitting…' : 'Submit request'}
              </button>
            </div>
          </form>
          {feedback ? <p className="alert" role="status">{feedback}</p> : null}
          {warnings.length > 0 ? (
            <div className="alert alert-stack" role="status">
              <strong>Sanitization notices:</strong>
              <ul>
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
};

export default ContactUsPage;
