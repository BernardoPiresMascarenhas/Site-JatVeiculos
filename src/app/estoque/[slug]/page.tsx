import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleContactCard } from "@/components/vehicles/VehicleContactCard";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { getVehicle, relatedVehicles, vehicleName, vehicles } from "@/data/vehicles";
import { formatKm, formatNumber, formatPrice, formatYear } from "@/lib/format";
import { vehicleWhatsappText, whatsappLink } from "@/lib/whatsapp";

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/estoque/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) return { title: "Veículo não encontrado" };
  const title = `${vehicleName(v)} ${v.version} ${formatYear(v.yearManufacture, v.yearModel)}`;
  return {
    title,
    description: `${title} — ${[formatKm(v.km), v.fuel, v.transmission].filter(Boolean).join(", ")}. ${v.source.kind === "demo" ? "Veículo demonstrativo do conceito de showroom digital da JAT Veículos." : "Anúncio do estoque da JAT Veículos."}`,
    alternates: { canonical: `/estoque/${v.slug}` },
    openGraph: { title, images: [{ url: v.image.src, width: v.image.width, height: v.image.height, alt: v.image.alt }] },
  };
}

export default async function VehiclePage({ params }: PageProps<"/estoque/[slug]">) {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) notFound();

  const keySpecs = [
    { label: "Ano", value: formatYear(v.yearManufacture, v.yearModel) },
    { label: "Quilometragem", value: formatNumber(v.km), unit: "km" },
    { label: "Combustível", value: v.fuel },
    v.transmission ? { label: "Câmbio", value: v.transmission } : { label: "Tipo", value: v.body },
  ];

  const sheet = [
    { label: "Marca", value: v.brand },
    { label: "Modelo", value: v.model },
    { label: "Versão", value: v.version },
    { label: "Ano fabricação / modelo", value: `${v.yearManufacture} / ${v.yearModel}` },
    ...(v.engine ? [{ label: "Motor", value: v.engine }] : []),
    ...(v.power ? [{ label: "Potência", value: v.power }] : []),
    ...(v.acceleration ? [{ label: "0–100 km/h", value: v.acceleration }] : []),
    { label: "Carroceria", value: v.body },
    { label: "Cor", value: v.color },
    { label: "Quilometragem", value: formatKm(v.km) },
  ];

  const related = relatedVehicles(v);

  return (
    <article>
      {/* Abertura: identificação imediata do veículo */}
      <header className="pt-24 md:pt-28">
        <div className="shell">
          <nav aria-label="Trilha" className="eyebrow flex items-center gap-3 text-fog">
            <Link href="/estoque" className="group flex items-center gap-2 transition-colors hover:text-ice">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden />
              Estoque
            </Link>
            <span aria-hidden>/</span>
            <span className="text-mist">{v.brand}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-4 md:mt-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0">
              <p className="eyebrow text-accent">{v.brand}</p>
              <h1 className="display mt-3 text-[clamp(2.6rem,6vw,5.5rem)]">{v.model}</h1>
              <p className="headline mt-3 text-lg text-mist uppercase md:text-xl">{v.version}</p>
            </div>
            <div className="shrink-0 lg:pb-1 lg:text-right">
              <p className="eyebrow text-fog">
                {v.source.kind === "demo" ? "Valor de referência · demonstrativo" : "Preço anunciado"}
              </p>
              <p className="spec-value mt-2 text-[clamp(1.9rem,3.4vw,2.75rem)] leading-none">{formatPrice(v.price)}</p>
            </div>
          </div>
        </div>
      </header>

      {/*
        Desktop: galeria + resumo à esquerda, contato fixo à direita.
        Mobile: galeria → resumo → contato → detalhes (ordem do DOM).
      */}
      <div className="shell mt-6 grid gap-y-10 md:mt-8 lg:grid-cols-12 lg:gap-x-10">
        <div className="min-w-0 lg:col-span-8 lg:row-start-1">
          <VehicleGallery vehicle={v} />

          <section aria-label="Resumo" className="mt-6">
            <dl className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
              {keySpecs.map((s) => (
                <div key={s.label} className="bg-carbon px-4 py-4 md:px-5 md:py-5">
                  <dt className="eyebrow text-[0.6rem] text-fog">{s.label}</dt>
                  <dd className="spec-value mt-2 text-[clamp(1.15rem,1.8vw,1.5rem)] leading-tight">
                    {s.value}
                    {s.unit && <span className="ml-1 text-sm text-fog">{s.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside aria-label="Contato" className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-[calc(6rem+env(safe-area-inset-top))]">
            <VehicleContactCard vehicle={v} />
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8 lg:row-start-2">
          <Reveal>
            <h2 className="eyebrow flex items-center gap-3 text-fog">
              <span aria-hidden className="h-px w-8 bg-brand" />
              Sobre o veículo
            </h2>
            <p className="headline mt-4 text-[clamp(1.25rem,2vw,1.7rem)] leading-snug">{v.description}</p>
          </Reveal>

          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
            <Reveal>
              <h2 className="eyebrow text-fog">Itens de destaque</h2>
              <ul className="mt-4 grid gap-2">
                {v.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 border border-white/10 px-4 py-3 text-sm text-mist">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="eyebrow text-fog">Ficha técnica</h2>
              <dl className="mt-4 border-t border-white/10">
                {sheet.map((row) => (
                  <div key={row.label} className="grid grid-cols-2 gap-4 border-b border-white/10 py-3 text-sm">
                    <dt className="text-fog">{row.label}</dt>
                    <dd className="text-right text-ice">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      <section aria-labelledby="relacionados-title" className="mt-20 border-t border-white/[0.07] py-16 md:mt-24 md:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="relacionados-title" className="display text-[clamp(2rem,5vw,4rem)]">
              Você também
              <br />
              pode gostar
            </h2>
            <Link href="/estoque" className="btn btn-ghost">
              Ver todo o estoque
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <li key={r.slug}>
                <Reveal delay={i * 0.08} className="h-full">
                  <VehicleCard vehicle={r} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Barra fixa no mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-white/10 bg-carbon/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-xs text-fog">
            {vehicleName(v)}
            {v.source.kind === "demo" && " · demonstrativo"}
          </p>
          <p className="spec-value text-lg">{formatPrice(v.price)}</p>
        </div>
        <a
          href={whatsappLink(vehicleWhatsappText(v))}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary min-h-12 shrink-0 px-5"
        >
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp
        </a>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </article>
  );
}
