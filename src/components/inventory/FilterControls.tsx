"use client";

import { RotateCcw } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { formatPriceShort } from "@/lib/format";
import {
  type InventoryFilters,
  activeFilterCount,
  brandOptions,
  filterVehicles,
  fuelOptions,
  kmOptions,
  priceOptions,
  yearOptions,
} from "@/lib/inventory";

interface FilterControlsProps {
  filters: InventoryFilters;
  onChange: (patch: Partial<InventoryFilters>) => void;
  onReset: () => void;
}

const numberOrNull = (value: string) => (value ? Number(value) : null);

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-white/10 py-5">
      <legend className="eyebrow float-left mb-3.5 w-full text-fog">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Chip({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-10 items-center gap-2 border px-3 text-[0.8rem] transition-all duration-300 ${
        active
          ? "border-ice bg-ice text-carbon"
          : "border-white/12 text-mist hover:border-white/40 hover:text-ice disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/12"
      }`}
    >
      {children}
    </button>
  );
}

export function FilterControls({ filters, onChange, onReset }: FilterControlsProps) {
  // Contagem por opção considerando os demais filtros ativos.
  const countWith = (patch: Partial<InventoryFilters>) => filterVehicles(vehicles, { ...filters, ...patch }).length;
  const active = activeFilterCount({ ...filters, q: "" });

  return (
    <div>
      <div className="flex items-center justify-between pb-5">
        <p className="headline text-lg uppercase">Filtros</p>
        <button
          type="button"
          onClick={onReset}
          disabled={activeFilterCount(filters) === 0}
          className="eyebrow flex items-center gap-2 text-fog transition-colors hover:text-ice disabled:opacity-30 disabled:hover:text-fog"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Limpar{active > 0 && ` (${active})`}
        </button>
      </div>

      <Group title="Marca">
        <div className="flex flex-wrap gap-2">
          <Chip active={!filters.brand} onClick={() => onChange({ brand: "" })}>
            Todas
          </Chip>
          {brandOptions.map((b) => {
            const n = countWith({ brand: b });
            return (
              <Chip
                key={b}
                active={filters.brand === b}
                disabled={n === 0 && filters.brand !== b}
                onClick={() => onChange({ brand: filters.brand === b ? "" : b })}
              >
                {b}
                <span className="font-mono text-[0.65rem] opacity-60">{n}</span>
              </Chip>
            );
          })}
        </div>
      </Group>

      <Group title="Ano do modelo">
        <div className="grid grid-cols-2 gap-2">
          <label>
            <span className="sr-only">Ano mínimo</span>
            <select
              className="field"
              value={filters.yearMin ?? ""}
              onChange={(e) => onChange({ yearMin: numberOrNull(e.target.value) })}
            >
              <option value="">De</option>
              {yearOptions.map((y) => (
                <option key={y} value={y} disabled={filters.yearMax !== null && y > filters.yearMax}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Ano máximo</span>
            <select
              className="field"
              value={filters.yearMax ?? ""}
              onChange={(e) => onChange({ yearMax: numberOrNull(e.target.value) })}
            >
              <option value="">Até</option>
              {yearOptions.map((y) => (
                <option key={y} value={y} disabled={filters.yearMin !== null && y < filters.yearMin}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Group>

      <Group title="Preço">
        <div className="grid grid-cols-2 gap-2">
          <label>
            <span className="sr-only">Preço mínimo</span>
            <select
              className="field"
              value={filters.priceMin ?? ""}
              onChange={(e) => onChange({ priceMin: numberOrNull(e.target.value) })}
            >
              <option value="">Mínimo</option>
              {priceOptions.map((p) => (
                <option key={p} value={p} disabled={filters.priceMax !== null && p >= filters.priceMax}>
                  {formatPriceShort(p)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Preço máximo</span>
            <select
              className="field"
              value={filters.priceMax ?? ""}
              onChange={(e) => onChange({ priceMax: numberOrNull(e.target.value) })}
            >
              <option value="">Máximo</option>
              {priceOptions.map((p) => (
                <option key={p} value={p} disabled={filters.priceMin !== null && p <= filters.priceMin}>
                  {formatPriceShort(p)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Group>

      <Group title="Quilometragem">
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.kmMax === null} onClick={() => onChange({ kmMax: null })}>
            Qualquer
          </Chip>
          {kmOptions.map((km) => (
            <Chip key={km} active={filters.kmMax === km} onClick={() => onChange({ kmMax: filters.kmMax === km ? null : km })}>
              Até {km / 1000} mil km
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Combustível">
        <div className="flex flex-wrap gap-2">
          {fuelOptions.map((fuel) => {
            const selected = filters.fuels.includes(fuel);
            const n = countWith({ fuels: [fuel] });
            return (
              <Chip
                key={fuel}
                active={selected}
                disabled={n === 0 && !selected}
                onClick={() =>
                  onChange({ fuels: selected ? filters.fuels.filter((f) => f !== fuel) : [...filters.fuels, fuel] })
                }
              >
                {fuel}
                <span className="font-mono text-[0.65rem] opacity-60">{n}</span>
              </Chip>
            );
          })}
        </div>
      </Group>
    </div>
  );
}
