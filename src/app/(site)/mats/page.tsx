import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Business World · Kei",
  description: "MATS — the commercial track of House of Kei.",
};

const services = [
  {
    title: "AI Front Desk",
    description:
      "Done-for-you AI assistants for Bangkok businesses on LINE, Instagram, and your website.",
    href: "/start",
  },
];

export default function Mats() {
  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-normal tracking-tight">The Business World</h1>

      <div className="space-y-4 text-[var(--muted)] leading-relaxed">
        <p>
          The Business World is the room that houses business engagements between the House
          of Kei and external parties. The aim of this world is to acquire funds that are used
          to fuel the creative endeavors created by the House. Funds are obtained in exchange
          for the services of one (or more) of the House&apos;s worlds, where we lend our
          services to elevate the business need(s) of the customer.
        </p>
        <p>As it stands, the House only offers services provided through MATS.</p>
      </div>

      <div className="space-y-4 border-t border-[var(--border)] pt-10">
        <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">MATS</h2>
        <div className="space-y-4 text-[var(--muted)] leading-relaxed">
          <p>
            MATS builds meaningful projects for others. Currently offered through the lens of
            strategy and digital transformation for business organizations, sponsorship
            negotiations for talent deals, and the ability to build websites and tools for
            small creative brands.
          </p>
          <p>
            Currently directed at local creative brands with a specific need. The uniting
            factor in the services is uplifting and elevating another&apos;s work. By leading
            with a mock-up, MATS will match the needs of the client where they currently are
            sitting at, and aims to plan out a transformation journey alongside the client
            based on their needs. A transaction is deemed as an equivalent exchange between
            all parties; capital funds, tangible merchandise, intellectual property,
            opportunities, or any of the sort.
          </p>
        </div>
      </div>

      <div className="space-y-6 border-t border-[var(--border)] pt-10">
        <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">Services</h2>
        <ul className="space-y-6">
          {services.map((service) => (
            <li key={service.title} className="border-t border-[var(--border)] pt-5 space-y-1">
              <a
                href={service.href}
                className="font-medium text-sm hover:underline underline-offset-4"
              >
                {service.title}
              </a>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {service.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
