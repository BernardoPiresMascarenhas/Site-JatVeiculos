"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { vehicles } from "@/data/vehicles";
import { formatPriceShort } from "@/lib/format";
import {
  brandOptions,
  emptyFilters,
  filterVehicles,
  filtersToParams,
  priceOptions,
  yearOptions,
} from "@/lib/inventory";

export function QuickSearch() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [q, setQ] = useState("");
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [yearMin, setYearMin] = useState<number | null>(null);

  const filters = { ...emptyFilters, brand, q, priceMax, yearMin };
  const count = filterVehicles(vehicles, filters).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = filtersToParams(filters).toString();
    router.push(params ? `/estoque?${params}` : "/estoque");
    // A home fica montada em segundo plano: ao voltar, a busca começa limpa.
    setBrand("");
    setQ("");
    setPriceMax(null);
    setYearMin(null);
  };

  return (
    <section id="busca" aria-labelledby="busca-title" className="carbon-texture relative scroll-mt-[calc(4rem+env(safe-area-inset-top))] border-y border-white/[0.06]">
      <div className="shell py-12 md:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="busca-title" className="headline text-2xl uppercase md:text-3xl">
            Encontre o seu
          </h2>
          <p className="eyebrow text-fog">
            {vehicles.length} veículos no estoque
          </p>
        </div>

        <form onSubmit={submit} className="surface grid gap-px bg-steel md:grid-cols-[1fr_1.4fr_1fr_1fr_auto]">
          <label className="flex flex-col gap-1.5 bg-graphite px-5 pt-4 pb-3">
            <span className="eyebrow text-[0.6rem] text-fog">Marca</span>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent py-1 text-base text-ice outline-none"
            >
              <option value="" className="bg-graphite">Todas</option>
              {brandOptions.map((b) => (
                <option key={b} value={b} className="bg-graphite">{b}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 bg-graphite px-5 pt-4 pb-3">
            <span className="eyebrow text-[0.6rem] text-fog">Modelo</span>
            <span className="flex items-center gap-2">
              <Search className="size-4 text-fog" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex.: 911, M5, RAV4"
                className="w-full bg-transparent py-1 text-base text-ice outline-none placeholder:text-smoke"
              />
            </span>
          </label>
          <label className="flex flex-col gap-1.5 bg-graphite px-5 pt-4 pb-3">
            <span className="eyebrow text-[0.6rem] text-fog">Preço até</span>
            <select
              value={priceMax ?? ""}
              onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : null)}
              className="cursor-pointer appearance-none bg-transparent py-1 text-base text-ice outline-none"
            >
              <option value="" className="bg-graphite">Qualquer valor</option>
              {priceOptions.map((p) => (
                <option key={p} value={p} className="bg-graphite">{formatPriceShort(p)}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 bg-graphite px-5 pt-4 pb-3">
            <span className="eyebrow text-[0.6rem] text-fog">Ano a partir de</span>
            <select
              value={yearMin ?? ""}
              onChange={(e) => setYearMin(e.target.value ? Number(e.target.value) : null)}
              className="cursor-pointer appearance-none bg-transparent py-1 text-base text-ice outline-none"
            >
              <option value="" className="bg-graphite">Qualquer ano</option>
              {yearOptions.map((y) => (
                <option key={y} value={y} className="bg-graphite">{y}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="btn btn-primary min-h-[4.5rem] md:px-8"
            aria-label={`Ver ${count} veículos`}
          >
            <span className="tabular-nums">
              Ver {count} {count === 1 ? "veículo" : "veículos"}
            </span>
            <ArrowRight className="btn-arrow size-4" aria-hidden />
          </button>
        </form>
      </div>
    </section>
  );
}
