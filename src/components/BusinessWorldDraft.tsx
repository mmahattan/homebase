// Staff-only draft of the Business World front page, revised for a public
// reader. Replaces BusinessWorld (and /mats) once approved. Kei's own words —
// keep verbatim. Look: a modern house with wooden accents (.biz-world in
// globals.css).
// The Business World's definition, shared with the dollhouse dialog.
export const BUSINESS_WORLD_DEFINITION = [
  "The Business World is where the House of Kei works with external parties & partners. We lend the skills of the House's worlds to help your brand or business grow, and what we earn goes back into the creative work the House makes.",
  "For now, that work happens through MATS.",
];

const services = [
  "Strategy and digital transformation for businesses",
  "Sponsorship and talent deal negotiation",
  "Websites and tools for small creative brands",
];

export default function BusinessWorldDraft() {
  return (
    <div className="biz-world rounded-2xl overflow-hidden">
      <div className="biz-wood h-3" aria-hidden />

      <div className="px-6 py-10 sm:px-10 sm:py-14 space-y-14">
        <header className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">The Business World</h1>
          <p className="text-lg leading-relaxed">{BUSINESS_WORLD_DEFINITION[0]}</p>
          <p className="text-[var(--biz-soft)] leading-relaxed">
            For now, that work happens through{" "}
            <span className="font-medium text-[var(--biz-ink)]">MATS</span>.
          </p>
        </header>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-[var(--biz-oak)]">
              MATS
            </h2>
            <span className="biz-wood h-1.5 flex-1 rounded-full" aria-hidden />
          </div>

          <p className="text-lg leading-relaxed">
            MATS builds meaningful projects for others. Right now, that means:
          </p>

          <ul className="grid gap-4 sm:grid-cols-3">
            {services.map((service, i) => (
              <li
                key={service}
                className="flex rounded-xl overflow-hidden bg-[var(--biz-card)]"
              >
                <span className="biz-wood w-1.5 shrink-0" aria-hidden />
                <div className="p-5 space-y-3">
                  <span className="block text-xs font-medium text-[var(--biz-oak)]">
                    0{i + 1}
                  </span>
                  <p className="leading-snug">{service}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-[var(--biz-soft)] leading-relaxed">
            MATS works best with local creative brands that have a specific need. Whatever the
            project, the goal is the same:{" "}
            <span className="text-[var(--biz-ink)]">to lift up someone else&apos;s work.</span>
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <p className="rounded-xl border border-[var(--biz-line)] p-6 leading-relaxed">
              Every engagement starts with a mock-up, a picture of where you could go, built
              around where you are today. From there, we plan the transformation together.
            </p>
            <p className="rounded-xl border border-[var(--biz-line)] p-6 leading-relaxed">
              Payment is an equal exchange, and it can take many forms: money, merchandise,
              intellectual property, opportunities, or something else entirely.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
