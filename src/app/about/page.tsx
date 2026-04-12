export default function About() {
  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-normal tracking-tight">Chronicle</h1>

      <div className="space-y-4 text-[var(--muted)] leading-relaxed">
        <p>
          I find new ways to explore my creativity and fulfill my curiosity.
          Currently studying business admin at USC Marshall with a minor in AI
          Applications. As it stands, I am returning to IBM as an intern for
          Summer 2026.
        </p>
        <p>
          Below is my most recent resume and a timeline of where I&apos;ve been.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--muted)] uppercase tracking-widest">Resume</span>
          <a
            href="/resume.pdf"
            download
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors underline underline-offset-4"
          >
            download
          </a>
        </div>
        <iframe
          src="/resume.pdf"
          className="w-full border border-[var(--border)] rounded"
          style={{ height: "780px" }}
          title="Mats Mahattanakul Resume"
        />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-8 text-sm">
      <span className="w-24 shrink-0 text-[var(--muted)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
