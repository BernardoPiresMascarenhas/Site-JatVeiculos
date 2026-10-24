import { brandMarks, opticalSize } from "@/config/brands";
import { vehicles } from "@/data/vehicles";
import { filtersToParams } from "@/lib/inventory";
import { publicFileExists } from "@/lib/media";
import { type BrandItem, BrandCarousel } from "./BrandCarousel";

/** Marcas com pelo menos um veículo cadastrado, da mais presente para a menos. */
function brandItems(): BrandItem[] {
  const counts = new Map<string, number>();
  for (const v of vehicles) counts.set(v.brand, (counts.get(v.brand) ?? 0) + 1);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))
    .map(([name, count]) => {
      const config = brandMarks[name];
      const slug = config?.slug ?? name.toLowerCase().replace(/\s+/g, "-");
      const file = `/images/marcas/${slug}.svg`;
      const href = `/estoque?${filtersToParams({ brand: name })}`;

      if (publicFileExists(file)) return { name, count, href, mark: { kind: "file", src: file } };
      if (config?.icon) {
        const [x, y, w, h] = config.icon.box;
        return {
          name,
          count,
          href,
          mark: { kind: "icon", path: config.icon.path, viewBox: `${x} ${y} ${w} ${h}`, ...opticalSize(w / h) },
        };
      }
      return { name, count, href, mark: { kind: "text" } };
    });
}

export function BrandShowcase() {
  const items = brandItems();
  return (
    <section aria-labelledby="marcas-title" className="border-b border-white/[0.06] bg-carbon py-12 md:py-16">
      <div className="shell mb-8 flex flex-wrap items-center justify-between gap-4 md:mb-10">
        <h2 id="marcas-title" className="eyebrow flex items-center gap-3 text-fog">
          <span aria-hidden className="h-px w-8 bg-brand" />
          Marcas no catálogo
        </h2>
      </div>
      <BrandCarousel items={items} />
    </section>
  );
}
