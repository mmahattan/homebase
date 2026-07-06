import type { Metadata } from "next";
import StartForm from "@/components/StartForm";

export const metadata: Metadata = {
  title: "AI Front Desk · Kei",
  description:
    "Done-for-you AI assistants for Bangkok businesses on LINE, Instagram, and your website.",
};

const steps = [
  {
    n: "01",
    title: "Tell me about your business",
    body: "A 20-minute call to understand your customers, your FAQs, and where they reach you.",
  },
  {
    n: "02",
    title: "I build & train it",
    body: "I set up the assistant, connect it to your channel, and train it on your content. Takes about 2 weeks.",
  },
  {
    n: "03",
    title: "It answers for you 24/7",
    body: "Your AI handles routine questions around the clock. You only step in when it hands off a complex case.",
  },
];

export default function Start() {
  return (
    <section className="space-y-16">
      {/* Hero */}
      <div className="space-y-6">
        <h1 className="text-3xl font-normal tracking-tight leading-snug">
          Your customers are messaging after hours.
          <br />
          Let an AI answer them.
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-lg">
          I build AI assistants for Bangkok businesses that reply instantly on LINE, Instagram,
          and your website — in Thai and English. Set up in 2 weeks.
        </p>
        <a
          href="#form"
          className="inline-flex items-center gap-2 border border-[var(--border)] rounded px-5 py-3 text-sm hover:border-[var(--muted)] transition-colors"
        >
          See if it fits your business ↓
        </a>
      </div>

      {/* How it works */}
      <div className="space-y-8 border-t border-[var(--border)] pt-10">
        <h2 className="text-2xl font-normal tracking-tight">How it works</h2>
        <ol className="space-y-8">
          {steps.map(({ n, title, body }) => (
            <li key={n} className="flex gap-6">
              <span className="text-xs text-[var(--muted)] pt-0.5 shrink-0 w-6 tabular-nums">
                {n}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Offer */}
      <div className="space-y-6 border-t border-[var(--border)] pt-10">
        <h2 className="text-2xl font-normal tracking-tight">The offer</h2>
        <div className="border border-[var(--border)] rounded p-6 space-y-4">
          <p className="font-medium">AI front desk for your business</p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Done-for-you AI assistant on LINE, Instagram, or your website. Replies instantly
            in Thai and English, 24/7.
          </p>
          <div className="space-y-1 pt-1">
            <p className="text-sm">
              From <span className="text-[var(--foreground)]">5,000 THB</span> to set up
            </p>
            <p className="text-sm text-[var(--muted)]">+ 1,500 THB / month to keep running</p>
          </div>
          <p className="text-xs text-[var(--muted)] border-t border-[var(--border)] pt-4">
            First 2 clients get a founding discount in exchange for a testimonial and case study.
          </p>
        </div>
      </div>

      {/* Proof */}
      <div className="space-y-6 border-t border-[var(--border)] pt-10">
        <h2 className="text-2xl font-normal tracking-tight">Why me</h2>
        <blockquote className="border-l-2 border-[var(--border)] pl-5 space-y-2">
          <p className="text-sm text-[var(--muted)] italic leading-relaxed">
            &ldquo;[ Replace with first client testimonial ]&rdquo;
          </p>
          <footer className="text-xs text-[var(--muted)]">— Business name, Bangkok</footer>
        </blockquote>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          USC Marshall · AI Applications minor · builds AI agents at IBM · bilingual Thai / English
        </p>
      </div>

      {/* Form */}
      <StartForm />
    </section>
  );
}
