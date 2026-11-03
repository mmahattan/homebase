import { CSSProperties } from "react";

// A pixel speech bubble that marks something clickable in a scene. Before the
// first visit it bounces and says "click me"; afterwards it rests, grayed out,
// showing the space's name. The bubble's tail sits at its bottom-left corner,
// so position it with `style` so the tail points at the hotspot.
export default function HotspotTag({
  name,
  visited,
  onClick,
  style,
}: {
  name: string;
  visited: boolean;
  onClick: () => void;
  style: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Open ${name}`}
      style={style}
      className={`absolute -translate-y-full ${visited ? "" : "hotspot-bounce"}`}
    >
      <span
        className={`pixel-font block whitespace-nowrap border-2 px-2 py-1 text-[9px] ${
          visited
            ? "bg-[#8d867d] border-[#5c5650] text-[#e6e1d8] hover:bg-[#a29a90]"
            : "bg-[#2b1d16] border-[#2b1d16] text-[#f4efe2] hover:bg-[#4a3226]"
        }`}
      >
        {visited ? name : "click me"}
      </span>
      {/* Stepped pixel tail */}
      <span aria-hidden className={`block ml-2 h-1.5 w-2 ${visited ? "bg-[#5c5650]" : "bg-[#2b1d16]"}`} />
      <span aria-hidden className={`block ml-2 h-1.5 w-1 ${visited ? "bg-[#5c5650]" : "bg-[#2b1d16]"}`} />
    </button>
  );
}
