import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContactDraft } from "@/hooks/use-contact-draft";
import { useLanguage } from "@/hooks/use-language";
import { BUDGET_IDS, type ServiceId } from "@/i18n/types";
import { createContactSchema, submitContact, type ContactValues } from "@/lib/contact";
import { ServiceChips } from "./ServiceChips";

type Status = "idle" | "draft" | "sent" | "mailto" | "error";
interface DraftNote {
  id: number;
  copiedMessage: boolean;
  services: ServiceId[];
}
const field = "mt-1 w-full rounded-lg border border-chalk bg-paper px-3 py-2.5 text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-ring";
const label = "text-sm font-medium text-ink";
const errorText = "mt-1 text-sm text-destructive";

export function ContactForm() {
  const { t } = useLanguage();
  const copy = t.contact.form;
  const schema = useMemo(() => createContactSchema(copy.errors), [copy.errors]);
  const [status, setStatus] = useState<Status>("idle");
  const { draft } = useContactDraft();
  const [note, setNote] = useState<DraftNote | null>(null);
  const { register, control, handleSubmit, reset, formState, setValue, getValues } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", services: [], budget: "unsure", message: "", botcheck: "" },
  });
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (!draft) return;
    if (draft.message) {
      const existing = getValues("message").trim();
      const alreadyThere = existing.includes(draft.message);
      if (!alreadyThere) setValue("message", existing ? `${existing}\n\n${draft.message}` : draft.message);
    }
    setValue("services", Array.from(new Set([...getValues("services"), ...draft.services])));
    setNote({ id: draft.id, copiedMessage: Boolean(draft.message), services: draft.services });
    setStatus("draft");
    // Skip on touch screens: the on-screen keyboard would cover the form mid-scroll.
    if (!window.matchMedia("(pointer: coarse)").matches) {
      // preventScroll keeps the smooth scroll from ContactDraftProvider instead of jumping.
      document.getElementById("name")?.focus({ preventScroll: true });
    }
  }, [draft, setValue, getValues]);

  const draftText = note
    ? [
        note.copiedMessage && copy.draftMessage,
        note.services.length > 0 && `${copy.draftServices} ${note.services.map((id) => t.services.items[id].name).join(", ")}.`,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const onSubmit = async (values: ContactValues) => {
    setStatus("idle");
    const labels = {
      serviceNames: values.services.map((id) => t.services.items[id].name),
      budgetLabel: copy.budgetOptions[values.budget],
    };
    try {
      const result = await submitContact(values, labels);
      if (result.kind === "mailto") {
        window.location.href = result.href;
        setStatus("mailto");
        return;
      }
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="relative space-y-5 rounded-2xl border border-dashed border-ink/25 bg-paper p-6 md:p-8">
      {note && <div key={note.id} aria-hidden="true" className="animate-stitch-arrive pointer-events-none absolute inset-0 rounded-2xl" />}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>{copy.name}</label>
          <input id="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
          {errors.name && <p id="name-error" className={errorText}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={label}>{copy.email}</label>
          <input id="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
          {errors.email && <p id="email-error" className={errorText}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={label}>{copy.phone} <span className="font-normal text-ink-muted">({copy.optional})</span></label>
          <input id="phone" type="tel" autoComplete="tel" className={field} {...register("phone")} />
        </div>
        <div>
          <label htmlFor="budget" className={label}>{copy.budget}</label>
          <select id="budget" className={field} {...register("budget")}>
            {BUDGET_IDS.map((id) => <option key={id} value={id}>{copy.budgetOptions[id]}</option>)}
          </select>
        </div>
      </div>
      <Controller control={control} name="services" render={({ field: f }) => <ServiceChips value={f.value} onChange={f.onChange} />} />
      <div>
        <label htmlFor="message" className={label}>{copy.message}</label>
        <textarea id="message" rows={5} placeholder={copy.messagePlaceholder} className={field} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} {...register("message")} />
        {errors.message && <p id="message-error" className={errorText}>{errors.message.message}</p>}
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("botcheck")} />
      <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-rust px-6 py-3.5 font-semibold text-white transition-colors hover:bg-rust-dark sm:w-auto">
        {isSubmitting ? copy.submitting : copy.submit}
      </button>
      <p className="text-sm text-ink-muted">{copy.privacy}</p>
      <p role="status" aria-live="polite" className={status === "error" ? "text-sm text-destructive" : "text-sm font-medium text-ink"}>
        {status === "draft" && draftText}
        {status === "sent" && copy.success}
        {status === "mailto" && copy.mailto}
        {status === "error" && copy.error}
      </p>
    </form>
  );
}
