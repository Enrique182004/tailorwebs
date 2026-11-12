import {
  Boxes,
  Globe,
  Hash,
  Laptop,
  Megaphone,
  Network,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { GroupId, ServiceId } from "@/i18n/types";

export const serviceGroups: { id: GroupId; services: ServiceId[] }[] = [
  { id: "build", services: ["customApps", "websites", "ecommerce", "inventory"] },
  { id: "grow", services: ["socialSeo", "marketing"] },
  { id: "protect", services: ["networkInfra", "itAudits", "networkAudits"] },
];

export const serviceIcons: Record<ServiceId, LucideIcon> = {
  customApps: Smartphone,
  websites: Globe,
  ecommerce: ShoppingCart,
  inventory: Boxes,
  socialSeo: Hash,
  marketing: Megaphone,
  networkInfra: Network,
  itAudits: Laptop,
  networkAudits: ShieldCheck,
};
