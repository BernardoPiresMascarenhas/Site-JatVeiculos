import { type Fuel, type Vehicle, vehicles } from "@/data/vehicles";
import { normalize } from "@/lib/format";

export type SortKey = "relevancia" | "preco-asc" | "preco-desc" | "ano-desc" | "ano-asc";

export interface InventoryFilters {
  q: string;
  brand: string;
  yearMin: number | null;
  yearMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  kmMax: number | null;
  fuels: Fuel[];
  sort: SortKey;
}

export const emptyFilters: InventoryFilters = {
  q: "",
  brand: "",
  yearMin: null,
  yearMax: null,
  priceMin: null,
  priceMax: null,
  kmMax: null,
  fuels: [],
  sort: "relevancia",
};

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "ano-desc", label: "Mais novos" },
  { value: "ano-asc", label: "Mais antigos" },
];

export const fuelOptions: Fuel[] = ["Gasolina", "Flex", "Diesel", "Híbrido", "Elétrico"];

export const brandOptions = Array.from(new Set(vehicles.map((v) => v.brand))).sort((a, b) =>
  a.localeCompare(b, "pt-BR"),
);

const years = vehicles.map((v) => v.yearModel);
export const yearOptions = Array.from(
  { length: Math.max(...years) - Math.min(...years) + 1 },
  (_, i) => Math.max(...years) - i,
);

export const priceOptions = [150_000, 300_000, 500_000, 750_000, 1_000_000, 1_500_000];
export const kmOptions = [10_000, 20_000, 30_000, 50_000];

/** Quantos filtros (exceto ordenação) estão ativos. */
export function activeFilterCount(f: InventoryFilters) {
  return [
    f.q,
    f.brand,
    f.yearMin,
    f.yearMax,
    f.priceMin,
    f.priceMax,
    f.kmMax,
    f.fuels.length ? f.fuels : null,
  ].filter((v) => v !== null && v !== "").length;
}

export function filterVehicles(list: Vehicle[], f: InventoryFilters) {
  const terms = normalize(f.q).split(/\s+/).filter(Boolean);

  const result = list.filter((v) => {
    if (terms.length) {
      const haystack = normalize(`${v.brand} ${v.model} ${v.version} ${v.body}`);
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    if (f.brand && v.brand !== f.brand) return false;
    if (f.yearMin !== null && v.yearModel < f.yearMin) return false;
    if (f.yearMax !== null && v.yearModel > f.yearMax) return false;
    if (f.priceMin !== null && v.price < f.priceMin) return false;
    if (f.priceMax !== null && v.price > f.priceMax) return false;
    if (f.kmMax !== null && v.km > f.kmMax) return false;
    if (f.fuels.length && !f.fuels.includes(v.fuel)) return false;
    return true;
  });

  switch (f.sort) {
    case "preco-asc":
      return result.sort((a, b) => a.price - b.price);
    case "preco-desc":
      return result.sort((a, b) => b.price - a.price);
    case "ano-desc":
      return result.sort((a, b) => b.yearModel - a.yearModel || a.km - b.km);
    case "ano-asc":
      return result.sort((a, b) => a.yearModel - b.yearModel || b.km - a.km);
    default:
      return result;
  }
}

// ——— Sincronização com a URL (?marca=BMW&precoMax=750000…) ———

const PARAMS = {
  q: "q",
  brand: "marca",
  yearMin: "anoMin",
  yearMax: "anoMax",
  priceMin: "precoMin",
  priceMax: "precoMax",
  kmMax: "kmMax",
  fuels: "combustivel",
  sort: "ordem",
} as const;

const toNumber = (value: string | null) => {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export function filtersFromParams(params: URLSearchParams): InventoryFilters {
  const sort = params.get(PARAMS.sort) as SortKey | null;
  const brand = params.get(PARAMS.brand) ?? "";
  return {
    q: params.get(PARAMS.q) ?? "",
    brand: brandOptions.includes(brand) ? brand : "",
    yearMin: toNumber(params.get(PARAMS.yearMin)),
    yearMax: toNumber(params.get(PARAMS.yearMax)),
    priceMin: toNumber(params.get(PARAMS.priceMin)),
    priceMax: toNumber(params.get(PARAMS.priceMax)),
    kmMax: toNumber(params.get(PARAMS.kmMax)),
    fuels: (params.get(PARAMS.fuels) ?? "")
      .split(",")
      .filter((f): f is Fuel => (fuelOptions as string[]).includes(f)),
    sort: sort && sortOptions.some((o) => o.value === sort) ? sort : "relevancia",
  };
}

export function filtersToParams(f: Partial<InventoryFilters>) {
  const params = new URLSearchParams();
  if (f.q?.trim()) params.set(PARAMS.q, f.q.trim());
  if (f.brand) params.set(PARAMS.brand, f.brand);
  if (f.yearMin != null) params.set(PARAMS.yearMin, String(f.yearMin));
  if (f.yearMax != null) params.set(PARAMS.yearMax, String(f.yearMax));
  if (f.priceMin != null) params.set(PARAMS.priceMin, String(f.priceMin));
  if (f.priceMax != null) params.set(PARAMS.priceMax, String(f.priceMax));
  if (f.kmMax != null) params.set(PARAMS.kmMax, String(f.kmMax));
  if (f.fuels?.length) params.set(PARAMS.fuels, f.fuels.join(","));
  if (f.sort && f.sort !== "relevancia") params.set(PARAMS.sort, f.sort);
  return params;
}
