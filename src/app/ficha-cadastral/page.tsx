import type { Metadata } from "next";
import { CreditApplicationWizard } from "@/components/credit/CreditApplicationWizard";
import { DemoTag } from "@/components/ui/DemoTag";

export const metadata: Metadata = {
  title: "Ficha cadastral",
  description: "Protótipo da ficha cadastral para financiamento da JAT Veículos, organizada em etapas. Nenhum dado é enviado.",
  alternates: { canonical: "/ficha-cadastral" },
};

export default function FichaCadastralPage() {
  return (
    <>
      <header className="pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-fog">
              <span aria-hidden className="h-px w-8 bg-brand" />
              Financiamento
            </p>
            <h1 className="display text-[clamp(2.8rem,8.5vw,7.5rem)]">
              Ficha
              <br />
              cadastral
            </h1>
          </div>
          <div className="max-w-sm pb-2">
            <DemoTag>Protótipo · sem envio</DemoTag>
            <p className="mt-3 text-sm leading-relaxed text-fog">
              Quatro etapas para adiantar a análise de crédito com os bancos parceiros da JAT. Esta versão
              demonstra apenas a navegação.
            </p>
          </div>
        </div>
      </header>
      <div className="shell pb-28">
        <CreditApplicationWizard />
      </div>
    </>
  );
}
