// Visual placeholders for the future multi-specialty interface. These are not
// registered specialties: no routes, topics or counts exist for them.
const upcoming = [
  'ENT',
  'Urology',
  'Trauma & Orthopaedics',
  'Vascular Surgery',
] as const;

export function UpcomingSpecialties({
  headingLevel: Heading = 'h2',
}: {
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <section aria-labelledby="upcoming-heading" className="upcoming">
      <Heading id="upcoming-heading" className="eyebrow">
        Coming later · not yet available
      </Heading>
      <ul className="upcoming-grid">
        {upcoming.map((title) => (
          <li key={title}>
            <span className="font-medium">{title}</span>
            <span className="upcoming-tag">
              Coming later
              <span className="sr-only"> — no content available yet</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
