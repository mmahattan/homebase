import { passions } from "@/data/passions";
import SpotifySection from "@/components/SpotifySection";

export default function Passions() {
  return (
    <section className="space-y-12">
      <h1 className="text-2xl font-normal tracking-tight">Lately&apos;s</h1>

      {passions.map((category) => (
        <div key={category.slug} className="space-y-6">
          <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">
            {category.label}
          </h2>

          {category.slug === "music" ? (
            <div className="space-y-8">
              <SpotifySection />
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">collage</p>
                <div className="grid grid-cols-1 gap-4">
                  <img
                    src="/bill-clinton-albums-1.png"
                    alt="collage 1"
                    className="w-full rounded-md"
                  />
                </div>
              </div>
            </div>
          ) : (
            <ul className="space-y-6">
              {category.items.map((item) => (
                <li key={item.title} className="border-t border-[var(--border)] pt-5 space-y-1">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-sm hover:underline underline-offset-4"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <p className="font-medium text-sm">{item.title}</p>
                  )}
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
