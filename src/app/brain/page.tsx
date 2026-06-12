import BrainGraph from "@/components/BrainGraph";

export default function Brain() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">second brain</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          concepts and connections from my conversations — hover a node to see how ideas link.
        </p>
      </div>
      <div
        className="w-full rounded-lg overflow-hidden border border-[var(--border)]"
        style={{ height: "70vh", background: "#0a0a0a" }}
      >
        <BrainGraph />
      </div>
    </section>
  );
}
