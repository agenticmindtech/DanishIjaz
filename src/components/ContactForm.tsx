"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/content/site";
import { categories } from "@/content/projects";

/**
 * Zero-backend contact form.
 *
 * Submitting composes a prefilled email in the visitor's own mail client, so
 * the site works the day it deploys with no API keys, no server, and no
 * third-party service holding anyone's data. To move to a real inbox later,
 * swap `handleSubmit` for a POST to an /api/contact route (Resend, Formspree,
 * etc.) — nothing else here needs to change.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: categories[0].label,
    budget: "",
    message: "",
  });

  const update = (field: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = `New project enquiry — ${form.projectType}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Project type: ${form.projectType}`,
      form.budget ? `Budget: ${form.budget}` : null,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  return (
    <div className="rounded-xl border border-line bg-ink-2 p-7 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Name"
            value={form.name}
            onChange={update("name")}
            required
            placeholder="Your name"
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="projectType"
              className="eyebrow mb-2.5 block"
            >
              Project type
            </label>
            <select
              id="projectType"
              value={form.projectType}
              onChange={(e) => update("projectType")(e.target.value)}
              className="w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-bone transition-colors focus:border-amber focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.label}
                </option>
              ))}
              <option value="Something else">Something else</option>
            </select>
          </div>
          <Field
            label="Budget (optional)"
            value={form.budget}
            onChange={update("budget")}
            placeholder="PKR / USD range"
          />
        </div>

        <div>
          <label htmlFor="message" className="eyebrow mb-2.5 block">
            Project details
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={form.message}
            onChange={(e) => update("message")(e.target.value)}
            placeholder="What are you shooting, how much footage, what's the deadline, and where will it be published?"
            className="w-full resize-none rounded-lg border border-line bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-faint focus:border-amber focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            className="rounded-full bg-bone px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-amber"
          >
            Send enquiry
          </button>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-bone-dim underline decoration-line underline-offset-4 transition-colors hover:text-amber hover:decoration-amber"
          >
            or message on WhatsApp
          </a>
        </div>

        {sent && (
          <p
            role="status"
            className="rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber-soft"
          >
            Your mail app should have opened with the enquiry ready to send. If
            it didn&apos;t, email{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>{" "}
            directly.
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2.5 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-faint transition-colors focus:border-amber focus:outline-none"
      />
    </div>
  );
}
