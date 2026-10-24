import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { mapsLink, navigation, site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  return (
    // Sempre escuro: fecha a página como o cabeçalho e preserva o logotipo.
    <footer data-theme="dark" className="relative border-t border-white/[0.07] bg-carbon">
      <div className="shell grid gap-14 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Logo imageClassName="h-14 w-auto" />
          <p className="mt-7 max-w-sm text-sm leading-relaxed text-fog">
            Novos e seminovos, nacionais e importados, desde {site.foundedLabel}. Compra, venda,
            consignação e financiamento.
          </p>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-2">
          <p className="eyebrow mb-5 text-fog">Navegação</p>
          <ul className="space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-line text-mist hover:text-ice">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow mb-5 text-fog">Atendimento</p>
          <ul className="space-y-3 text-sm text-mist">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-line hover:text-ice">
                WhatsApp {site.contact.whatsapp}
              </a>
            </li>
            <li>
              <a href={site.contact.phoneHref} className="link-line hover:text-ice">
                Telefone {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="link-line break-all hover:text-ice">
                {site.contact.email}
              </a>
            </li>
            <li className="text-fog">{site.contact.hours}</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow mb-5 text-fog">Loja</p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex gap-1 text-sm leading-relaxed text-mist hover:text-ice"
          >
            <span>
              {site.address.street}
              <br />
              {site.address.district}, {site.address.city} - {site.address.state}
            </span>
            <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </a>
          <div className="mt-6 flex gap-5 text-sm">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="link-line text-mist hover:text-ice">
              Instagram
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="link-line text-mist hover:text-ice">
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="shell flex flex-col gap-4 py-6 text-xs leading-relaxed text-fog md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-2.5 md:items-center">
            <span className="eyebrow mt-0.5 shrink-0 border border-white/20 px-1.5 py-0.5 text-[0.6rem] text-mist md:mt-0">
              {site.concept.label}
            </span>
            <span>{site.concept.note}</span>
          </p>
          <p className="shrink-0">
            Fotos dos veículos: JAT Veículos · imagens editoriais: Unsplash · Informações conferidas em{" "}
            <a href={site.officialSite} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ice">
              jatveiculos.com.br
            </a>{" "}
            ({site.verifiedAt})
          </p>
        </div>
      </div>
    </footer>
  );
}
