export type PassionItem = {
  title: string;
  description: string;
  url?: string;
};

export type PassionCategory = {
  slug: string;
  label: string;
  items: PassionItem[];
};

// Add new categories or items here freely
export const passions: PassionCategory[] = [
  {
    slug: "fashion",
    label: "Fashion",
    items: [
      {
        title: "Example piece",
        description: "Something I've been inspired by or wearing lately.",
      },
    ],
  },
  {
    slug: "music",
    label: "Music",
    items: [
      {
        title: "Example artist",
        description: "What I'm listening to or artists I love.",
      },
    ],
  },
  {
    slug: "sports",
    label: "Sports",
    items: [
      {
        title: "Example sport",
        description: "Sports I follow or play.",
      },
    ],
  },
];
