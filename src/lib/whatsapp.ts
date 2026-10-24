import { site } from "@/config/site";
import { type Vehicle, vehicleName } from "@/data/vehicles";
import { formatYear } from "@/lib/format";

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.contact.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Mensagem para um veículo. Anúncios demonstrativos perguntam por modelos
 * semelhantes; anúncios conferidos pedem confirmação de disponibilidade.
 */
export function vehicleWhatsappText(v: Vehicle) {
  const label = `${vehicleName(v)} ${v.version} ${formatYear(v.yearManufacture, v.yearModel)}`;
  return v.source.kind === "demo"
    ? `Olá, JAT! Tenho interesse em um veículo como o ${label}. Vocês têm algo semelhante no estoque?`
    : `Olá, JAT! Tenho interesse no ${label}. Ele ainda está disponível?`;
}
