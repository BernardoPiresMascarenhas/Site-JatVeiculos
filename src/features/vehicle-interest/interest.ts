import type { Vehicle } from "@/data/vehicles";
import { applyMask } from "@/features/credit-application/validation";
import { formatYear } from "@/lib/format";
import { vehicleLabel, vehiclePath, whatsappLink } from "@/lib/whatsapp";

/**
 * FORMULÁRIO "INTERESSADO NESTE VEÍCULO?"
 *
 * Contato rápido a partir da página de um veículo. Separado da ficha cadastral
 * de financiamento: pede apenas nome, WhatsApp e uma mensagem opcional — nunca
 * CPF, RG, renda ou dados bancários.
 *
 * Canal atual (`interestChannel`):
 * - "whatsapp": abre o WhatsApp oficial da JAT (site.contact.whatsappNumber)
 *   com a mensagem pronta. O visitante revisa e envia pelo próprio aplicativo;
 *   nada passa por servidores deste site, nada é armazenado (nem em
 *   localStorage) e nenhum campo é enviado a analytics.
 * - "demo": valida e mostra a mensagem, sem abrir nada nem enviar. Use enquanto
 *   não houver autorização para encaminhar contatos à JAT.
 *
 * Integração futura (CRM, e-mail transacional, rota própria): implemente um
 * novo canal em `deliverInterest`, com envio por HTTPS a um servidor próprio,
 * revalidação no servidor com `validateInterest`, registro do consentimento
 * (versão da política de privacidade) e nenhum dado pessoal em logs. A
 * interface só deve confirmar o recebimento quando o servidor confirmar.
 */
export type InterestChannel = "whatsapp" | "demo";

export const interestChannel: InterestChannel = "whatsapp";

/** Identificação do veículo, tirada do mesmo cadastro usado pela página. */
export interface VehicleRef {
  /** Identificador do anúncio neste site (slug). */
  id: string;
  brand: string;
  model: string;
  version: string;
  year: string;
  /** "BMW X1 sDrive20i M Sport 2.0 TB Aut. 2025/2026" */
  label: string;
  path: string;
  /** Anúncio no site oficial, quando conferido. */
  listingUrl?: string;
}

export function vehicleRef(v: Vehicle): VehicleRef {
  return {
    id: v.slug,
    brand: v.brand,
    model: v.model,
    version: v.version,
    year: formatYear(v.yearManufacture, v.yearModel),
    label: vehicleLabel(v),
    path: vehiclePath(v),
    listingUrl: v.source.kind === "official" ? v.source.listingUrl : undefined,
  };
}

export interface InterestValues {
  name: string;
  whatsapp: string;
  message: string;
}

export type InterestErrors = Partial<Record<keyof InterestValues, string>>;

export const interestLimits = { name: 60, message: 500 } as const;

const digits = (v: string) => v.replace(/\D/g, "");

export const maskWhatsapp = (raw: string) => applyMask("phone", raw);

/** Validação básica de telefone brasileiro: DDD + 8 (fixo) ou 9 dígitos (celular). */
export function validateWhatsapp(value: string): string | null {
  const d = digits(value);
  if (!d) return "Informe seu WhatsApp com DDD.";
  if (d.length < 10) return "Número incompleto. Informe o DDD e o número, como (31) 98765-4321.";
  if (d[0] === "0" || d[1] === "0") return "DDD inválido. Confira os dois primeiros dígitos.";
  if (d.length === 11 && d[2] !== "9") return "Celulares têm 9 dígitos e começam com 9 após o DDD.";
  if (d.length === 10 && Number(d[2]) >= 6) return "Para celular, inclua o 9 antes do número.";
  return null;
}

export function validateInterest(values: InterestValues): InterestErrors {
  const errors: InterestErrors = {};
  if (values.name.trim().length < 2) errors.name = "Informe seu nome para a equipe saber com quem falar.";
  const whatsapp = validateWhatsapp(values.whatsapp);
  if (whatsapp) errors.whatsapp = whatsapp;
  if (values.message.length > interestLimits.message) errors.message = `Use até ${interestLimits.message} caracteres.`;
  return errors;
}

/** Mensagem com a identificação do veículo e os dados informados pelo visitante. */
export function interestMessage(vehicle: VehicleRef, values: InterestValues, pageUrl: string) {
  return [
    "Olá, JAT! Tenho interesse neste veículo:",
    vehicle.label,
    `Ref.: ${vehicle.id}`,
    vehicle.listingUrl && `Anúncio: ${vehicle.listingUrl}`,
    `Página: ${pageUrl}`,
    "",
    `Nome: ${values.name.trim() || "…"}`,
    `WhatsApp: ${values.whatsapp.trim() || "…"}`,
    values.message.trim() ? `Mensagem: ${values.message.trim()}` : undefined,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export type InterestDelivery = { channel: "whatsapp"; url: string } | { channel: "demo" };

/** Ponto único de saída do formulário (ver comentário no topo do arquivo). */
export function deliverInterest(text: string): InterestDelivery {
  if (interestChannel === "whatsapp") return { channel: "whatsapp", url: whatsappLink(text) };
  return { channel: "demo" };
}
