import { ReactNode } from "react";
import { FolderTag, TagLabel } from "@/components/PixelFolder";

// Borderless and wider than the text column: the work itself fills the page,
// up to 72rem, keeping a 1.5rem gutter on each side.
const wide = {
  width: "min(100vw - 3rem, 72rem)",
  marginLeft: "calc(50% - min(50vw - 1.5rem, 36rem))",
};

export default function PixelWindow({
  title,
  tag,
  onClose,
  children,
}: {
  title: string;
  tag?: FolderTag;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="pixel-in space-y-5" style={wide}>
      <div className="flex items-center justify-between gap-4">
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className="pixel-font text-[9px] leading-relaxed">{title}</span>
          {tag && <TagLabel tag={tag} />}
        </span>
        <button
          onClick={onClose}
          aria-label="Close folder"
          className="pixel-font text-[9px] border-2 border-[var(--foreground)] px-1.5 py-0.5 hover:bg-[var(--foreground)] hover:text-[var(--background)]"
        >
          x
        </button>
      </div>
      {/* public-look: the content renders exactly as it does on the public side */}
      <div className="public-look">{children}</div>
    </div>
  );
}
