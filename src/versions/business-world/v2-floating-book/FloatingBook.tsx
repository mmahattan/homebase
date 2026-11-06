// FROZEN: Business World v2 (floating book), saved Nov 5, 2026. Don't edit;
// improve the live components instead.

import { CSSProperties, ReactNode } from "react";
import { BOOK_D, BOOK_FACES, BOOK_H, BOOK_POS, BOOK_W, Px, ROOM_H, ROOM_W } from "./scenes";

// The MATS book as a real 3D object: six pixel-art faces assembled into a
// box that slowly turns, tilted forward a little so the page tops show.
// Sized in scene pixels via container units, so the parent must set
// `container-type: inline-size` (1 scene pixel = 100cqw / sceneW).
// Used in the room (the default scene) and in the dollhouse, where the room
// sits at `origin` inside the house.

export function PixelFace({ px, w, h }: { px: Px[]; w: number; h: number }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none" shapeRendering="crispEdges">
      {px.map(([x, y, pw, ph, color], i) => (
        <rect key={i} x={x} y={y} width={pw} height={ph} fill={color} />
      ))}
    </svg>
  );
}

function Face({ w, h, transform, px, u }: { w: number; h: number; transform: string; px: Px[]; u: (n: number) => string }) {
  return (
    <div
      className="absolute left-0 top-0"
      style={{ width: u(w), height: u(h), marginLeft: u(-w / 2), marginTop: u(-h / 2), transform, backfaceVisibility: "hidden" }}
    >
      <PixelFace px={px} w={w} h={h} />
    </div>
  );
}

function Stage({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return (
    <div className="absolute" style={{ ...style, width: 0, height: 0, transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

export default function FloatingBook({
  className = "",
  sceneW = ROOM_W,
  sceneH = ROOM_H,
  origin = { x: 0, y: 0 },
  aura = false,
}: {
  className?: string;
  sceneW?: number;
  sceneH?: number;
  origin?: { x: number; y: number };
  aura?: boolean;
}) {
  const u = (n: number) => `calc(${n} * 100cqw / ${sceneW})`;
  const cx = origin.x + BOOK_POS.x + BOOK_W / 2;
  const cy = origin.y + BOOK_POS.y + BOOK_H / 2;
  const at = { left: `${(cx / sceneW) * 100}%`, top: `${(cy / sceneH) * 100}%` };

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ perspective: u(260), perspectiveOrigin: `${at.left} ${at.top}` }}
      aria-hidden
    >
      {aura && (
        <div
          className="absolute v2-aura-pulse rounded-full"
          style={{
            ...at,
            width: u(34),
            height: u(34),
            marginLeft: u(-17),
            marginTop: u(-17),
            background: "radial-gradient(circle, rgba(255,214,120,0.6), rgba(185,162,255,0.25) 45%, transparent 70%)",
          }}
        />
      )}
      <Stage style={at}>
        <div
          className="v2-book3d-bob"
          style={{ transformStyle: "preserve-3d", transform: "rotateX(-12deg)", ["--bob" as string]: u(-1.5) }}
        >
          <div className="v2-book3d-turn" style={{ transformStyle: "preserve-3d" }}>
            <Face u={u} w={BOOK_W} h={BOOK_H} px={BOOK_FACES.front} transform={`translateZ(${u(BOOK_D / 2)})`} />
            <Face u={u} w={BOOK_W} h={BOOK_H} px={BOOK_FACES.back} transform={`rotateY(180deg) translateZ(${u(BOOK_D / 2)})`} />
            <Face u={u} w={BOOK_D} h={BOOK_H} px={BOOK_FACES.spine} transform={`rotateY(-90deg) translateZ(${u(BOOK_W / 2)})`} />
            <Face u={u} w={BOOK_D} h={BOOK_H} px={BOOK_FACES.pages} transform={`rotateY(90deg) translateZ(${u(BOOK_W / 2)})`} />
            <Face u={u} w={BOOK_W} h={BOOK_D} px={BOOK_FACES.top} transform={`rotateX(90deg) translateZ(${u(BOOK_H / 2)})`} />
            <Face u={u} w={BOOK_W} h={BOOK_D} px={BOOK_FACES.top} transform={`rotateX(-90deg) translateZ(${u(BOOK_H / 2)})`} />
          </div>
        </div>
      </Stage>
    </div>
  );
}
