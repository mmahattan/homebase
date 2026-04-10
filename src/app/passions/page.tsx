import { passions } from "@/data/passions";

export default function Passions() {
  return (
    <section className="space-y-12">
      <h1 className="text-2xl font-normal tracking-tight">Lately&apos;s</h1>

      {passions.map((category) => (
        <div key={category.slug} className="space-y-6">
          <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">
            {category.label}
          </h2>
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
        </div>
      ))}
    </section>
  );
}
