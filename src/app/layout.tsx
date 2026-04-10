import type { Metadata } from "next";
import Nav from "@/components/Nav";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "M.",
  description: "Personal website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-2xl mx-auto px-6">
          <Nav />
          <main>{children}</main>
          <footer className="mt-24 pb-12 text-xs text-[var(--muted)]">
            © {new Date().getFullYear()}
          </footer>
        </div>
      </body>
    </html>
  );
}
