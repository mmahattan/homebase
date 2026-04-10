export type Project = {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  year: number;
};

// Add your projects here
export const projects: Project[] = [
  {
    title: "Personal Website",
    description: "This site — a minimal personal website built with Next.js and TypeScript.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    year: 2026,
  },
];
