import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { homeSelectionVehicles } from "@/data/vehicles";

const layout = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export function FeaturedVehicles() {
  const items = homeSelectionVehicles.slice(0, layout.length);

  return (
    <section aria-labelledby="destaques-title" className="relative py-24 md:py-36">
      <div className="shell">
        <SectionHeading id="destaques-title" index="01" eyebrow="Seleção em destaque" title={<>Em<br />destaque</>}>
          <p>
            Uma seleção do estoque da JAT, com fotos dos próprios veículos.
          </p>
        </SectionHeading>
      </div>

      {/* Mobile: carrossel com snap. Desktop: grade editorial. */}
      <ul className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:hidden">
        {items.map((v) => (
          <li key={v.slug} className="w-[82vw] max-w-sm shrink-0 snap-center">
            <VehicleCard vehicle={v} sizes="82vw" />
          </li>
        ))}
      </ul>

      <ul className="shell mt-16 hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-12">
        {items.map((v, i) => (
          <li key={v.slug} className={layout[i]}>
            <Reveal delay={(i % 3) * 0.08} className="h-full">
              <VehicleCard
                vehicle={v}
                aspect={i === 0 ? "aspect-[4/3] lg:aspect-[16/10]" : i === 1 ? "aspect-[4/3] lg:aspect-[8/7]" : "aspect-[4/3]"}
                sizes={i === 0 ? "(min-width: 1024px) 58vw, 50vw" : "(min-width: 1024px) 34vw, 50vw"}
              />
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="shell mt-12 flex justify-center md:mt-16">
        <Link href="/estoque" className="btn btn-ghost">
          Ver estoque completo
          <ArrowRight className="btn-arrow size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
