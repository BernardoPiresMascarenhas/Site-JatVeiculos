import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SourceTag } from "@/components/ui/DemoTag";
import { FeaturedRibbon } from "@/components/vehicles/FeaturedRibbon";
import type { Vehicle } from "@/data/vehicles";
import { formatKm, formatPrice, formatYear } from "@/lib/format";

interface VehicleCardProps {
  vehicle: Vehicle;
  sizes?: string;
  priority?: boolean;
  /** Proporção da imagem; o destaque da home usa uma versão mais alta. */
  aspect?: string;
}

export function VehicleCard({
  vehicle: v,
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw",
  priority,
  aspect = "aspect-[4/3]",
}: VehicleCardProps) {
  return (
    <Link
      href={`/estoque/${v.slug}`}
      className="surface group relative flex h-full flex-col bg-ink outline-offset-4"
      aria-label={`${v.featured ? "Destaque: " : ""}${v.brand} ${v.model} ${v.version}, ${formatYear(v.yearManufacture, v.yearModel)}, ${formatKm(v.km)}, ${formatPrice(v.price)}`}
    >
      {/* Foto com véu e selos: escura nos dois temas */}
      <div data-theme="dark" className={`relative overflow-hidden bg-graphite ${aspect}`}>
        <Image
          src={v.image.src}
          alt={v.image.alt}
          fill
          sizes={sizes}
          preload={priority}
          style={{ objectPosition: v.image.focus }}
          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-90"
        />
        {v.featured && <FeaturedRibbon />}
        {/* Com a fita no canto esquerdo, o selo de demonstrativo vai para a direita. */}
        <SourceTag source={v.source} className={`absolute top-3 ${v.featured ? "right-3" : "left-3"}`} />
        <span
          aria-hidden
          className="absolute right-3 bottom-3 grid size-11 translate-y-2 place-items-center bg-ice text-carbon opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <span
          aria-hidden
          className="absolute top-0 left-0 h-[2px] w-0 bg-brand transition-[width] duration-700 ease-out-expo group-hover:w-full"
        />
        <p className="eyebrow text-fog">{v.brand}</p>
        <h3 className="headline mt-2 text-[1.6rem] uppercase sm:text-[1.75rem]">{v.model}</h3>
        <p className="mt-1 truncate text-sm text-mist">{v.version}</p>

        <dl className="mt-5 grid grid-cols-3 border-t border-white/[0.08] pt-4 font-mono text-[0.72rem] text-fog">
          <div>
            <dt className="sr-only">Ano</dt>
            <dd>{formatYear(v.yearManufacture, v.yearModel)}</dd>
          </div>
          <div>
            <dt className="sr-only">Quilometragem</dt>
            <dd>{formatKm(v.km)}</dd>
          </div>
          <div className="text-right">
            <dt className="sr-only">Combustível</dt>
            <dd>{v.fuel}</dd>
          </div>
        </dl>

        <p className="spec-value mt-5 text-[1.45rem] text-ice">{formatPrice(v.price)}</p>
      </div>
    </Link>
  );
}
