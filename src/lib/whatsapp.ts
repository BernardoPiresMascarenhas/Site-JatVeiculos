import { site } from "@/config/site";
import { type Vehicle, vehicleName } from "@/data/vehicles";
import { formatYear } from "@/lib/format";

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.contact.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** "BMW X1 sDrive20i M Sport 2.0 TB Aut. 2025/2026": marca, modelo, versão e ano do cadastro. */
export function vehicleLabel(v: Vehicle) {
  return `${vehicleName(v)} ${v.version} ${formatYear(v.yearManufacture, v.yearModel)}`;
}

/** Caminho da página do veículo neste site. */
export const vehiclePath = (v: Vehicle) => `/estoque/${v.slug}`;

/**
 * Mensagem para um veículo. Anúncios demonstrativos perguntam por modelos
 * semelhantes; anúncios conferidos pedem confirmação de disponibilidade e
 * levam o link do anúncio no site oficial, que a equipe da JAT reconhece.
 * `pageUrl` (página deste site) só entra quando não há anúncio oficial.
 */
export function vehicleWhatsappText(v: Vehicle, pageUrl?: string) {
  const label = vehicleLabel(v);
  if (v.source.kind === "official") {
    return `Olá, JAT! Tenho interesse no ${label}. Ele ainda está disponível?\nAnúncio: ${v.source.listingUrl}`;
  }
  return [`Olá, JAT! Tenho interesse em um veículo como o ${label}. Vocês têm algo semelhante no estoque?`, pageUrl && `Vi em: ${pageUrl}`]
    .filter(Boolean)
    .join("\n");
}
