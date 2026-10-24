import { ArrowUpRight, MapPin } from "lucide-react";
import { mapsEmbedUrl, mapsLink, site } from "@/config/site";

export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div className={`group relative overflow-hidden bg-graphite ${className}`}>
      <iframe
        src={mapsEmbedUrl}
        title={`Mapa: ${site.address.full}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(0.9)_brightness(0.95)] transition-[filter] duration-700 group-hover:[filter:grayscale(0.6)_invert(0.9)_contrast(0.95)] light:[filter:grayscale(1)_contrast(0.95)] light:group-hover:[filter:grayscale(0.4)]"
      />
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group/map absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-3 bg-carbon px-4 py-3 text-sm text-ice shadow-2xl transition-colors hover:bg-brand hover:text-on-brand"
      >
        <MapPin className="size-4 shrink-0 text-accent transition-colors group-hover/map:text-on-brand" aria-hidden />
        <span className="truncate">Abrir rota no Google Maps</span>
        <ArrowUpRight className="size-4 shrink-0" aria-hidden />
      </a>
    </div>
  );
}
