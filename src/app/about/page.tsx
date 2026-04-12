import ChronicleView from "@/components/ChronicleView";

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

      <ChronicleView />
    </section>
  );
}
