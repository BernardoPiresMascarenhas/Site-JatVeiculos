import { ArrowUpRight } from "lucide-react";
import { siGoogle } from "simple-icons";
import { Reveal } from "@/components/ui/Reveal";
import { googleReviews, hasReviewData } from "@/config/reviews";
import { ReviewsCarousel } from "./ReviewsCarousel";

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d={siGoogle.path} />
    </svg>
  );
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Prova social: depoimentos reais publicados no Google. */
export function GoogleReviews() {
  const { reviews, reviewsUrl, writeReviewUrl } = googleReviews;

  // Sem depoimentos cadastrados: apenas os links para o perfil oficial.
  if (!hasReviewData()) {
    return (
      <section aria-labelledby="avaliacoes-title" className="border-t border-white/[0.06] py-16 md:py-20">
        <Reveal className="shell">
          <div className="surface flex flex-col gap-8 border border-white/10 bg-ink p-6 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <p className="eyebrow text-fog">Avaliações no Google</p>
              <h2 id="avaliacoes-title" className="headline mt-2 text-2xl uppercase md:text-3xl">
                O que dizem os clientes
              </h2>
            </div>
            <a href={reviewsUrl} {...external} className="btn btn-primary">
              Ver avaliações
              <ArrowUpRight className="btn-arrow size-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </section>
    );
  }

  const header = (
    <div>
      <p className="eyebrow mb-3 flex items-center gap-3 text-fog">
        <span aria-hidden className="h-px w-8 bg-brand" />
        Experiências reais
      </p>
      <h2 id="avaliacoes-title" className="headline text-[clamp(1.6rem,3vw,2.5rem)] text-balance uppercase">
        A confiança de quem já escolheu a JAT<span className="text-accent">.</span>
      </h2>
      <a
        href={reviewsUrl}
        {...external}
        className="group mt-3 inline-flex items-center gap-2 text-xs text-fog transition-colors hover:text-ice"
      >
        <GoogleMark className="size-3" />
        <span className="link-line">Ver avaliações no Google</span>
        <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </a>
    </div>
  );

  return (
    <section aria-labelledby="avaliacoes-title" className="border-t border-white/[0.06] bg-carbon py-16 md:py-24">
      <Reveal className="shell">
        <ReviewsCarousel reviews={reviews} googleMark={<GoogleMark className="size-2.5" />} header={header} />

        {/* Convite para novas avaliações */}
        <div className="mt-12 flex flex-col gap-6 border-t border-white/[0.08] pt-10 md:mt-14 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <span aria-hidden className="mt-1 h-10 w-px shrink-0 bg-brand" />
            <div>
              <p className="headline text-lg uppercase md:text-xl">Já é cliente JAT Veículos?</p>
              <p className="mt-1 text-sm leading-relaxed text-mist">
                Deixe sua avaliação no Google e compartilhe sua experiência.
              </p>
            </div>
          </div>
          <a href={writeReviewUrl} {...external} className="btn btn-primary shrink-0 self-start md:self-auto">
            <GoogleMark className="size-4" />
            Avaliar no Google
          </a>
        </div>
      </Reveal>
    </section>
  );
}
