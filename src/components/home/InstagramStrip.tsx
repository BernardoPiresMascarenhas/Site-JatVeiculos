import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { instagramStories } from "@/config/media";
import { site } from "@/config/site";

const handle = "@jatveiculos_premium";

/** Bastidores da loja em formato de story, com link para o perfil oficial. */
export function InstagramStrip() {
  return (
    <section aria-labelledby="instagram-title" className="border-t border-white/[0.06] py-20 md:py-28">
      <div className="shell flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
            <span aria-hidden className="h-px w-8 bg-brand" />
            Bastidores da loja
          </p>
          <h2 id="instagram-title" className="display text-[clamp(2rem,5vw,4rem)]">
            No Instagram
          </h2>
        </Reveal>
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost hover:border-brand/70 hover:text-accent">
          Seguir {handle}
          <ArrowUpRight className="btn-arrow size-4" aria-hidden />
        </a>
      </div>

      <ul
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1rem,4vw,3.5rem)] md:mt-14 lg:mx-auto lg:grid lg:max-w-[92rem] lg:grid-cols-7 lg:gap-4 lg:overflow-visible"
        aria-label={`Stories de ${handle}`}
      >
        {instagramStories.map((story, i) => (
          <li key={story.src} className="w-[58vw] max-w-64 shrink-0 snap-start sm:w-60 lg:w-auto lg:max-w-none">
            <Reveal delay={(i % 7) * 0.05} y={20} className="h-full">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${story.alt} — ver no Instagram ${handle}`}
                data-theme="dark"
                className="group relative block aspect-[9/16] overflow-hidden bg-graphite"
              >
                <Image
                  src={story.src}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 1024px) 13vw, (min-width: 640px) 240px, 58vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span
                  aria-hidden
                  className="absolute right-3 bottom-3 grid size-9 translate-y-2 place-items-center bg-brand text-on-brand opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
