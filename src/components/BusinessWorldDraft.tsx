// Staff-only draft of the Business World front page, revised for a public
// reader. Replaces BusinessWorld (and /mats) once approved. Kei's own words —
// keep verbatim.
const services = [
  "Strategy and digital transformation for businesses",
  "Sponsorship and talent deal negotiation",
  "Websites and tools for small creative brands",
];

export default function BusinessWorldDraft() {
  return (
    <div className="space-y-10">
      <div className="space-y-4 text-[var(--muted)] leading-relaxed">
        <p>
          The Business World is where the House of Kei works with external parties &amp;
          partners. We lend the skills of the House&apos;s worlds to help your brand or business grow, and what we earn goes back
          into the creative work the House makes.
        </p>
        <p>For now, that work happens through MATS.</p>
      </div>

      <div className="space-y-4 border-t border-[var(--border)] pt-10">
        <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">MATS</h2>
        <div className="space-y-4 text-[var(--muted)] leading-relaxed">
          <p>MATS builds meaningful projects for others. Right now, that means:</p>
          <ul className="space-y-2 pl-5 list-disc marker:text-[var(--border)]">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
          <p>
            MATS works best with local creative brands that have a specific need. Whatever the
            project, the goal is the same: to lift up someone else&apos;s work.
          </p>
          <p>
            Every engagement starts with a mock-up, a picture of where you could go, built around
            where you are today. From there, we plan the transformation together.
          </p>
          <p>
            Payment is an equal exchange, and it can take many forms: money, merchandise,
            intellectual property, opportunities, or something else entirely.
          </p>
        </div>
      </div>
    </div>
  );
}
