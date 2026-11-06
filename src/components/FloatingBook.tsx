import { CSSProperties, ReactNode } from "react";
import { BOOK_D, BOOK_FACES, BOOK_H, BOOK_POS, BOOK_W, Px, ROOM_H, ROOM_W } from "@/lib/pixelScenes";

// The MATS book as a real 3D object: six pixel-art faces assembled into a
// box that slowly turns, tilted forward a little so the page tops show.
// Sized in room pixels via container units, so the parent must set
// `container-type: inline-size` (1 room pixel = 100cqw / 128).

const u = (n: number) => `calc(${n} * 100cqw / ${ROOM_W})`;

function Face({ w, h, transform, px }: { w: number; h: number; transform: string; px: Px[] }) {
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: u(w),
        height: u(h),
        marginLeft: u(-w / 2),
        marginTop: u(-h / 2),
        transform,
        backfaceVisibility: "hidden",
      }}
    >
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none" shapeRendering="crispEdges">
        {px.map(([x, y, pw, ph, color], i) => (
          <rect key={i} x={x} y={y} width={pw} height={ph} fill={color} />
        ))}
      </svg>
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

export default function FloatingBook({ className = "" }: { className?: string }) {
  const cx = BOOK_POS.x + BOOK_W / 2;
  const cy = BOOK_POS.y + BOOK_H / 2;
  const half = (n: number) => u(n / 2);
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        perspective: u(260),
        perspectiveOrigin: `${(cx / ROOM_W) * 100}% ${(cy / ROOM_H) * 100}%`,
      }}
      aria-hidden
    >
      <Stage style={{ left: `${(cx / ROOM_W) * 100}%`, top: `${(cy / ROOM_H) * 100}%` }}>
        <div className="book3d-bob" style={{ transformStyle: "preserve-3d", transform: "rotateX(-12deg)" }}>
          <div className="book3d-turn" style={{ transformStyle: "preserve-3d" }}>
            <Face w={BOOK_W} h={BOOK_H} px={BOOK_FACES.front} transform={`translateZ(${half(BOOK_D)})`} />
            <Face w={BOOK_W} h={BOOK_H} px={BOOK_FACES.back} transform={`rotateY(180deg) translateZ(${half(BOOK_D)})`} />
            <Face w={BOOK_D} h={BOOK_H} px={BOOK_FACES.spine} transform={`rotateY(-90deg) translateZ(${half(BOOK_W)})`} />
            <Face w={BOOK_D} h={BOOK_H} px={BOOK_FACES.pages} transform={`rotateY(90deg) translateZ(${half(BOOK_W)})`} />
            <Face w={BOOK_W} h={BOOK_D} px={BOOK_FACES.top} transform={`rotateX(90deg) translateZ(${half(BOOK_H)})`} />
            <Face w={BOOK_W} h={BOOK_D} px={BOOK_FACES.top} transform={`rotateX(-90deg) translateZ(${half(BOOK_H)})`} />
          </div>
        </div>
      </Stage>
    </div>
  );
}
