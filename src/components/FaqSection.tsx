import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/use-language";
import { SectionHeading } from "./SectionHeading";

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-chalk bg-paper py-24 md:py-32">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <Accordion type="single" collapsible className="w-full">
          {t.faq.items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`} className="border-chalk">
              <AccordionTrigger className="text-left text-lg text-ink hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent className="text-base text-ink-muted">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
