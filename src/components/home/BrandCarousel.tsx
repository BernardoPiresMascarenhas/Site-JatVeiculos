"use client";

import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export interface BrandItem {
  name: string;
  count: number;
  href: string;
  mark:
    | { kind: "icon"; path: string; viewBox: string; width: number; height: number }
    | { kind: "file"; src: string }
    | { kind: "text" };
}

/** px por segundo: movimento lento, quase ambiente. */
const SPEED = 26;
/** Depois de um toque ou rolagem manual, espera antes de retomar. */
const RESUME_AFTER = 2500;

function Mark({ item }: { item: BrandItem }) {
  const { mark } = item;
  if (mark.kind === "icon") {
    return (
      <svg viewBox={mark.viewBox} width={mark.width} height={mark.height} fill="currentColor" aria-hidden>
        <path d={mark.path} />
      </svg>
    );
  }
  if (mark.kind === "file") {
    return (
      <span className="relative block h-11 w-28">
        <Image src={mark.src} alt="" fill sizes="112px" className="object-contain [filter:grayscale(1)_brightness(0)_invert(1)] light:[filter:grayscale(1)_brightness(0)]" />
      </span>
    );
  }
  return <span className="text-[0.95rem] font-semibold tracking-[0.14em] uppercase [font-stretch:112%]">{item.name}</span>;
}

function BrandLink({ item, hidden }: { item: BrandItem; hidden?: boolean }) {
  return (
    <li className={`shrink-0 ${hidden ? "motion-reduce:hidden" : ""}`} aria-hidden={hidden || undefined}>
      <Link
        href={item.href}
        tabIndex={hidden ? -1 : undefined}
        aria-label={`${item.name}: ver ${item.count} ${item.count === 1 ? "veículo" : "veículos"} no estoque`}
        className="group flex h-32 w-40 flex-col items-center justify-center gap-4 border-r border-white/[0.07] text-mist/70 transition-colors duration-500 hover:bg-white/[0.03] hover:text-ice focus-visible:text-ice md:w-48"
      >
        <span className="flex h-11 items-center transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5">
          <Mark item={item} />
        </span>
        <span className="eyebrow flex items-center gap-2 text-[0.58rem] text-fog transition-colors group-hover:text-mist">
          {item.name}
          <span className="text-smoke group-hover:text-accent">{String(item.count).padStart(2, "0")}</span>
        </span>
      </Link>
    </li>
  );
}

/**
 * Faixa horizontal de marcas com rolagem automática lenta.
 * Pausa com mouse, foco ou toque; no celular pode ser arrastada.
 * Com prefers-reduced-motion, vira uma faixa estática rolável.
 */
export function BrandCarousel({ items }: { items: BrandItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: "100px" });
  const auto = reduced === false;
  const state = useRef({ pos: 0, paused: false, lastInteraction: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !auto || !inView) return;
    let frame = 0;
    let last = performance.now();
    state.current.pos = el.scrollLeft;

    const tick = (now: number) => {
      const s = state.current;
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const idle = now - s.lastInteraction > RESUME_AFTER;
      const half = el.scrollWidth / 2;
      if (!s.paused && idle && half > el.clientWidth) {
        s.pos += SPEED * dt;
        if (s.pos >= half) s.pos -= half;
        el.scrollLeft = s.pos;
      } else {
        // Rolagem manual: continua do ponto em que o usuário parou, dentro do loop.
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        s.pos = el.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [auto, inView]);

  const interact = () => {
    state.current.lastInteraction = performance.now();
  };

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => e.pointerType === "mouse" && (state.current.paused = true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && (state.current.paused = false)}
      onFocus={() => (state.current.paused = true)}
      onBlur={() => (state.current.paused = false)}
      onTouchStart={interact}
      onTouchMove={interact}
      onWheel={interact}
      className="no-scrollbar overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
    >
      <ul className="flex w-max border-l border-white/[0.07]" aria-label="Marcas">
        {items.map((item) => (
          <BrandLink key={item.name} item={item} />
        ))}
        {/* Cópia para o loop contínuo, invisível para leitores de tela e teclado */}
        {items.map((item) => (
          <BrandLink key={`${item.name}-loop`} item={item} hidden />
        ))}
      </ul>
    </div>
  );
}
