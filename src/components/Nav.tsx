"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { usePrivateSpace } from "./PrivateSpace";

const links = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "chronicle" },
  { href: "/passions", label: "lately" },
  { href: "/brain", label: "brain" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPrivate, goTo } = usePrivateSpace();

  // While in the private working space, every nav link stays inside it —
  // eject is the only way out.
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isPrivate) return;
    e.preventDefault();
    if (pathname !== "/m") router.push("/m");
    goTo("concierge");
  }

  return (
    <nav className="flex items-center justify-between py-8 mb-16">
      <Link href="/" onClick={handleNavClick} className="text-sm tracking-widest uppercase font-medium">
        M.
      </Link>
      <div className="flex items-center gap-8">
        <ul className="flex gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={handleNavClick}
                className={`text-sm tracking-wide transition-colors ${
                  pathname === href
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
}
