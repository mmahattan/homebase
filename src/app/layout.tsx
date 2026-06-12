import type { Metadata } from "next";
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'auto';var dark=t==='dark'||(t==='auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',dark?'dark':'light');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
