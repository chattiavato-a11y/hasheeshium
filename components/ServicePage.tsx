type Section = {
  title: string;
  body: string;
  bullets?: string[];
};

type Props = {
  title: string;
  description?: string;
  heroCopy?: string;
  eyebrow?: string;
  heroHighlights?: string[];
  sections?: Section[];
};

export default function ServicePage({
  title,
  description,
  heroCopy,
  eyebrow,
  heroHighlights = [],
  sections = []
}: Props) {
  return (
    <main
      style={{
        paddingTop: 'var(--space-7)',
        paddingBottom: 'var(--space-7)',
        width: 'min(100% - 2 * var(--space-6), var(--max-content-width))',
        margin: '0 auto'
      }}
    >
      <header>
        {eyebrow && <div className="badge">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {heroCopy && <p>{heroCopy}</p>}
        {heroHighlights.length > 0 && (
          <ul>
            {heroHighlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </header>

      {sections.map((s, idx) => (
        <section key={idx} style={{ marginTop: 'var(--space-7)' }}>
          <h2>{s.title}</h2>
          <p>{s.body}</p>
          {s.bullets && s.bullets.length > 0 && (
            <ul>
              {s.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
