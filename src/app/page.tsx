import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-normal tracking-tight">Hello.</h1>
        <p className="text-lg text-[var(--muted)] leading-relaxed max-w-lg">
          I'm M. — this is my corner of the internet. Browse my{" "}
          <Link href="/projects" className="text-black underline underline-offset-4">
            projects
          </Link>
          , learn a bit{" "}
          <Link href="/about" className="text-black underline underline-offset-4">
            about me
          </Link>
          , or see what I'm{" "}
          <Link href="/passions" className="text-black underline underline-offset-4">
            into
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
