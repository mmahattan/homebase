import Nav from "@/components/Nav";

export default function BrainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0a" }}>
      {children}
      {/* Nav floats above the graph, passes through pointer events in empty areas */}
      <div
        className="absolute top-0 left-0 right-0 z-10 max-w-2xl mx-auto px-6"
        style={{ pointerEvents: "none" }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <Nav />
        </div>
      </div>
    </div>
  );
}
