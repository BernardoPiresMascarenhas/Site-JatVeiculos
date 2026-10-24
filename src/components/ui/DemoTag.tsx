import { Info } from "lucide-react";
import type { VehicleSource } from "@/data/vehicles";

/** Identifica conteúdo demonstrativo (estoque, preços, especificações). */
export function DemoTag({ className = "", children = "Demonstrativo" }: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-1.5 border border-white/20 bg-carbon/65 px-2 py-1 text-[0.6rem] text-mist backdrop-blur-sm ${className}`}
    >
      <Info className="size-3" aria-hidden />
      {children}
    </span>
  );
}

/** Selo de origem do anúncio: só os demonstrativos são marcados; os oficiais não levam selo. */
export function SourceTag({ source, className = "" }: { source: VehicleSource; className?: string }) {
  if (source.kind === "demo") return <DemoTag className={className} />;
  return null;
}
