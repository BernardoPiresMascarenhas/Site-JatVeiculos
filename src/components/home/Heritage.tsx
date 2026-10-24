"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { companyPillars, site } from "@/config/site";

export function Heritage() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section aria-labelledby="historia-title" className="relative py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
              <span className="text-accent">03</span>
              <span aria-hidden className="h-px w-8 bg-current opacity-40" />
              Nossa história
            </p>
            <p aria-hidden className="display text-[clamp(5.5rem,12.5vw,11.5rem)] leading-[0.8] text-accent">
              {site.foundedYear}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col justify-end lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <h2 id="historia-title" className="headline text-[clamp(1.8rem,3.4vw,2.9rem)] uppercase">
              Fundada em {site.foundedLabel}, referência em novos e seminovos, nacionais e importados.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-mist">
              Com atendimento exclusivo e diferenciado e uma estrutura moderna e dinâmica, a JAT Veículos
              garante a procedência de todos os seus veículos. Consultoria total na escolha de um veículo é o
              diferencial da empresa.
            </p>
            <Link href="/empresa" className="btn btn-ghost mt-10">
              Conheça a JAT
              <ArrowRight className="btn-arrow size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>

      <div ref={imageRef} className="shell mt-20 md:mt-28">
        {/* Pilares sobre a foto: escuros nos dois temas */}
        <div data-theme="dark" className="relative aspect-[4/5] overflow-hidden sm:aspect-[21/9]">
          <motion.div style={{ y }} className="absolute -inset-y-[14%] inset-x-0">
            <Image
              src="/images/editorial/taillight.jpg"
              alt="Lanterna traseira acesa de um esportivo em avenida ao entardecer"
              fill
              sizes="(min-width: 1472px) 1360px, 100vw"
              className="object-cover object-[60%_50%]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-carbon/80 via-carbon/20 to-transparent" />
          <ul className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 md:grid-cols-4">
            {companyPillars.map((p, i) => (
              <li key={p.title} className="bg-carbon/75 p-5 backdrop-blur-sm md:p-7">
                <p className="eyebrow text-[0.58rem] text-accent">0{i + 1}</p>
                <p className="headline mt-3 text-[0.95rem] uppercase md:text-lg">{p.title}</p>
                <p className="mt-2 hidden text-sm leading-relaxed text-fog md:block">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
