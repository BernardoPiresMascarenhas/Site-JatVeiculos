import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactComposer } from "@/components/contact/ContactComposer";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { mapsLink, site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a JAT Veículos: WhatsApp ${site.contact.whatsapp}, telefone ${site.contact.phone}. ${site.address.full}.`,
  alternates: { canonical: "/contato" },
};

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.contact.whatsapp,
    href: whatsappLink("Olá, JAT! Vim pelo site e gostaria de atendimento."),
    external: true,
  },
  { icon: Phone, label: "Telefone", value: site.contact.phone, href: site.contact.phoneHref },
  { icon: Mail, label: "E-mail", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { icon: MapPin, label: "Endereço", value: site.address.full, href: mapsLink, external: true },
];

export default function ContatoPage() {
  return (
    <>
      <header className="pt-36 pb-14 md:pt-44 md:pb-20">
        <div className="shell">
          <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
            <span aria-hidden className="h-px w-8 bg-brand" />
            Contato
          </p>
          <h1 className="display text-[clamp(3.2rem,10vw,9rem)]">
            Fale com
            <br />a JAT<span className="text-accent">.</span>
          </h1>
        </div>
      </header>

      <div className="shell grid gap-14 pb-20 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <ul className="border-t border-white/10">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="border-b border-white/10">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-5 py-6 transition-colors"
                >
                  <span className="grid size-12 shrink-0 place-items-center border border-white/12 transition-colors duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block text-fog">{label}</span>
                    <span className="mt-1 block text-base break-words text-ice md:text-lg">{value}</span>
                  </span>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-fog transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ice"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-start gap-4 text-sm text-mist">
            <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            <p>{site.contact.hours}</p>
          </div>

          <div className="mt-8 flex gap-6 text-sm">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="link-line text-mist hover:text-ice">
              Instagram
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="link-line text-mist hover:text-ice">
              Facebook
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <ContactComposer />
        </Reveal>
      </div>

      <section aria-label="Localização" className="shell pb-28">
        <MapEmbed className="aspect-[4/5] w-full sm:aspect-[21/9]" />
      </section>
    </>
  );
}
