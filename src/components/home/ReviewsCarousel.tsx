"use client";

import { Star } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { GoogleReview } from "@/config/reviews";

const LINES = 5;
/** Tempo que cada card leva para atravessar a faixa: lento, para dar tempo de leitura. */
const SECONDS_PER_CARD = 8;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-1 text-brand" role="img" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`size-3.5 ${i < rating ? "fill-current" : "text-white/15"}`} aria-hidden />
      ))}
    </span>
  );
}

interface ReviewCardProps {
  review: GoogleReview;
  index: number;
  total: number;
  googleMark: React.ReactNode;
}

/**
 * Texto limitado a 5 linhas (line-clamp). O botão só aparece com overflow real;
 * a expansão anima a altura entre as duas medidas reais do texto.
 */
function ReviewCard({ review, index, total, googleMark }: ReviewCardProps) {
  const textId = useId();
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [heights, setHeights] = useState<{ collapsed: number; full: number } | null>(null);
  // As reticências só voltam ao fim do recolhimento: "settled" vira false ao fim
  // da expansão e true ao fim do recolhimento.
  const [settled, setSettled] = useState(true);
  const clamped = !expanded && settled;

  const measure = useCallback(() => {
    const p = textRef.current;
    if (!p) return;
    const collapsed = Math.round(parseFloat(getComputedStyle(p).lineHeight) * LINES);
    const full = p.scrollHeight;
    setTruncated(full > collapsed + 1);
    setHeights({ collapsed, full });
  }, []);

  useLayoutEffect(() => {
    measure();
    const p = textRef.current;
    if (!p) return;
    const observer = new ResizeObserver(measure);
    observer.observe(p.parentElement ?? p);
    return () => observer.disconnect();
  }, [measure]);

  // Segurança: se o transitionend não disparar, recoloca o clamp após recolher.
  useEffect(() => {
    if (expanded) return;
    const timer = window.setTimeout(() => setSettled(true), 600);
    return () => window.clearTimeout(timer);
  }, [expanded]);

  const wrapperStyle = truncated && heights ? { height: expanded ? heights.full : heights.collapsed } : undefined;

  return (
    <figure
      aria-label={`Avaliação ${index + 1} de ${total}: ${review.author}`}
      className="surface group flex flex-col border border-white/[0.08] bg-graphite/70 p-6 transition-colors duration-500 hover:border-white/20 hover:bg-graphite"
    >
      <div className="flex h-5 items-center">
        {review.rating ? (
          <Stars rating={review.rating} />
        ) : (
          <span aria-hidden className="display text-4xl leading-[0.5] text-accent/80 transition-colors duration-500 group-hover:text-accent">
            “
          </span>
        )}
      </div>

      <div
        className="mt-4 overflow-hidden transition-[height] duration-500 ease-out-expo motion-reduce:transition-none"
        style={wrapperStyle}
        onTransitionEnd={(e) => {
          if (e.propertyName === "height") setSettled(!expanded);
        }}
      >
        <blockquote>
          <p
            ref={textRef}
            id={textId}
            className={`min-h-[8.5em] text-[0.94rem] leading-[1.7] whitespace-pre-line text-mist ${clamped ? "line-clamp-5" : ""}`}
          >
            {review.text}
          </p>
        </blockquote>
      </div>

      {/* Linha reservada: mesma altura inicial com ou sem botão. */}
      <div className="mt-2 h-8">
        {truncated && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={textId}
            className="eyebrow inline-flex h-8 items-center gap-2 text-[0.62rem] text-accent transition-colors hover:text-ice"
          >
            {expanded ? "Ler menos" : "Ler mais"}
            <span aria-hidden className={`inline-block transition-transform duration-500 ${expanded ? "-rotate-180" : ""}`}>
              ↓
            </span>
          </button>
        )}
      </div>

      <figcaption className="mt-3 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
        <span className="min-w-0">
          <span className="block truncate text-[0.95rem] font-semibold text-ice [font-stretch:110%]">{review.author}</span>
          <span className="mt-1 flex items-center gap-1.5 text-[0.7rem] text-fog">
            {googleMark}
            Avaliação no Google
          </span>
        </span>
        <span aria-hidden className="h-px w-5 shrink-0 bg-brand/60 transition-[width] duration-500 group-hover:w-9" />
      </figcaption>
    </figure>
  );
}

interface ReviewsCarouselProps {
  reviews: GoogleReview[];
  googleMark: React.ReactNode;
  /** Cabeçalho exibido acima da faixa. */
  header: React.ReactNode;
}

/**
 * Faixa contínua para a esquerda (CSS em globals.css). A lista é renderizada
 * duas vezes para o loop não ter emenda; a cópia fica fora da árvore de
 * acessibilidade. Pausa com o mouse por cima ou com foco por teclado.
 */
export function ReviewsCarousel({ reviews, googleMark, header }: ReviewsCarouselProps) {
  const copies = [false, true];

  return (
    <div>
      {header}

      <div className="reviews-marquee no-scrollbar mt-8 md:mt-10">
        <div
          className="reviews-marquee-track"
          style={{ "--marquee-duration": `${reviews.length * SECONDS_PER_CARD}s` } as React.CSSProperties}
        >
          {copies.map((clone) => (
            <ul
              key={String(clone)}
              aria-label={clone ? undefined : "Avaliações de clientes"}
              aria-hidden={clone || undefined}
              inert={clone || undefined}
              data-clone={clone || undefined}
              className="flex shrink-0 items-start"
            >
              {reviews.map((review, i) => (
                <li key={review.author} className="w-[min(82vw,22rem)] shrink-0 pr-4 lg:w-[24rem] lg:pr-5">
                  <ReviewCard review={review} index={i} total={reviews.length} googleMark={googleMark} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
