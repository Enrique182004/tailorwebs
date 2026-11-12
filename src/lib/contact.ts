import { z } from "zod";
import { siteConfig } from "@/config/site";
import { BUDGET_IDS, SERVICE_IDS } from "@/i18n/types";

export function createContactSchema(messages: { name: string; email: string; message: string }) {
  return z.object({
    name: z.string().trim().min(1, messages.name).max(100),
    email: z.string().trim().email(messages.email).max(200),
    phone: z.string().trim().max(30),
    services: z.array(z.enum(SERVICE_IDS)),
    budget: z.enum(BUDGET_IDS),
    message: z.string().trim().min(10, messages.message).max(2000),
    botcheck: z.string(),
  });
}

export type ContactValues = z.infer<ReturnType<typeof createContactSchema>>;

interface Labels {
  serviceNames: string[];
  budgetLabel: string;
}

function summary(values: ContactValues, labels: Labels): string {
  const lines = [`${values.name} <${values.email}>`];
  if (values.phone) lines.push(`Phone: ${values.phone}`);
  if (labels.serviceNames.length > 0) lines.push(`Services: ${labels.serviceNames.join(", ")}`);
  lines.push(`Budget: ${labels.budgetLabel}`, "", values.message);
  return lines.join("\n");
}

export function buildMailto(values: ContactValues, labels: Labels): string {
  const subject = encodeURIComponent(`New project inquiry from ${values.name}`);
  return `mailto:${siteConfig.email}?subject=${subject}&body=${encodeURIComponent(summary(values, labels))}`;
}

export type SubmitResult = { kind: "sent" } | { kind: "mailto"; href: string } | { kind: "spam" };

export async function submitContact(values: ContactValues, labels: Labels): Promise<SubmitResult> {
  if (values.botcheck) return { kind: "spam" };
  if (!siteConfig.web3formsKey) return { kind: "mailto", href: buildMailto(values, labels) };

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: siteConfig.web3formsKey,
      subject: `New project inquiry from ${values.name}`,
      from_name: "TailorWebs website",
      name: values.name,
      email: values.email,
      phone: values.phone,
      services: labels.serviceNames.join(", "),
      budget: labels.budgetLabel,
      message: values.message,
    }),
  });
  const data: { success?: boolean } = await response.json();
  if (!response.ok || !data.success) throw new Error("Web3Forms rejected the message");
  return { kind: "sent" };
}
