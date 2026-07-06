"use client";

import { useState } from "react";

// Sign up at formspree.io and replace this with your real form ID
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_MY_FORM_ID";

type Status = "idle" | "loading" | "success" | "error";

export default function StartForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div id="form" className="space-y-6 border-t border-[var(--border)] pt-10">
      <h2 className="text-2xl font-normal tracking-tight">See if it fits</h2>

      {status === "success" ? (
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Thanks — I&apos;ll reach out within 24 hours to set up a quick call.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <Field label="Your name" name="name" required />
            <Field label="Business name" name="business" required />

            <div className="space-y-1">
              <label className="text-xs text-[var(--muted)] block">
                Channel customers use most
              </label>
              <select
                name="channel"
                className="w-full bg-transparent border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--muted)] transition-colors"
              >
                <option value="LINE">LINE</option>
                <option value="Instagram">Instagram</option>
                <option value="Website">Website</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[var(--muted)] block">
                Biggest repetitive question your team answers all day
              </label>
              <textarea
                name="topQuestion"
                rows={3}
                placeholder='e.g. "Do you deliver to Sukhumvit?"'
                className="w-full bg-transparent border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--muted)] transition-colors resize-none"
              />
            </div>

            <Field
              label="Best way to reach you (LINE ID / email / phone)"
              name="contact"
              required
            />
          </div>

          {status === "error" && (
            <p className="text-xs text-[var(--muted)]">
              Something went wrong — try again or email me directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="border border-[var(--border)] rounded px-5 py-3 text-sm hover:border-[var(--muted)] transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Send →"}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs text-[var(--muted)] block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        className="w-full bg-transparent border-b border-[var(--border)] pb-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--muted)] transition-colors"
      />
    </div>
  );
}
