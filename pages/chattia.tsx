import { FormEvent, useState } from 'react';
import ServicePage from '../components/ServicePage';
import { sendToWorker } from '../lib/cfWorkerClient';

const endpoint = process.env.NEXT_PUBLIC_CHATTIA_ENDPOINT;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const ChattiaPage = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setStatus('submitting');
    setWarnings([]);
    setFeedback('');

    try {
      const response = await sendToWorker({
        endpoint,
        payload: {
          name: formData.get('name')?.toString() ?? '',
          email: formData.get('email')?.toString() ?? '',
          objective: formData.get('objective')?.toString() ?? '',
          narrative: formData.get('narrative')?.toString() ?? ''
        }
      });

      setWarnings(response.warnings ?? []);
      setStatus(response.ok ? 'success' : 'error');
      setFeedback(
        response.ok
          ? response.message ?? 'Secure hand-off initiated. Our Chattia concierge will respond shortly.'
          : 'Unable to connect to Chattia secure worker. Please retry or contact OPS support.'
      );
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus('error');
      setFeedback('Unexpected issue while contacting Chattia. Please verify connectivity and retry.');
    }
  };

  return (
    <div>
      <ServicePage
        title="Chattia Concierge"
        description="Conversational OPS concierge that blends AI copilots with human escalation inside secure channels."
        heroCopy="Reach Chattia for rapid intelligence, escalation, and collaboration. Every request is sanitized, encrypted, and routed through Cloudflare Workers with OPS CySec Core safeguards."
        eyebrow="OPS CySec Core | Chattia"
        heroHighlights={[
          'Payloads sanitized against injection, spoofing, and leakage',
          'Traffic tunneled through hardened Cloudflare Worker endpoints',
          'Ops + Cyber experts on standby for human escalation'
        ]}
        sections={[]}
      />
      <div className="container content-section">
        <article className="content-card">
          <h2>Engage Chattia</h2>
          <p className="muted-copy">
            Provide a concise mission summary. The concierge analyzes telemetry, redacts sensitive data, and orchestrates the right
            specialists without exposing your environment.
          </p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label htmlFor="name">
              Name
              <input id="name" name="name" type="text" required maxLength={120} autoComplete="name" />
            </label>
            <label htmlFor="email">
              Work email
              <input id="email" name="email" type="email" required autoComplete="email" />
            </label>
            <label htmlFor="objective">
              Objective
              <input id="objective" name="objective" type="text" required maxLength={180} placeholder="Stabilize contact center availability" />
            </label>
            <label htmlFor="narrative">
              Secure narrative
              <textarea
                id="narrative"
                name="narrative"
                rows={5}
                maxLength={1000}
                placeholder="Share sanitized context, KPIs, timelines, or urgency signals."
                required
              />
            </label>
            <div>
              <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Transmitting…' : 'Send to Chattia'}
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

export default ChattiaPage;
