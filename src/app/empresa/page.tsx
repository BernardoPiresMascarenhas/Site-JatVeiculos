import { ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Services } from "@/components/home/Services";
import { PendingPhoto } from "@/components/media/PendingPhoto";
import { Reveal } from "@/components/ui/Reveal";
import { companyPillars, site } from "@/config/site";
import { type ResolvedMedia, resolveMedia } from "@/lib/media";
import { whatsappLink } from "@/lib/whatsapp";

/** Foto real da loja, ou o local reservado para ela. */
function StorePhoto({ media, title, sizes, className }: { media: ResolvedMedia; title: string; sizes: string; className: string }) {
  if (media.status !== "real") return <PendingPhoto slot={media.slot} title={title} className={className} />;
  return (
    <div className={`relative overflow-hidden bg-graphite ${className}`}>
      <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/**
 * Foto abaixo da citação "Consultoria total…". Os stories são verticais e o
 * quadro é 16:9: `position` escolhe a faixa visível da foto.
 * Para trocar, substitua por uma das opções abaixo.
 */
const quoteImage = {
  src: "/images/jat/instagram/story-06.jpg",
  alt: "Frente de um BMW preto no salão da JAT Veículos",
  position: "50% 66%",
};
// Opções testadas:
// - Anterior (ilustrativa, Unsplash): { src: "/images/editorial/driver.jpg", alt: "Motorista ao volante de um carro dirigindo pela cidade ao entardecer", position: "50% 50%" }
// - Story 7 (BMWs no salão): { src: "/images/jat/instagram/story-07.jpg", alt: "BMWs pretos no salão da JAT Veículos", position: "50% 38%" }

export const metadata: Metadata = {
  title: "A JAT",
  description: `Fundada em ${site.foundedLabel}, a JAT Veículos é referência em novos e seminovos, nacionais e importados de alta qualidade e procedência.`,
  alternates: { canonical: "/empresa" },
};

export default function EmpresaPage() {
  const facade = resolveMedia("facade");
  const storefront = resolveMedia("storefront");
  const showroom = resolveMedia("showroom");
  const opening = facade.status === "pending" ? null : facade;

  return (
    <>
      {/* Abertura (escura nos dois temas) */}
      <section data-theme="dark" className="relative isolate flex min-h-[88svh] items-end overflow-hidden pt-36 pb-16 md:pb-24">
        {opening && (
          <Image src={opening.src} alt={opening.alt} fill preload sizes="100vw" className="-z-10 object-cover object-[50%_45%]" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-carbon/60 to-carbon/30" />
        {facade.status === "fallback" && (
          <p className="eyebrow absolute right-[clamp(1rem,4vw,3.5rem)] bottom-6 hidden text-[0.62rem] text-fog/80 md:block">
            {facade.caption}
          </p>
        )}
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3 text-mist">
              <span aria-hidden className="h-px w-8 bg-brand" />A JAT Veículos
            </p>
            <h1 className="display text-[clamp(3rem,9.5vw,9rem)]">
              Desde
              <br />
              maio de <span className="text-accent">1995</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow text-fog">História</p>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-9">
            <p className="headline text-[clamp(1.7rem,3.6vw,3.2rem)] leading-[1.08]">
              Fundada em {site.foundedLabel}, a JAT Veículos é referência em novos e seminovos, nacionais e
              importados <span className="text-fog">de alta qualidade e procedência.</span>
            </p>
            <div className="mt-10 max-w-2xl space-y-5 leading-relaxed text-mist">
              <p>
                Oferecendo atendimento exclusivo e diferenciado, com uma estrutura moderna e dinâmica, a JAT
                garante a procedência de todos os seus veículos.
              </p>
              <p>
                A empresa conta com profissionais altamente qualificados para esclarecer quaisquer dúvidas
                quanto a características, acessórios, modelos e equipamentos, e está preparada para prestar
                todos os serviços necessários para compra, venda, consignação e financiamento do seu veículo.
              </p>
              <p>
                Por meio de parcerias com os melhores bancos do mercado, apresenta aos clientes as melhores
                taxas de financiamento e leasing para automóveis. Com seriedade e competência, está sempre
                procurando agregar serviços para melhorar a satisfação dos seus clientes.
              </p>
              <p>
                O alto padrão de serviços, o pós-venda e o bom relacionamento justificam o elevado índice de
                satisfação e confiança dos clientes. Quem escolhe a JAT Veículos não está apenas adquirindo um
                veículo de qualidade, mas passa a fazer parte de uma família que respeita o cliente.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* A loja: fotografias reais da fachada e do showroom */}
      <section aria-labelledby="loja-title" className="pb-24 md:pb-36">
        <div className="shell">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
            <h2 id="loja-title" className="display text-[clamp(2.2rem,5.5vw,4.8rem)]">
              A loja
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-fog">
              {site.address.full}. {site.contact.hours}.
            </p>
          </Reveal>
          {/* A fachada é panorâmica: no desktop o showroom acompanha a altura dela. */}
          <div className="grid gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <StorePhoto media={storefront} title="Fachada" sizes="(min-width: 1024px) 64vw, 100vw" className="aspect-[1158/528]" />
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-4">
              <StorePhoto media={showroom} title="Showroom" sizes="(min-width: 1024px) 32vw, 100vw" className="aspect-[4/5] lg:aspect-auto lg:h-full" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Citação + imagens */}
      <section className="pb-24 md:pb-36">
        <div className="shell grid gap-5 md:grid-cols-12">
          <Reveal className="relative aspect-[4/5] overflow-hidden md:col-span-5 md:aspect-auto md:min-h-[38rem]">
            <Image
              src="/images/jat/salao-porsche-volante.jpg"
              alt="Volante de um Porsche no salão da JAT Veículos, com um conversível ao fundo"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <div className="flex flex-col gap-5 md:col-span-7">
            <Reveal delay={0.08} className="flex flex-1 flex-col justify-center bg-ice p-8 text-carbon md:p-14">
              <blockquote>
                <p className="display text-[clamp(1.7rem,3.4vw,3rem)] leading-[0.95]">
                  “Consultoria total na escolha de um veículo é o diferencial da nossa empresa.”
                </p>
                <footer className="eyebrow mt-8 text-smoke">JAT Veículos · página institucional</footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.14} className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={quoteImage.src}
                alt={quoteImage.alt}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                style={{ objectPosition: quoteImage.position }}
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Posicionamento */}
      <section aria-labelledby="posicionamento-title" className="border-t border-white/[0.07] py-24 md:py-36">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
              <span aria-hidden className="h-px w-8 bg-brand" />
              Posicionamento
            </p>
            <h2 id="posicionamento-title" className="display text-[clamp(2.4rem,6.2vw,5.5rem)]">
              O que nos
              <br />
              move
            </h2>
          </Reveal>
          <ol className="mt-16 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {companyPillars.map((p, i) => (
              <li key={p.title} className="bg-carbon">
                <Reveal delay={i * 0.07} className="flex h-full flex-col p-7 md:p-9">
                  <span className="display text-7xl leading-none text-accent">{i + 1}</span>
                  <p className="headline mt-10 text-xl uppercase">{p.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-fog">{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Services index="" />

      {/* Chamada final (escura nos dois temas) */}
      <section data-theme="dark" className="relative isolate overflow-hidden py-28 md:py-40">
        <Image
          src="/images/editorial/hangar.jpg"
          alt="Esportivo escuro iluminado por luzes de piso vermelhas em um galpão"
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[50%_60%]"
        />
        <div className="absolute inset-0 -z-10 bg-carbon/70" />
        <div className="shell text-center">
          <Reveal>
            <h2 className="display text-[clamp(2.4rem,7vw,6.5rem)]">
              Venha conhecer
              <br />a loja
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-mist">
              Venha nos fazer uma visita e conhecer as melhores opções do mercado de automóveis.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-fog">
              {site.address.full}. {site.contact.hours}.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={whatsappLink("Olá, JAT! Gostaria de agendar uma visita à loja.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle className="size-4" aria-hidden />
                Agendar pelo WhatsApp
              </a>
              <Link href="/estoque" className="btn btn-ghost">
                Explorar estoque
                <ArrowRight className="btn-arrow size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
