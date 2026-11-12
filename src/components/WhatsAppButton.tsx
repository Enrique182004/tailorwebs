import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/hooks/use-language";

export function WhatsAppButton() {
  const { t } = useLanguage();
  if (!siteConfig.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.label}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F7A4D] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
