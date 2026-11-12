import { Clock, Languages, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/hooks/use-language";
import { ContactForm } from "./ContactForm";
import { SectionHeading } from "./SectionHeading";

export function ContactSection() {
  const { t } = useLanguage();
  const { contact } = t;
  const details = [
    { icon: Mail, label: contact.emailLabel, value: <a href={`mailto:${siteConfig.email}`} className="underline decoration-rust underline-offset-4">{siteConfig.email}</a> },
    { icon: MapPin, label: contact.locationLabel, value: contact.locationValue },
    { icon: Clock, label: contact.responseLabel, value: contact.responseValue },
    { icon: Languages, label: contact.languagesLabel, value: contact.languagesValue },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 md:py-32">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading id="contact-title" eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} />
          <dl className="mt-10 space-y-5">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <dt className="flex items-center gap-2 text-sm text-ink-muted">
                  <Icon className="h-5 w-5 shrink-0 text-rust" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="pl-7 font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
