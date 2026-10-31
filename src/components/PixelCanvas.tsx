"use client";

import { useEffect, useRef } from "react";

// A small canvas drawn once at native resolution, scaled up with crisp pixels.
export default function PixelCanvas({
  width,
  height,
  draw,
  label,
  className = "",
}: {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    draw(ctx);
  }, [draw, width, height]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
