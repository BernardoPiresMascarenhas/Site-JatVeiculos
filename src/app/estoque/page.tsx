import type { Metadata } from "next";
import { Suspense } from "react";
import { InventoryExplorer } from "@/components/inventory/InventoryExplorer";
import { vehicles } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "Estoque",
  description: "Explore o estoque da JAT Veículos com busca por marca e modelo e filtros por ano, preço, combustível e quilometragem.",
  alternates: { canonical: "/estoque" },
};

function InventorySkeleton() {
  return (
    <div className="shell grid gap-12 pb-28 lg:grid-cols-12" aria-hidden>
      <div className="hidden h-[32rem] bg-ink lg:col-span-3 lg:block" />
      <div className="lg:col-span-9">
        <div className="h-13 bg-graphite" />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse bg-ink" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EstoquePage() {
  return (
    <>
      <header className="relative overflow-hidden pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="shell">
          <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
            <span aria-hidden className="h-px w-8 bg-brand" />
            Showroom digital
          </p>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h1 className="display text-[clamp(3.4rem,11vw,10rem)]">Estoque</h1>
            <div className="max-w-sm pb-2">
              <p className="text-sm leading-relaxed text-fog">
                {vehicles.length} veículos conferidos no estoque oficial da JAT. O estoque não é atualizado em
                tempo real: confirme a disponibilidade pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </header>
      <Suspense fallback={<InventorySkeleton />}>
        <InventoryExplorer />
      </Suspense>
    </>
  );
}
