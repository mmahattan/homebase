export default function About() {
  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-normal tracking-tight">About</h1>

      <div className="space-y-4 text-[var(--muted)] leading-relaxed">
        {/* Edit this section freely */}
        <p>
          A few lines about who you are — your background, what you do, what
          drives you.
        </p>
        <p>
          Keep it short, keep it honest.
        </p>
      </div>

      {/* Optional: quick facts */}
      <div className="border-t border-[var(--border)] pt-8 space-y-3">
        <Row label="Based in" value="—" />
        <Row label="Working on" value="—" />
        <Row label="Contact" value="—" />
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
