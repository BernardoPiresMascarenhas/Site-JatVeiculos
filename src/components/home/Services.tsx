import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Services({ index = "04" }: { index?: string }) {
  return (
    <section aria-labelledby="servicos-title" className="bg-ice py-24 text-carbon md:py-36">
      <div className="shell">
        <SectionHeading id="servicos-title" index={index} eyebrow="Serviços" title={<>Do primeiro<br />contato à chave</>} tone="light">
          <p>
            A JAT está preparada para prestar todos os serviços necessários para compra, venda,
            consignação e financiamento do seu veículo. Cada linha abre uma conversa no WhatsApp.
          </p>
        </SectionHeading>

        <ul className="mt-16 border-t border-carbon/15 md:mt-24">
          {services.map((s, i) => (
            <li key={s.id} id={s.id} className="scroll-mt-[calc(6rem+env(safe-area-inset-top))] border-b border-carbon/15">
              <Reveal delay={i * 0.05} y={20}>
                <a
                  href={whatsappLink(s.whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative grid gap-3 overflow-hidden py-8 md:grid-cols-12 md:items-center md:gap-8 md:py-11"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-carbon transition-transform duration-700 ease-out-expo group-hover:scale-y-100"
                  />
                  <span className="eyebrow relative text-smoke transition-colors duration-500 group-hover:text-accent md:col-span-1 md:pl-4">
                    {s.index}
                  </span>
                  <span className="display relative text-[clamp(1.75rem,3.9vw,3.5rem)] transition-[color,transform] duration-700 ease-out-expo group-hover:translate-x-3 group-hover:text-ice md:col-span-6">
                    {s.title}
                  </span>
                  <span className="relative md:col-span-4">
                    <span className="headline block text-base uppercase transition-colors duration-500 group-hover:text-ice">
                      {s.lead}
                    </span>
                    <span className="mt-2 block max-w-md text-[0.95rem] leading-relaxed text-smoke transition-colors duration-500 group-hover:text-mist">
                      {s.body}
                    </span>
                  </span>
                  <span className="relative hidden justify-end pr-4 md:col-span-1 md:flex">
                    <span className="grid size-12 place-items-center border border-carbon/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand">
                      <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:-rotate-45" aria-hidden />
                    </span>
                  </span>
                  <span className="sr-only">(abre o WhatsApp em nova aba)</span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal y={16} className="mt-10 flex flex-col gap-5 border border-carbon/15 p-6 sm:flex-row sm:items-center sm:justify-between md:mt-14 md:p-8">
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center bg-carbon">
              <FileText className="size-4.5 text-accent" aria-hidden />
            </span>
            <div>
              <p className="headline text-base uppercase">Vai financiar?</p>
              <p className="mt-1 max-w-lg text-[0.95rem] leading-relaxed text-smoke">
                Conheça a ficha cadastral em etapas: dados pessoais, endereço, informações profissionais e
                financiamento. Protótipo sem envio de dados.
              </p>
            </div>
          </div>
          <Link href="/ficha-cadastral" className="btn shrink-0 bg-carbon text-ice hover:bg-steel">
            Ficha cadastral
            <ArrowRight className="btn-arrow size-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
