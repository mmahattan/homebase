// 16×13 pixel folder. Outline follows the theme's foreground; fill/shade are per-folder.
const outline: [number, number, number, number][] = [
  [1, 0, 5, 1],
  [0, 1, 1, 11],
  [6, 1, 1, 1],
  [7, 2, 8, 1],
  [15, 3, 1, 9],
  [1, 12, 14, 1],
];
const fill: [number, number, number, number][] = [
  [1, 1, 5, 1],
  [1, 2, 6, 1],
  [1, 3, 14, 9],
];
const shade: [number, number, number, number][] = [
  [1, 4, 14, 1],
  [1, 11, 14, 1],
];

export type FolderColor = { fill: string; shade: string };

export default function PixelFolder({
  label,
  color,
  size = "sm",
  delay = 0,
  className = "",
  onClick,
}: {
  label: string;
  color: FolderColor;
  size?: "sm" | "lg";
  delay?: number;
  className?: string;
  onClick: () => void;
}) {
  const px = size === "lg" ? 8 : 4;
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`pixel-folder group flex flex-col items-center gap-3 ${className}`}
    >
      <svg
        width={16 * px}
        height={13 * px}
        viewBox="0 0 16 13"
        shapeRendering="crispEdges"
        aria-hidden
      >
        {fill.map(([x, y, w, h], i) => (
          <rect key={`f${i}`} x={x} y={y} width={w} height={h} fill={color.fill} />
        ))}
        {shade.map(([x, y, w, h], i) => (
          <rect key={`s${i}`} x={x} y={y} width={w} height={h} fill={color.shade} />
        ))}
        {outline.map(([x, y, w, h], i) => (
          <rect key={`o${i}`} x={x} y={y} width={w} height={h} fill="var(--foreground)" />
        ))}
      </svg>
      <span
        className={`pixel-font leading-relaxed text-center text-[var(--muted)] group-hover:text-[var(--foreground)] ${
          size === "lg" ? "text-xs" : "text-[8px] max-w-[7.5rem]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
