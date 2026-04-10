import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <p className="text-lg text-[var(--muted)] leading-relaxed max-w-lg">
          hi, i&apos;m M. welcome to my Imagination Station. currently building{" "}
          <Link href="/projects" className="text-black underline underline-offset-4">
            projects here
          </Link>
          . in the meantime, check out my{" "}
          <Link href="/about" className="text-black underline underline-offset-4">
            journey
          </Link>{" "}
          and see what i&apos;m currently{" "}
          <Link href="/passions" className="text-black underline underline-offset-4">
            bumpin&apos;
          </Link>
          . cheers
        </p>
      </div>
    </section>
  );
}
