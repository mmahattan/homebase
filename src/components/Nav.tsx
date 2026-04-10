"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Chronicle" },
  { href: "/projects", label: "projects" },
  { href: "/passions", label: "Lately's" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between py-8 mb-16">
      <Link href="/" className="text-sm tracking-widest uppercase font-medium">
        M.
      </Link>
      <ul className="flex gap-8">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`text-sm tracking-wide transition-colors ${
                pathname === href
                  ? "text-black"
                  : "text-[var(--muted)] hover:text-black"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
