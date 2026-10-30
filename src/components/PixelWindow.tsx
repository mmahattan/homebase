import { ReactNode } from "react";
import { FolderTag, TagLabel } from "@/components/PixelFolder";

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
    <div className="pixel-in border-2 border-[var(--foreground)] shadow-[6px_6px_0_var(--foreground)] bg-[var(--background)]">
      <div className="flex items-center justify-between gap-4 border-b-2 border-[var(--foreground)] px-3 py-2">
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
      <div className="public-look p-5 sm:p-6">{children}</div>
    </div>
  );
}
