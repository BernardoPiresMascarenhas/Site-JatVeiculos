"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { SourceTag } from "@/components/ui/DemoTag";
import { showroomVehicles } from "@/data/vehicles";
import { formatKm, formatPrice, formatYear } from "@/lib/format";

const ease = [0.16, 1, 0.3, 1] as const;
const wipe = [0.76, 0, 0.24, 1] as const;

export function Showroom() {
  const items = showroomVehicles;
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  // Aquece o cache das fotos antes do primeiro clique, evitando o palco vazio na transição.
  const warm = useInView(sectionRef, { once: true, margin: "600px 0px" });
  const v = items[index];

  const go = (next: number, focus = false) => {
    const target = (next + items.length) % items.length;
    setState([target, next > index ? 1 : -1]);
    if (focus) tabs.current[target]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(index + 1, true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(index - 1, true);
    }
  };

  const specs = [
    { label: "Ano", value: formatYear(v.yearManufacture, v.yearModel) },
    { label: "Quilometragem", value: formatKm(v.km) },
    { label: "Combustível", value: v.fuel },
  ];

  return (
    <section ref={sectionRef} aria-labelledby="showroom-title" className="relative overflow-hidden bg-ink pt-24 pb-32 md:pt-32 md:pb-48">
      {/* Nome gigante ao fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-[28%] select-none">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={v.slug}
            initial={{ x: `${direction * 12}%`, opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: `${direction * -12}%`, opacity: 0 }}
            transition={{ duration: 1.1, ease }}
            className="display text-outline text-center text-[clamp(7rem,26vw,24rem)] whitespace-nowrap"
          >
            {v.model}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
              <span className="text-accent">02</span>
              <span aria-hidden className="h-px w-8 bg-current opacity-40" />
              Seleção interativa
            </p>
            <h2 id="showroom-title" className="display text-[clamp(2.4rem,6.2vw,5.5rem)]">
              Showroom
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="eyebrow tabular-nums text-fog" aria-live="polite">
              <span className="text-ice">{String(index + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
            </p>
            <div className="flex">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Veículo anterior"
                className="grid size-12 place-items-center border border-white/15 transition-colors hover:border-ice hover:bg-white/5"
              >
                <ArrowLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Próximo veículo"
                className="-ml-px grid size-12 place-items-center border border-white/15 transition-colors hover:border-ice hover:bg-white/5"
              >
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* Palco */}
          <div
            id="showroom-panel"
            role="tabpanel"
            aria-labelledby={`showroom-tab-${index}`}
            data-theme="dark"
            className="relative aspect-[4/3] min-w-0 overflow-hidden bg-graphite sm:aspect-[16/10] lg:col-span-8 lg:aspect-auto lg:min-h-[34rem]"
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={v.slug}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", zIndex: 1 }),
                  center: { clipPath: "inset(0 0 0 0%)", zIndex: 1 },
                  // A imagem anterior permanece por baixo enquanto a nova entra.
                  exit: { zIndex: 0, transition: { duration: 1 } },
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 1, ease: wipe }}
                className="absolute inset-0"
              >
                <motion.div
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease }}
                  className="absolute inset-0"
                >
                  <Image
                    src={v.image.src}
                    alt={v.image.alt}
                    fill
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    style={{ objectPosition: v.image.focus }}
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            <SourceTag source={v.source} className="absolute top-4 left-4 z-10" />
            {warm && (
              <div aria-hidden className="pointer-events-none invisible absolute inset-0">
                {items.map((item) =>
                  item.slug === v.slug ? null : (
                    <Image key={item.slug} src={item.image.src} alt="" fill loading="eager" sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover" />
                  ),
                )}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="flex min-w-0 flex-col lg:col-span-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={v.slug}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
                  exit: { opacity: 0, transition: { duration: 0.2 } },
                }}
              >
                {[
                  <p key="brand" className="eyebrow text-fog">{v.brand}</p>,
                  <h3
                    key="model"
                    className={`display mt-3 ${
                      // Nomes longos (ex.: Cybertruck) precisam caber na coluna estreita.
                      v.model.replace(/\s/g, "").length > 6 ? "text-[clamp(1.9rem,2.9vw,2.6rem)]" : "text-[clamp(2.4rem,5vw,4rem)]"
                    }`}
                  >
                    {v.model}
                  </h3>,
                  <p key="version" className="mt-2 text-mist">{v.version}</p>,
                  <p key="tagline" className="headline mt-8 text-xl text-balance text-ice/90">“{v.showroom?.tagline}”</p>,
                  <dl key="specs" className="mt-10 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
                    {specs.map((s) => (
                      <div key={s.label}>
                        <dt className="eyebrow text-[0.58rem] text-fog">{s.label}</dt>
                        <dd className="spec-value mt-2 text-lg">{s.value}</dd>
                      </div>
                    ))}
                  </dl>,
                  <div key="cta" className="mt-8 flex flex-wrap items-center justify-between gap-5">
                    <p className="spec-value text-2xl">{formatPrice(v.price)}</p>
                    <Link href={`/estoque/${v.slug}`} className="btn btn-light">
                      Apresentação
                      <ArrowUpRight className="btn-arrow size-4" aria-hidden />
                    </Link>
                  </div>,
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
                  >
                    {node}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Seletor */}
            <div
              role="tablist"
              aria-label="Veículos do showroom"
              onKeyDown={onKeyDown}
              className="no-scrollbar mt-auto -mx-4 flex gap-2 overflow-x-auto px-4 pt-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0"
            >
              {items.map((item, i) => (
                <button
                  key={item.slug}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`showroom-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-controls="showroom-panel"
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => go(i)}
                  className="group relative w-24 shrink-0 text-left lg:w-auto"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-graphite">
                    <Image
                      src={item.image.src}
                      alt=""
                      fill
                      sizes="96px"
                      style={{ objectPosition: item.image.focus }}
                      className={`object-cover transition-all duration-700 ${
                        i === index ? "opacity-100 grayscale-0" : "opacity-45 grayscale group-hover:opacity-80"
                      }`}
                    />
                  </span>
                  <span className="relative mt-2 block h-px bg-white/15">
                    {i === index && (
                      <motion.span layoutId="showroom-indicator" className="absolute inset-0 bg-brand" />
                    )}
                  </span>
                  <span className={`eyebrow mt-2 block truncate text-[0.58rem] ${i === index ? "text-ice" : "text-fog"}`}>
                    {item.model}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
