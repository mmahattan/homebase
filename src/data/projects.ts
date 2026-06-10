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
    title: "Multilingual Speech to Text Agent",
    description:
      "A multilingual chatbot that transcribes spoken input via OpenAI's Whisper and routes responses through IBM's WatsonX Runtime. Uses embedded keywords as a semantic foundation for intent matching, enabling natural voice-driven conversation across multiple languages.",
    tags: ["Python", "OpenAI Whisper", "IBM WatsonX", "Speech-to-Text", "NLP"],
    url: "https://github.com/mmahattan/multilingual-ai-chatbot",
    year: 2026,
    files: [
      { label: "UI", url: "/chatbot-1.png", thumb: "/chatbot-1.png" },
      { label: "English Demo", url: "/chatbot-2.png", thumb: "/chatbot-2.png" },
      { label: "Thai Input", url: "/chatbot-3.png", thumb: "/chatbot-3.png" },
      { label: "Thai Voice", url: "/chatbot-4.png", thumb: "/chatbot-4.png" },
    ],
  },
  {
    title: "Going Global: Starlink to India",
    description:
      "A consulting report for MOR-492, a Global Strategy course, advising Starlink on its market entry into India. Analyzes the regional competitive landscape, regulatory environment, and infrastructure opportunities to build a strategic recommendation for expansion into one of the world's fastest-growing connectivity markets.",
    tags: ["Consulting", "Global Strategy", "Market Entry", "Research"],
    year: 2026,
    files: [
      { label: "Report", url: "/starlink-india.pdf" },
    ],
  },
  {
    title: "Netflix Mood Engine",
    description: "A UX prototype for a mood-based content discovery feature on Netflix. Select how you're feeling and get a personalized watch session — with a simulated AI loading flow and curated picks. Built for MOR-499, a Product Management course.",
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
