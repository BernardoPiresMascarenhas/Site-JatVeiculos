"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Barra fixa inferior da página do veículo (só abaixo de lg). Some enquanto o
 * formulário de interesse ou o rodapé estão na tela, para não cobrir campos,
 * o teclado virtual nem as informações finais da página.
 */
export function VehicleMobileBar({
  name,
  price,
  whatsappHref,
  anchorId = "interesse",
}: {
  name: string;
  price: string;
  whatsappHref: string;
  anchorId?: string;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById(anchorId), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setHidden(visible.size > 0);
    });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [anchorId]);

  const goToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(anchorId);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    // Leva o foco ao título do formulário sem abrir o teclado virtual.
    target.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    history.replaceState(null, "", `#${anchorId}`);
  };

  return (
    <div
      inert={hidden}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-carbon/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-500 ease-out-expo lg:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-fog">{name}</p>
          <p className="spec-value text-base whitespace-nowrap sm:text-lg">{price}</p>
        </div>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Consultar pelo WhatsApp (abre em nova aba)"
          className="grid size-12 shrink-0 place-items-center border border-white/20 text-ice transition-colors hover:border-ice"
        >
          <MessageCircle className="size-5" aria-hidden />
        </a>
        <a href={`#${anchorId}`} onClick={goToForm} className="btn btn-primary min-h-12 shrink-0 px-4 text-[0.72rem] tracking-[0.06em] sm:px-5 sm:text-[0.8125rem]">
          Tenho interesse
        </a>
      </div>
    </div>
  );
}
