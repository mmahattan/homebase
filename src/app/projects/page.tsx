import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-normal tracking-tight">Projects</h1>

      <ul className="space-y-8">
        {projects.map((project) => (
          <li key={project.title} className="border-t border-[var(--border)] pt-6 space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline underline-offset-4"
                >
                  {project.title}
                </a>
              ) : (
                <span className="font-medium">{project.title}</span>
              )}
              <span className="text-xs text-[var(--muted)] shrink-0">{project.year}</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{project.description}</p>
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
