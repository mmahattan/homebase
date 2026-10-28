import type { Metadata } from "next";
import BusinessWorld from "@/components/BusinessWorld";

export const metadata: Metadata = {
  title: "The Business World · Kei",
  description: "MATS — the commercial track of House of Kei.",
};

export default function Mats() {
  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-normal tracking-tight">The Business World</h1>
      <BusinessWorld />
    </section>
  );
}
