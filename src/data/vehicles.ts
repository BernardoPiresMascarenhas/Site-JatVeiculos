/**
 * ESTOQUE
 *
 * Modelo de dados dos veículos e funções de consulta. Os anúncios ficam em
 * `official-vehicles.ts`: todos conferidos manualmente no estoque oficial
 * (https://jatveiculos.com.br/estoque/), com fotos do próprio veículo
 * fornecidas para o projeto. Não há sincronização em tempo real.
 */

import { officialVehicles } from "./official-vehicles";

export type Fuel = "Gasolina" | "Flex" | "Diesel" | "Híbrido" | "Elétrico";
export type Transmission = "Automática" | "Manual" | "Dupla embreagem";

export interface VehicleImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Ponto focal (CSS object-position) para recortes. */
  focus: string;
  /** Ponto usado no enquadramento de detalhe da galeria. */
  detail: string;
  /** Origem da fotografia (ex.: "JAT Veículos"). */
  credit: string;
  /** Legenda curta na galeria (ex.: "Interior"). */
  label?: string;
}

/**
 * Origem do anúncio. "demo" = fictício, só para demonstrar a interface.
 * "official" = conferido manualmente no estoque oficial em `verifiedAt`;
 * não é sincronizado em tempo real e pode já ter sido vendido.
 */
export type VehicleSource = { kind: "demo" } | { kind: "official"; verifiedAt: string; listingUrl: string };

export interface Vehicle {
  source: VehicleSource;
  /**
   * Fotografias reais do próprio veículo anunciado (todas do mesmo carro).
   * Quando ausente, a galeria usa enquadramentos da imagem principal.
   */
  photos?: VehicleImage[];
  slug: string;
  brand: string;
  model: string;
  version: string;
  yearManufacture: number;
  yearModel: number;
  km: number;
  price: number;
  fuel: Fuel;
  /** Opcional: alguns anúncios (ex.: motos) não informam o câmbio. */
  transmission?: Transmission;
  body: string;
  color: string;
  /** Opcional: só preencher quando informado no anúncio. */
  engine?: string;
  /** Opcional: só preencher quando informado no anúncio. */
  power?: string;
  acceleration?: string;
  description: string;
  features: string[];
  image: VehicleImage;
  /** Fita "DESTAQUE" no card do veículo (estoque, destaques e relacionados). */
  featured: boolean;
  /** Entra na seção "Em destaque" da home (as primeiras posições da grade). */
  homeSelection?: boolean;
  /** Participa do showroom interativo da home, na posição `order`. */
  showroom?: { tagline: string; order: number };
}

export const vehicles: Vehicle[] = officialVehicles;

export const isDemo = (v: Vehicle) => v.source.kind === "demo";
export const demoCount = vehicles.filter(isDemo).length;
export const officialCount = vehicles.length - demoCount;

export function getVehicle(slug: string) {
  return vehicles.find((v) => v.slug === slug);
}

export function vehicleName(v: Vehicle) {
  return `${v.brand} ${v.model}`;
}

export const homeSelectionVehicles = vehicles.filter((v) => v.homeSelection);
export const showroomVehicles = vehicles
  .filter((v) => v.showroom)
  .sort((a, b) => (a.showroom?.order ?? 0) - (b.showroom?.order ?? 0));

export function relatedVehicles(v: Vehicle, count = 3) {
  return vehicles
    .filter((o) => o.slug !== v.slug)
    .map((o) => ({
      o,
      score:
        (o.brand === v.brand ? 3 : 0) +
        (o.body === v.body ? 2 : 0) +
        (Math.abs(o.price - v.price) < v.price * 0.35 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ o }) => o);
}
