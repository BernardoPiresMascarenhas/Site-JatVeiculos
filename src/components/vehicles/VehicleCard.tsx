import { ArrowUpRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SourceTag } from "@/components/ui/DemoTag";
import { FeaturedRibbon } from "@/components/vehicles/FeaturedRibbon";
import type { Vehicle } from "@/data/vehicles";
import { formatKm, formatPrice, formatYear } from "@/lib/format";
import { vehicleWhatsappText, whatsappLink } from "@/lib/whatsapp";

interface VehicleCardProps {
  vehicle: Vehicle;
  sizes?: string;
  priority?: boolean;
  /** Proporção da imagem; o destaque da home usa uma versão mais alta. */
  aspect?: string;
  /** Mostra a ação "Consultar" (WhatsApp com a mensagem do veículo) ao lado do preço. */
  contact?: boolean;
}

export function VehicleCard({
  vehicle: v,
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw",
  priority,
  aspect = "aspect-[4/3]",
  contact = false,
}: VehicleCardProps) {
  // O link do título se estende sobre o card inteiro (::after); a ação de contato
  // fica acima dele, como irmã, sem link dentro de link.
  return (
    <article className="surface group relative flex h-full flex-col bg-ink">
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
          className="absolute right-3 bottom-3 grid size-11 translate-y-2 place-items-center bg-ice text-carbon opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-has-[[data-card-link]:focus-visible]:translate-y-0 group-has-[[data-card-link]:focus-visible]:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] w-0 bg-brand transition-[width] duration-700 ease-out-expo group-hover:w-full"
        />
      </div>

      {/* Sem "relative" aqui: o link do título precisa cobrir o card inteiro, foto incluída. */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-fog">{v.brand}</p>
        <h3 className="headline mt-2 text-[1.6rem] uppercase sm:text-[1.75rem]">
          <Link
            href={`/estoque/${v.slug}`}
            data-card-link
            className="after:absolute after:inset-0 after:z-[1] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent focus-visible:after:outline-solid"
            aria-label={`${v.featured ? "Destaque: " : ""}${v.brand} ${v.model} ${v.version}, ${formatYear(v.yearManufacture, v.yearModel)}, ${formatKm(v.km)}, ${formatPrice(v.price)}`}
          >
            {v.model}
          </Link>
        </h3>
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

        {/* Com preços longos o botão desce para a linha de baixo, sem sair do card. */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="spec-value text-[1.45rem] whitespace-nowrap text-ice">{formatPrice(v.price)}</p>
          {contact && (
            <a
              href={whatsappLink(vehicleWhatsappText(v))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar ${v.brand} ${v.model} pelo WhatsApp (abre em nova aba)`}
              className="relative z-[2] ml-auto inline-flex min-h-11 shrink-0 items-center gap-2 border border-white/15 px-3.5 text-[0.7rem] font-semibold tracking-[0.08em] text-mist uppercase transition-colors duration-300 [font-stretch:112%] hover:border-brand hover:bg-brand hover:text-on-brand"
            >
              <MessageCircle className="size-4" aria-hidden />
              Consultar
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
