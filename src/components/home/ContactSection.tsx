import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { mapsLink, site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

export function ContactSection() {
  const rows = [
    { icon: MapPin, label: "Endereço", value: site.address.full, href: mapsLink, external: true },
    { icon: Clock, label: "Horário", value: site.contact.hours },
    { icon: Phone, label: "Telefone", value: site.contact.phone, href: site.contact.phoneHref },
    { icon: Mail, label: "E-mail", value: site.contact.email, href: `mailto:${site.contact.email}` },
  ];

  return (
    <section aria-labelledby="visite-title" className="relative py-24 md:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
            <span className="text-accent">05</span>
            <span aria-hidden className="h-px w-8 bg-current opacity-40" />
            Visite a loja
          </p>
          <h2 id="visite-title" className="display text-[clamp(2.4rem,6.2vw,5.5rem)]">
            Raja
            <br />
            Gabáglia
            <br />
            <span className="text-accent">4855</span>
          </h2>

          <dl className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {rows.map(({ icon: Icon, label, value, href, external }) => (
              <div key={label} className="flex gap-4 py-4">
                <Icon className="mt-0.5 size-4 shrink-0 text-fog" aria-hidden />
                <dt className="sr-only">{label}</dt>
                <dd className="text-sm leading-relaxed text-mist">
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="link-line break-words hover:text-ice"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink("Olá, JAT! Gostaria de agendar uma visita à loja.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </a>
            <Link href="/contato" className="btn btn-ghost">
              Todos os contatos
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-7">
          <MapEmbed className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[36rem]" />
        </Reveal>
      </div>
    </section>
  );
}
