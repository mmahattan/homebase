import { projects } from "@/data/projects";
import ProjectList from "@/components/ProjectList";

export default function Projects() {
  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-normal tracking-tight">Projects</h1>
      <ProjectList projects={projects.filter((p) => p.published)} />
    </section>
  );
}
