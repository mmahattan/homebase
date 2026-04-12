export default function About() {
  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-normal tracking-tight">Chronicle</h1>

      <div className="space-y-4 text-[var(--muted)] leading-relaxed">
        <p>
          I find new ways to explore my creativity and fulfill my curiosity.
          Currently a third-year studying business admin at USC Marshall with a
          minor in AI Applications. As it stands, I am returning to IBM as an intern for
          Summer 2026.
        </p>
        <p>
          Below is my most recent resume and a timeline of where I&apos;ve been.
        </p>
      </div>

      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 w-fit border border-[var(--border)] rounded px-4 py-3 hover:border-[var(--muted)] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] shrink-0">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="text-sm text-[var(--muted)]">Mats Resume SPRING 26.pdf</span>
      </a>

      {/* Timeline */}
      <div className="space-y-6 pt-4">
        <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">Timeline</h2>

        <div className="space-y-0">
          <TimelineEntry
            years="2014 – 2023"
            title="International School Bangkok (ISB)"
            subtitle="Bangkok, Thailand"
            tag="education"
            details={[
              "Varsity Swim Team (2019 – 2023) · Captain from 2021",
              "Varsity Orchestra Strings (2019 – 2023) · Captain from 2021",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({
  years,
  title,
  subtitle,
  tag,
  details,
}: {
  years: string;
  title: string;
  subtitle: string;
  tag: string;
  details?: string[];
}) {
  return (
    <div className="flex gap-6 border-t border-[var(--border)] py-5">
      <span className="w-28 shrink-0 text-xs text-[var(--muted)] pt-0.5">{years}</span>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-[var(--muted)]">{subtitle}</p>
        {details && (
          <ul className="pt-1 space-y-0.5">
            {details.map((d) => (
              <li key={d} className="text-xs text-[var(--muted)]">{d}</li>
            ))}
          </ul>
        )}
        <span className="inline-block text-xs text-[var(--muted)] border border-[var(--border)] rounded-full px-2 py-0.5 mt-1">
          {tag}
        </span>
      </div>
    </div>
  );
}
