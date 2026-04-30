export type ProjectFile = {
  label: string;
  url: string;
  thumb?: string;
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  files?: ProjectFile[];
  year: number;
};

// Add your projects here
export const projects: Project[] = [
  {
    title: "Netflix Mood Engine",
    description: "A UX prototype for a mood-based content discovery feature on Netflix. Select how you're feeling and get a personalized watch session — with a simulated AI loading flow and curated picks. Built for MOR-499.",
    tags: ["UX Design", "Prototype", "HTML/CSS", "JavaScript"],
    year: 2026,
    files: [
      { label: "Prototype", url: "/netflix-mood-meter.html", thumb: "/mor-499-prototype.png" },
      { label: "PRD", url: "/mor-499-prd.pdf", thumb: "/mor-499-prd.png" },
      { label: "Lean Canvas", url: "/mor-499-lean-canvas.pdf", thumb: "/mor-499-lean-canvas.png" },
      { label: "User Stories", url: "/mor-499-user-stories.pdf", thumb: "/mor-499-user-stories.png" },
    ],
  },
  {
    title: "Personal Website",
    description: "This site — a minimal personal website built with Next.js and TypeScript.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    year: 2026,
  },
];
