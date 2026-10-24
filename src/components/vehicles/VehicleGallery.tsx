"use client";

import { ChevronLeft, ChevronRight, Expand, Maximize, Minimize, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Vehicle, VehicleImage } from "@/data/vehicles";

const ease = [0.16, 1, 0.3, 1] as const;

interface Framing {
  image: VehicleImage;
  label: string;
  origin: string;
  zoom: number;
}

/**
 * Fotos reais do anúncio, quando houver. Caso contrário, enquadramentos
 * gerados a partir da mesma fotografia (nunca fotos de outro veículo).
 */
function framingsFor(v: Vehicle): Framing[] {
  if (v.photos?.length) {
    return v.photos.map((image, i) => ({ image, label: image.label ?? `Foto ${i + 1}`, origin: image.focus, zoom: 1 }));
  }
  return [
    { image: v.image, label: "Vista geral", origin: v.image.focus, zoom: 1 },
    { image: v.image, label: "Aproximação", origin: v.image.focus, zoom: 1.35 },
    { image: v.image, label: "Detalhe", origin: v.image.detail, zoom: 2 },
  ];
}

function Frame({ f, sizes, preload }: { f: Framing; sizes: string; preload?: boolean }) {
  return (
    <Image
      src={f.image.src}
      alt={`${f.image.alt} — ${f.label.toLowerCase()}`}
      fill
      sizes={sizes}
      preload={preload}
      style={{ objectPosition: f.image.focus, transform: `scale(${f.zoom})`, transformOrigin: f.origin }}
      className="object-cover"
    />
  );
}

export function VehicleGallery({ vehicle: v }: { vehicle: Vehicle }) {
  const framings = framingsFor(v);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [lightbox, setLightbox] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  // O Chrome não aceita <dialog> em tela cheia: usa-se o contêiner interno.
  const stageRef = useRef<HTMLDivElement>(null);

  // Tela cheia real (Fullscreen API) dentro da galeria ampliada.
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen?.();
  };

  const closeLightbox = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    setLightbox(false);
  };

  const go = (step: number) => setIndex((i) => (i + step + framings.length) % framings.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightbox && !dialog.open) dialog.showModal();
    if (!lightbox && dialog.open) dialog.close();
  }, [lightbox]);

  const onDialogKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  const current = framings[index];
  const many = framings.length > 3;
  const thumbs = useRef<HTMLDivElement>(null);
  const lightboxThumbs = useRef<HTMLDivElement>(null);

  // Mantém a miniatura ativa centralizada na faixa. Rola apenas a própria faixa
  // (scrollIntoView também rolaria a janela e tiraria a página do topo).
  useEffect(() => {
    for (const strip of [thumbs.current, lightboxThumbs.current]) {
      const active = strip?.children[index] as HTMLElement | undefined;
      // Na galeria ampliada, quem rola é o contêiner pai da faixa.
      const scroller = strip && strip.scrollWidth > strip.clientWidth ? strip : strip?.parentElement;
      if (!active || !scroller || scroller.scrollWidth <= scroller.clientWidth) continue;
      const offset = active.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
      const left = scroller.scrollLeft + offset - (scroller.clientWidth - active.clientWidth) / 2;
      scroller.scrollTo({ left, behavior: "smooth" });
    }
  }, [index, lightbox]);

  // Pré-carrega as fotos vizinhas para a troca não piscar.
  const neighbors = many ? [framings[(index + 1) % framings.length], framings[(index - 1 + framings.length) % framings.length]] : [];

  return (
    <div>
      {/*
        3:2 no mobile/tablet. No desktop, altura limitada a 460–550 px conforme o viewport:
        a largura nunca fica menor que a da foto, então o recorte é só vertical
        (frente e traseira do carro permanecem visíveis).
      */}
      <div data-theme="dark" className="group relative aspect-[3/2] w-full overflow-hidden bg-graphite lg:max-h-[clamp(460px,calc(100dvh-18rem),550px)]">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease }}
            className="absolute inset-0"
          >
            <Frame f={current} sizes="(min-width: 1472px) 1360px, 100vw" preload={index === 0} />
          </motion.div>
        </AnimatePresence>
        <div aria-hidden className="pointer-events-none invisible absolute inset-0">
          {neighbors.map((f) => (
            <Frame key={f.image.src + f.label} f={f} sizes="(min-width: 1472px) 1360px, 100vw" />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/50 via-transparent to-transparent" />

        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label={`Ampliar imagem: ${current.label}`}
        />
        <span className="pointer-events-none absolute top-4 right-4 z-10 flex items-center gap-2 bg-carbon/70 px-3 py-2 text-xs text-ice backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <Expand className="size-3.5" aria-hidden /> Ampliar
        </span>

        <div className="absolute right-4 bottom-4 z-20 flex">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Imagem anterior"
            className="grid size-11 place-items-center bg-carbon/70 backdrop-blur-sm transition-colors hover:bg-ice hover:text-carbon"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próxima imagem"
            className="grid size-11 place-items-center bg-carbon/70 backdrop-blur-sm transition-colors hover:bg-ice hover:text-carbon"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
        <p className="eyebrow pointer-events-none absolute bottom-5 left-4 z-10 max-w-[calc(100%-8rem)] truncate text-mist" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(framings.length).padStart(2, "0")} · {current.label}
        </p>
      </div>

      <div ref={thumbs} className="no-scrollbar mt-3 flex gap-3 overflow-x-auto" role="group" aria-label="Miniaturas">
        {framings.map((f, i) => (
          <button
            key={`${f.image.src}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver ${f.label.toLowerCase()}`}
            aria-current={i === index}
            data-theme="dark"
            className={`group relative aspect-[16/9] shrink-0 overflow-hidden bg-graphite ${
              many ? "w-28 sm:w-36" : "w-[calc((100%-1.5rem)/3)]"
            }`}
          >
            <Frame f={f} sizes={many ? "144px" : "(min-width: 1024px) 20vw, 33vw"} />
            <span
              className={`absolute inset-0 transition-colors duration-500 ${
                i === index ? "bg-transparent" : "bg-carbon/55 group-hover:bg-carbon/25"
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand transition-transform duration-500 ease-out-expo ${
                i === index ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-fog">
        {v.photos?.length
          ? "Fotografias do veículo anunciado."
          : "Imagens ilustrativas (Unsplash): enquadramentos de uma única fotografia, não do veículo anunciado."}
      </p>

      <dialog
        ref={dialogRef}
        onClose={closeLightbox}
        onKeyDown={onDialogKey}
        aria-label={`Galeria ampliada: ${v.brand} ${v.model}`}
        data-theme="dark"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-ice"
      >
        {lightbox && (
          <div ref={stageRef} className="relative flex h-full flex-col bg-carbon/95">
            <div className="flex items-center justify-between px-4 py-4 md:px-8">
              <p className="eyebrow text-mist">
                {v.brand} {v.model} · {String(index + 1).padStart(2, "0")} / {String(framings.length).padStart(2, "0")}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="hidden size-11 place-items-center border border-white/20 transition-colors hover:border-brand hover:text-accent sm:grid"
                  aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
                  aria-pressed={fullscreen}
                >
                  {fullscreen ? <Minimize className="size-5" aria-hidden /> : <Maximize className="size-5" aria-hidden />}
                </button>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="grid size-11 place-items-center border border-white/20 transition-colors hover:bg-ice hover:text-carbon"
                  aria-label="Fechar galeria"
                  autoFocus
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <AnimatePresence initial={false}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 overflow-hidden"
                >
                  <Image
                    src={current.image.src}
                    alt={`${current.image.alt} — ${current.label.toLowerCase()}`}
                    fill
                    sizes="100vw"
                    style={{ transform: `scale(${current.zoom})`, transformOrigin: current.origin }}
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Imagem anterior"
                className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center bg-carbon/70 transition-colors hover:bg-ice hover:text-carbon md:left-6"
              >
                <ChevronLeft className="size-6" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima imagem"
                className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center bg-carbon/70 transition-colors hover:bg-ice hover:text-carbon md:right-6"
              >
                <ChevronRight className="size-6" aria-hidden />
              </button>
            </div>
            {many ? (
              <div className="no-scrollbar overflow-x-auto px-4 py-4 md:px-8">
                {/* w-max + mx-auto: centraliza quando cabe e rola desde o início quando não cabe */}
                <div ref={lightboxThumbs} className="mx-auto flex w-max gap-2">
                {framings.map((f, i) => (
                  <button
                    key={f.image.src + f.label}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ver foto ${i + 1}: ${f.label.toLowerCase()}`}
                    aria-current={i === index}
                    className="relative aspect-[3/2] w-16 shrink-0 overflow-hidden opacity-45 transition-opacity hover:opacity-80 aria-[current=true]:opacity-100 aria-[current=true]:outline aria-[current=true]:outline-1 aria-[current=true]:outline-brand md:w-20"
                  >
                    <Image src={f.image.src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-2 py-5">
                {framings.map((f, i) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ver ${f.label.toLowerCase()}`}
                    aria-current={i === index}
                    className="eyebrow px-3 py-2 text-fog transition-colors hover:text-ice aria-[current=true]:text-ice"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
