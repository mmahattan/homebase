import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ThemeProvider from "@/components/ThemeProvider";
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
      <head>
        {/* Runs before paint to avoid flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'auto';var dark=t==='dark'||(t==='auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',dark?'dark':'light');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="max-w-2xl mx-auto px-6">
            <Nav />
            <main>{children}</main>
            <footer className="mt-24 pb-12 text-xs text-[var(--muted)]">
              © {new Date().getFullYear()}
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
