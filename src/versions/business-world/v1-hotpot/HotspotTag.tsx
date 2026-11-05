// FROZEN: Business World v1 (hotpot), saved Nov 5, 2026. Don't edit;
// improve src/components/BusinessWorldRoom.tsx instead.

import { CSSProperties } from "react";

// A bouncing pixel "click me" bubble that marks something clickable in a
// scene, shown until the visitor has opened it once. The bubble's tail sits at
// its bottom-left corner, so position it with `style` so the tail points at
// the hotspot.
export default function HotspotTag({
  name,
  onClick,
  style,
}: {
  name: string;
  onClick: () => void;
  style: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Open ${name}`}
      style={style}
      className="v1-hotspot-bounce absolute -translate-y-full"
    >
      <span className="v1-pixel-font block whitespace-nowrap border-2 border-[#2b1d16] bg-[#2b1d16] px-2 py-1 text-[9px] text-[#f4efe2] hover:bg-[#4a3226]">
        click me
      </span>
      {/* Stepped pixel tail */}
      <span aria-hidden className="block ml-2 h-1.5 w-2 bg-[#2b1d16]" />
      <span aria-hidden className="block ml-2 h-1.5 w-1 bg-[#2b1d16]" />
    </button>
  );
}
