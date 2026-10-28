"use client";

import { MessageCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { vehicles } from "@/data/vehicles";
import { formatPriceShort } from "@/lib/format";
import {
  type InventoryFilters,
  activeFilterCount,
  emptyFilters,
  filterVehicles,
  filtersFromParams,
  filtersToParams,
  sortOptions,
} from "@/lib/inventory";
import { whatsappLink } from "@/lib/whatsapp";
import { FilterControls } from "./FilterControls";

const ease = [0.16, 1, 0.3, 1] as const;

function activeChips(f: InventoryFilters): { key: string; label: string; clear: Partial<InventoryFilters> }[] {
  const chips: { key: string; label: string; clear: Partial<InventoryFilters> }[] = [];
  if (f.q.trim()) chips.push({ key: "q", label: `“${f.q.trim()}”`, clear: { q: "" } });
  if (f.brand) chips.push({ key: "brand", label: f.brand, clear: { brand: "" } });
  if (f.yearMin !== null) chips.push({ key: "yearMin", label: `A partir de ${f.yearMin}`, clear: { yearMin: null } });
  if (f.yearMax !== null) chips.push({ key: "yearMax", label: `Até ${f.yearMax}`, clear: { yearMax: null } });
  if (f.priceMin !== null) chips.push({ key: "priceMin", label: `Acima de ${formatPriceShort(f.priceMin)}`, clear: { priceMin: null } });
  if (f.priceMax !== null) chips.push({ key: "priceMax", label: `Até ${formatPriceShort(f.priceMax)}`, clear: { priceMax: null } });
  if (f.kmMax !== null) chips.push({ key: "kmMax", label: `Até ${f.kmMax / 1000} mil km`, clear: { kmMax: null } });
  for (const fuel of f.fuels) {
    chips.push({ key: `fuel-${fuel}`, label: fuel, clear: { fuels: f.fuels.filter((x) => x !== fuel) } });
  }
  return chips;
}

export function InventoryExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [filters, setFilters] = useState<InventoryFilters>(() => filtersFromParams(new URLSearchParams(searchParams)));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Com cacheComponents a página fica montada (escondida) entre navegações e o
  // estado sobrevive. Uma nova busca vinda de outra página (ex.: /estoque?q=bmw)
  // chega só pela URL, então os filtros são recalculados quando ela muda.
  // - Escondida, a página enxerga a URL das outras rotas: só sincroniza em /estoque.
  // - As trocas feitas aqui mesmo (replaceState abaixo) já batem com o estado.
  // - A grade é recriada para não animar a saída de cards que ninguém viu.
  const paramsKey = searchParams.toString();
  const [syncedKey, setSyncedKey] = useState(paramsKey);
  const [gridKey, setGridKey] = useState(0);
  if (pathname === "/estoque" && paramsKey !== syncedKey) {
    setSyncedKey(paramsKey);
    if (paramsKey !== filtersToParams(filters).toString()) {
      setFilters(filtersFromParams(new URLSearchParams(paramsKey)));
      setGridKey((k) => k + 1);
    }
  }

  const results = filterVehicles(vehicles, filters);
  const chips = activeChips(filters);
  const count = activeFilterCount(filters);

  const update = (patch: Partial<InventoryFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const reset = () => setFilters(emptyFilters);

  // Mantém a URL compartilhável sem disparar uma nova navegação.
  useEffect(() => {
    const qs = filtersToParams(filters).toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [filters]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <div className="shell grid gap-10 pb-28 lg:grid-cols-12 lg:gap-12">
      {/* Filtros — desktop */}
      <aside aria-label="Filtros" className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-[calc(6rem+env(safe-area-inset-top))] max-h-[calc(100dvh-7rem-env(safe-area-inset-top))] overflow-y-auto pr-3 pb-6 [scrollbar-color:var(--color-smoke)_transparent] [scrollbar-width:thin]">
          <FilterControls filters={filters} onChange={update} onReset={reset} />
        </div>
      </aside>

      <div className="lg:col-span-9">
        {/* Barra de busca e ordenação */}
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
          <label className="flex flex-1 items-center gap-3 border border-steel bg-graphite px-4 transition-colors focus-within:border-brand hover:border-smoke">
            <Search className="size-4 shrink-0 text-fog" aria-hidden />
            <span className="sr-only">Buscar por marca ou modelo</span>
            <input
              type="search"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Buscar marca ou modelo"
              className="min-h-13 w-full bg-transparent text-base text-ice outline-none placeholder:text-smoke"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex min-h-13 flex-1 items-center justify-center gap-2 border border-steel bg-graphite px-4 text-sm lg:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtros
              {count > 0 && <span className="grid size-5 place-items-center bg-brand font-mono text-[0.65rem] text-on-brand">{count}</span>}
            </button>
            <label className="flex-1 md:w-52 md:flex-none">
              <span className="sr-only">Ordenar por</span>
              <select
                className="field min-h-13"
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as InventoryFilters["sort"] })}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Contador e filtros ativos */}
        <div className="mt-6 flex min-h-10 flex-wrap items-center gap-x-5 gap-y-3">
          <p role="status" aria-live="polite" className="flex items-baseline gap-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={results.length}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.35, ease }}
                className="spec-value inline-block text-2xl tabular-nums"
              >
                {results.length}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-fog">
              {results.length === 1 ? "veículo encontrado" : "veículos encontrados"}
            </span>
          </p>

          <ul className="flex flex-wrap gap-2" aria-label="Filtros ativos">
            <AnimatePresence initial={false}>
              {chips.map((chip) => (
                <motion.li
                  key={chip.key}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => update(chip.clear)}
                    className="flex items-center gap-1.5 border border-brand/40 bg-brand/[0.07] py-1 pr-2 pl-3 text-xs text-ice transition-colors hover:border-brand hover:bg-brand/15"
                    aria-label={`Remover filtro ${chip.label}`}
                  >
                    {chip.label}
                    <X className="size-3.5" aria-hidden />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
            {chips.length > 1 && (
              <li>
                <button type="button" onClick={reset} className="eyebrow link-line py-1.5 text-fog hover:text-ice">
                  Limpar tudo
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Resultados */}
        {results.length > 0 ? (
          <motion.ul key={gridKey} layout className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((v, i) => (
                <motion.li
                  key={v.slug}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.6, ease, delay: Math.min(i, 6) * 0.03 }}
                >
                  <VehicleCard
                    vehicle={v}
                    contact
                    priority={i < 3}
                    sizes="(min-width: 1280px) 24vw, (min-width: 640px) 45vw, 100vw"
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="surface relative mt-8 overflow-hidden border border-white/10 bg-ink px-6 py-20 text-center md:py-28"
          >
            <p aria-hidden className="display text-outline pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-[clamp(10rem,30vw,22rem)] leading-none">
              0
            </p>
            <div className="relative">
              <p className="headline text-2xl uppercase md:text-3xl">Nenhum veículo com esses critérios</p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fog">
                Ajuste ou remova alguns filtros. Se procura algo específico, a equipe da JAT pode ajudar a
                encontrar.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={reset} className="btn btn-light">
                  Limpar filtros
                </button>
                <a
                  href={whatsappLink("Olá, JAT! Estou procurando um veículo específico. Podem me ajudar?")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Falar com consultor
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filtros — gaveta mobile */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[55] lg:hidden">
            <motion.button
              type="button"
              aria-label="Fechar filtros"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-scrim/80"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.55, ease }}
              className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col border-t border-white/10 bg-ink"
            >
              <div className="flex items-center justify-between border-b border-white/10 py-1 pr-2 pl-5">
                <span className="eyebrow text-fog">
                  {results.length} {results.length === 1 ? "resultado" : "resultados"}
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="grid size-11 place-items-center"
                  aria-label="Fechar filtros"
                  autoFocus
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <div className="overflow-y-auto px-5 pt-5 pb-4">
                <FilterControls filters={filters} onChange={update} onReset={reset} />
              </div>
              <div className="border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button type="button" onClick={() => setDrawerOpen(false)} className="btn btn-primary w-full">
                  Ver {results.length} {results.length === 1 ? "veículo" : "veículos"}
                </button>
              </div>
            </motion.div>
            <span aria-hidden className="grain-layer" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
