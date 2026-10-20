"use client";

import { useState } from "react";
import { z } from "zod";
import { profile } from "@/content/profile";
import { useT } from "@/components/LangProvider";

const makeSchema = (t: ReturnType<typeof useT>) =>
  z.object({
    name: z.string().trim().min(2, t("errName")),
    email: z.string().trim().email(t("errEmail")),
    message: z.string().trim().min(10, t("errMessageShort")).max(2000, t("errMessageLong")),
  });

type Fields = z.infer<ReturnType<typeof makeSchema>>;
type Errors = Partial<Record<keyof Fields, string>>;

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

/** Contact form validated with Zod. Sends via Formspree when configured, otherwise opens a prefilled email. */
export function ContactForm() {
  const t = useT();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.website) return; // honeypot
    const parsed = makeSchema(t).safeParse(data);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues)
        next[issue.path[0] as keyof Fields] ??= issue.message;
      setErrors(next);
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});

    if (!FORMSPREE_ID) {
      const body = encodeURIComponent(
        `${parsed.data.message}\n\n— ${parsed.data.name} (${parsed.data.email})`,
      );
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`${t("mailSubject")} ${parsed.data.name}`)}&body=${body}`;
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full border-2 border-line bg-ink/80 px-4 py-3 text-paper placeholder:text-muted/70 focus:border-cyan focus:outline-none aria-[invalid=true]:border-sakura";

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5" aria-describedby="form-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
            {t("formName")}{" "}
            <span lang="ja" aria-hidden="true" className="font-jp text-muted">
              名前
            </span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            className={field}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sakura mt-1 text-sm">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
            Email{" "}
            <span lang="ja" aria-hidden="true" className="font-jp text-muted">
              メール
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={field}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sakura mt-1 text-sm">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">
          {t("formMessage")}{" "}
          <span lang="ja" aria-hidden="true" className="font-jp text-muted">
            メッセージ
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={field}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-sakura mt-1 text-sm">
            {errors.message}
          </p>
        )}
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-neon" data-magnetic disabled={status === "sending"}>
          {status === "sending" ? t("formSending") : t("formSend")}{" "}
          <span aria-hidden="true" lang="ja" className="font-jp">
            送信
          </span>
        </button>
        <p id="form-status" role="status" className="text-sm">
          {status === "sent" && <span className="text-cyan">{t("formSent")}</span>}
          {status === "error" && (
            <span className="text-sakura">
              {t("formError")}{" "}
              <a className="underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              .
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
