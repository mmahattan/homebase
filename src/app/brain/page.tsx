import BrainGraph from "@/components/BrainGraph";

export default function Brain() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">second brain</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          concepts and connections from my conversations — hover a node to see how ideas link.
        </p>
      </div>
      <div
        style={{
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "calc(100vh - 13rem)",
          background: "#0a0a0a",
        }}
      >
        <BrainGraph />
      </div>
    </section>
  );
}
