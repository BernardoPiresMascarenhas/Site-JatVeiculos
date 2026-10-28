import { ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Services } from "@/components/home/Services";
import { PendingPhoto } from "@/components/media/PendingPhoto";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { site } from "@/config/site";
import { type ResolvedMedia, resolveMedia } from "@/lib/media";
import { whatsappLink } from "@/lib/whatsapp";

/** Foto real da loja (preenche o quadro), ou o local reservado para ela. */
function StorePhoto({ media, title, sizes, className }: { media: ResolvedMedia; title: string; sizes: string; className: string }) {
  if (media.status !== "real") return <PendingPhoto slot={media.slot} title={title} className={className} />;
  return (
    <RevealImage className={className}>
      <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />
    </RevealImage>
  );
}

/** Rótulo numerado de cada capítulo da página. */
function Chapter({ index, label }: { index: string; label: string }) {
  return (
    <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
      <span className="text-accent">{index}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      {label}
    </p>
  );
}

/*
 * Fotografias reais da loja que não aparecem na home (a home usa os stories
 * do Instagram e imagens editoriais).
 */
const selectionImage = {
  src: "/images/jat/salao-porsche-volante.jpg",
  alt: "Volante de um Porsche no salão da JAT Veículos, com um conversível ao fundo",
};
const relationshipImage = {
  // Cópia de public/imagensTeste/Imagem ChatGPT 23_10_2026, 23_26_28.jpg (mesmo lote dos stories da loja).
  src: "/images/jat/salao-mustang.jpg",
  alt: "Lateral de um Ford Mustang Mach 1 laranja no salão da JAT Veículos, com o cavalo do logotipo projetado no piso",
};

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

      {/* 01 · História: só fatos publicados pela JAT (fundação em maio de 1995). */}
      <section aria-labelledby="historia-title" className="py-24 md:py-36">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Chapter index="01" label="História" />
              <h2 id="historia-title" className="display text-[clamp(2.4rem,5.6vw,5rem)]">
                Referência
                <br />
                desde <span className="text-accent">1995</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="flex items-end lg:col-span-6 lg:col-start-7">
              <p className="headline text-[clamp(1.35rem,2.4vw,2.1rem)] leading-[1.15]">
                Fundada em {site.foundedLabel}, a JAT Veículos é referência em novos e seminovos, nacionais e
                importados <span className="text-fog">de alta qualidade e procedência.</span>
              </p>
            </Reveal>
          </div>

          <dl className="mt-16 grid gap-px border-y border-white/10 bg-white/10 sm:grid-cols-3 md:mt-20">
            {[
              { label: "Fundação", value: site.foundedLabel },
              { label: "Veículos", value: "Novos e seminovos, nacionais e importados" },
              { label: "Endereço", value: `${site.address.street}, ${site.address.district}` },
            ].map((fact, i) => (
              <Reveal key={fact.label} delay={i * 0.07} y={16} className="bg-carbon py-6 sm:px-6 sm:first:pl-0 md:py-8">
                <dt className="eyebrow text-[0.62rem] text-fog">{fact.label}</dt>
                <dd className="headline mt-3 text-lg leading-snug uppercase md:text-xl">{fact.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 02 · Estrutura: fachada panorâmica + showroom vertical */}
      <section aria-labelledby="estrutura-title" className="pb-24 md:pb-36">
        <div className="shell grid gap-5 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-8">
            <StorePhoto media={storefront} title="Fachada" sizes="(min-width: 1024px) 64vw, 100vw" className="aspect-[1158/528]" />
            <Reveal className="mt-12 grid gap-8 md:mt-16 md:grid-cols-8">
              <div className="md:col-span-4">
                <Chapter index="02" label="Estrutura" />
                <h2 id="estrutura-title" className="display text-[clamp(2.2rem,3.6vw,3.4rem)]">
                  <span className="whitespace-nowrap">Moderna e</span>
                  <br />
                  dinâmica
                </h2>
              </div>
              <div className="space-y-4 leading-relaxed text-mist md:col-span-4 md:pt-10">
                <p>Atendimento exclusivo e diferenciado, em uma estrutura moderna e dinâmica.</p>
                <p className="text-sm text-fog">
                  {site.address.full}.
                  <br />
                  {site.contact.hours}.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            <StorePhoto
              media={showroom}
              title="Showroom"
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[36rem]"
            />
          </div>
        </div>
      </section>

      {/* 03 · Seleção: procedência e consultoria */}
      <section aria-labelledby="selecao-title" className="border-t border-white/[0.07] py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-8">
          <div className="lg:col-span-6">
            <Reveal>
              <Chapter index="03" label="Seleção" />
              <h2 id="selecao-title" className="display text-[clamp(2.2rem,4.6vw,4rem)]">
                Procedência
                <br />
                garantida
              </h2>
              <p className="mt-8 max-w-md leading-relaxed text-mist">
                A JAT garante a procedência de todos os seus veículos, nacionais e importados.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-12 border-l-2 border-brand pl-6 md:mt-16 md:pl-8">
              <blockquote>
                <p className="headline text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.15] uppercase">
                  “Consultoria total na escolha de um veículo é o diferencial da nossa empresa.”
                </p>
                <footer className="eyebrow mt-5 text-fog">JAT Veículos · página institucional</footer>
              </blockquote>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-fog">
                Profissionais altamente qualificados esclarecem quaisquer dúvidas sobre características, acessórios,
                modelos e equipamentos.
              </p>
            </Reveal>
          </div>
          <RevealImage className="aspect-[4/5] lg:col-span-5 lg:col-start-8" delay={0.05}>
            <Image src={selectionImage.src} alt={selectionImage.alt} fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
          </RevealImage>
        </div>
      </section>

      {/* 04 · Atendimento: pós-venda e relacionamento */}
      <section aria-labelledby="atendimento-title" className="pb-24 md:pb-36">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <RevealImage className="order-last aspect-[4/5] sm:aspect-[16/10] lg:order-none lg:col-span-5 lg:aspect-[4/5]">
            <Image
              src={relationshipImage.src}
              alt={relationshipImage.alt}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[50%_60%]"
            />
          </RevealImage>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Chapter index="04" label="Atendimento" />
              <h2 id="atendimento-title" className="display text-[clamp(2.2rem,4.6vw,4rem)]">
                Além da
                <br />
                venda
              </h2>
              <p className="mt-8 max-w-lg leading-relaxed text-mist">
                Quem escolhe a JAT não está apenas adquirindo um veículo de qualidade: passa a fazer parte de uma
                família que respeita o cliente.
              </p>
            </Reveal>
            <ul className="mt-12 grid gap-px border-y border-white/10 bg-white/10 sm:grid-cols-2">
              {[
                {
                  title: "Pós-venda",
                  body: "Alto padrão de serviços, pós-venda e bom relacionamento justificam o elevado índice de satisfação e confiança dos clientes.",
                },
                {
                  title: "Evolução",
                  body: "Com seriedade e competência, a JAT está sempre procurando agregar serviços para melhorar a satisfação dos clientes.",
                },
              ].map((item, i) => (
                <li key={item.title} className="bg-carbon py-6 sm:px-6 sm:first:pl-0 md:py-8">
                  <Reveal delay={0.06 + i * 0.07} y={16}>
                    <p className="headline text-lg uppercase">{item.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fog">{item.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
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
