import { Camera } from "lucide-react";
import type { MediaSlot } from "@/config/media";

/**
 * Local reservado para uma fotografia real ainda não fornecida.
 * Mostra o caminho exato do arquivo esperado e as especificações.
 */
export function PendingPhoto({ slot, title, className = "" }: { slot: MediaSlot; title: string; className?: string }) {
  return (
    <figure
      className={`carbon-texture relative isolate flex flex-col justify-end overflow-hidden p-6 md:p-8 ${className}`}
      aria-label={`${title}: fotografia real pendente`}
    >
      {/* Cantos de visor */}
      <span aria-hidden className="absolute top-5 left-5 size-6 border-t border-l border-brand/70" />
      <span aria-hidden className="absolute top-5 right-5 size-6 border-t border-r border-brand/70" />
      <span aria-hidden className="absolute bottom-5 left-5 size-6 border-b border-l border-brand/70" />
      <span aria-hidden className="absolute right-5 bottom-5 size-6 border-r border-b border-brand/70" />
      <Camera aria-hidden className="absolute top-1/2 left-1/2 hidden size-10 -translate-1/2 text-white/[0.08] sm:block" strokeWidth={1} />

      <figcaption className="relative">
        <p className="eyebrow text-accent">Fotografia real pendente</p>
        <p className="headline mt-3 text-xl uppercase">{title}</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-fog">{slot.usage}</p>
        <p className="mt-4 font-mono text-[0.7rem] break-all text-mist">public{slot.file}</p>
        <p className="mt-1 font-mono text-[0.65rem] text-fog">{slot.specs}</p>
      </figcaption>
    </figure>
  );
}
