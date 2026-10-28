import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { SourceTag } from "@/components/ui/DemoTag";
import { VehicleInterestForm } from "@/components/vehicles/VehicleInterestForm";
import { site } from "@/config/site";
import type { Vehicle } from "@/data/vehicles";
import { vehicleRef } from "@/features/vehicle-interest/interest";
import { formatPrice } from "@/lib/format";
import { vehicleWhatsappText, whatsappLink } from "@/lib/whatsapp";

/**
 * Card comercial: preço (só no desktop; no mobile ele já aparece acima da
 * galeria e na barra inferior), contato direto e o formulário de interesse.
 */
export function VehicleContactCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <div className="surface border border-white/10 bg-ink">
      <div className="p-6 md:p-8">
        <SourceTag source={v.source} className="mb-6" />
        <div className="hidden lg:mb-7 lg:block">
          <p className="eyebrow text-fog">{v.source.kind === "demo" ? "Valor de referência" : "Preço anunciado"}</p>
          <p className="spec-value mt-2 text-[2.4rem] leading-none">{formatPrice(v.price)}</p>
        </div>

        <div className="grid gap-3">
          <a
            href={whatsappLink(vehicleWhatsappText(v))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full"
          >
            <MessageCircle className="size-4" aria-hidden />
            Consultar pelo WhatsApp
            <span className="sr-only">(abre em nova aba)</span>
          </a>
          <a href={site.contact.phoneHref} className="btn btn-ghost w-full">
            <Phone className="size-4" aria-hidden />
            {site.contact.phone}
          </a>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-fog">
          {v.source.kind === "demo"
            ? "Este veículo é demonstrativo. O WhatsApp abre uma conversa real com a JAT perguntando por modelos semelhantes; revise a mensagem antes de enviar."
            : "O estoque não é atualizado em tempo real: confirme a disponibilidade com a equipe."}
        </p>
        {v.source.kind === "official" && (
          <a
            href={v.source.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow mt-3 inline-flex min-h-11 items-center gap-1.5 text-mist transition-colors hover:text-accent"
          >
            Ver anúncio no site oficial
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        )}
      </div>

      <div className="border-t border-white/10 p-6 md:p-8">
        <VehicleInterestForm vehicle={vehicleRef(v)} />
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-sm text-mist md:px-8">
        <p>
          Precisa financiar? A JAT tem parcerias com os melhores bancos do mercado.{" "}
          <Link href="/ficha-cadastral" className="text-ice underline decoration-brand underline-offset-4 hover:decoration-2">
            Conheça a ficha cadastral
          </Link>
        </p>
      </div>
    </div>
  );
}
