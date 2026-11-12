import { useLanguage } from "@/hooks/use-language";
import { SERVICE_IDS, type ServiceId } from "@/i18n/types";
import { cn } from "@/lib/utils";

interface ServiceChipsProps {
  value: ServiceId[];
  onChange: (value: ServiceId[]) => void;
}

export function ServiceChips({ value, onChange }: ServiceChipsProps) {
  const { t } = useLanguage();
  const toggle = (id: ServiceId) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">{t.contact.form.services}</legend>
      <div className="flex flex-wrap gap-2">
        {SERVICE_IDS.map((id) => {
          const checked = value.includes(id);
          return (
            <label
              key={id}
              className={cn(
                "inline-flex min-h-10 cursor-pointer items-center rounded-lg border px-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                checked ? "border-rust bg-rust text-white" : "border-chalk bg-paper text-ink hover:border-ink/40",
              )}
            >
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(id)} />
              {t.services.items[id].name}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
