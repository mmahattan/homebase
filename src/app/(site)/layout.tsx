import Nav from "@/components/Nav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto px-6">
      <Nav />
      <main>{children}</main>
      <footer className="mt-24 pb-12 text-xs text-[var(--muted)]">
        © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
