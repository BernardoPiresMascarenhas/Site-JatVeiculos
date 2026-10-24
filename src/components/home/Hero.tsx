"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { site } from "@/config/site";

const ease = [0.16, 1, 0.3, 1] as const;

const lines = ["Performance,", "elegância e"];

/** Credenciais institucionais conferidas no site oficial. */
const credentials = [
  { value: String(site.foundedYear), label: "Fundada em maio" },
  { value: "Consultoria", label: "Total na escolha do veículo" },
  { value: "Financiamento", label: "Com os melhores bancos" },
];

interface HeroProps {
  image: { src: string; alt: string };
  /** Legenda discreta; indica quando a foto é ilustrativa. */
  caption?: string;
}

function Line({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <span className="-mt-[0.16em] block overflow-hidden pt-[0.16em] pb-[0.06em]">
      <motion.span
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.15, delay: 0.75 + index * 0.1, ease }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ image, caption }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      // Cinematográfico: escuro nos dois temas.
      data-theme="dark"
      className="relative isolate flex flex-col overflow-hidden bg-carbon xl:min-h-[100svh]"
    >
      {/* Fotografia: topo no mobile; ~3/4 direitos no desktop */}
      <div className="relative aspect-[6/5] w-full overflow-hidden sm:aspect-[16/10] xl:absolute xl:inset-y-0 xl:right-0 xl:left-[24%] xl:aspect-auto xl:w-auto">
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.12, opacity: 0, filter: "brightness(0.35)" }}
            animate={{ scale: 1, opacity: 1, filter: "brightness(1)" }}
            transition={{ duration: 2.2, ease }}
            className="absolute inset-0"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              sizes="(min-width: 1280px) 76vw, 100vw"
              className="object-cover object-[54%_60%] [filter:contrast(1.06)_saturate(0.92)_brightness(0.92)] xl:object-[74%_58%]"
            />
          </motion.div>
        </motion.div>

        {/* Gradação leve: só funde a foto ao fundo, sem apagar o carro */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-carbon/80 to-transparent xl:h-40" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-carbon to-transparent xl:h-1/3" />
        <div aria-hidden className="absolute inset-y-0 left-0 hidden w-[42%] bg-gradient-to-r from-carbon via-carbon/60 to-transparent xl:block" />

        {caption && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="eyebrow absolute right-4 bottom-4 max-w-[15rem] text-right text-[0.58rem] leading-relaxed text-mist/80 sm:max-w-none sm:right-6 xl:right-[clamp(1rem,4vw,3.5rem)] xl:bottom-9"
          >
            <span aria-hidden className="mr-2 mb-px inline-block size-1.5 bg-brand align-middle" />
            {caption}
          </motion.p>
        )}
      </div>

      {/* Conteúdo */}
      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="shell relative flex flex-1 flex-col pt-4 pb-16 sm:pt-10 xl:justify-center xl:pt-28 xl:pb-24"
      >
        <div className="max-w-[30rem] xl:max-w-[32rem]">
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease }}
            className="eyebrow flex items-center gap-3 text-mist"
          >
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease }}
              className="h-px w-8 origin-left bg-brand"
            />
            <span>
              Nacionais e importados · desde <span className="text-accent">{site.foundedYear}</span>
            </span>
          </motion.p>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.25rem,4.3vw,4.15rem)] leading-[1.02] font-bold tracking-[-0.03em] [font-stretch:112%] xl:mt-8"
          >
            {lines.map((text, i) => (
              <Line key={text} index={i}>
                {text}
              </Line>
            ))}
            <Line index={lines.length}>
              <span className="relative inline-block">
                procedência
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.5, ease }}
                  className="absolute right-0 bottom-[0.02em] left-0 h-[2px] origin-left bg-brand/90"
                />
              </span>
              <span className="text-accent">.</span>
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease }}
            className="mt-6 max-w-[24rem] text-[0.98rem] leading-[1.7] text-mist xl:mt-7"
          >
            Novos e seminovos de alta qualidade e procedência, com consultoria total na escolha do seu veículo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.35, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/estoque" className="btn btn-primary min-h-[3.1rem] px-6">
              Explorar estoque
              <ArrowRight className="btn-arrow size-4" aria-hidden />
            </Link>
            <Link href="/empresa" className="btn btn-ghost min-h-[3.1rem] px-6 hover:border-brand/70 hover:text-accent">
              Conheça a JAT
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.6 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 xl:mt-12"
          >
            {credentials.map((c) => (
              <div key={c.value}>
                <span aria-hidden className="mb-3 block h-px w-5 bg-brand" />
                <dt className="sr-only">{c.label}</dt>
                <dd>
                  <span className="block text-sm font-semibold text-ice [font-stretch:110%]">{c.value}</span>
                  <span className="eyebrow mt-1.5 block text-[0.55rem] leading-relaxed text-fog">{c.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* Indicação de rolagem (desktop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.9 }}
        className="shell pointer-events-none absolute inset-x-0 bottom-8 hidden xl:block"
      >
        <a
          href="#busca"
          aria-label="Rolar para a busca de veículos"
          className="eyebrow pointer-events-auto inline-flex items-center gap-4 text-fog transition-colors hover:text-ice"
        >
          <span aria-hidden className="relative h-10 w-px overflow-hidden bg-white/15">
            <span className="scroll-cue-line absolute inset-0 bg-brand" />
          </span>
          Role para explorar
        </a>
      </motion.div>
    </section>
  );
}
