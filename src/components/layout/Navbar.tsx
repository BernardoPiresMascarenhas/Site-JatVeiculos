"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Fecha o menu ao trocar de rota.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // O cabeçalho fica sempre visível; a rolagem só compacta a faixa.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        // Sempre escuro: o logotipo oficial tem "VEÍCULOS" em branco.
        data-theme="dark"
        className="fixed inset-x-0 top-0 z-50"
      >
        {/*
          Fundo opaco: o Safari do iOS 26 estende a cor do cabeçalho fixo para trás da barra de
          status, mas só quando ela é sólida; translúcida, o conteúdo rolado aparece ali.
          O padding cobre a safe area quando o navegador a entrega à página (viewport-fit=cover);
          o ::before a mantém carbono mesmo enquanto a faixa é transparente sobre o hero.
        */}
        <div
          className={`relative border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-500 before:absolute before:inset-x-0 before:top-0 before:h-[env(safe-area-inset-top)] before:bg-carbon ${
            scrolled || open
              ? "border-white/[0.07] bg-carbon"
              : // No tema claro a faixa fica sólida desde o topo, já que as páginas abrem em fundo claro.
                "border-transparent bg-transparent light:border-white/[0.07] light:bg-carbon"
          }`}
        >
          <nav
            aria-label="Principal"
            className={`shell flex items-center justify-between transition-[height] duration-500 ease-out-expo ${
              scrolled ? "h-16" : "h-20 md:h-24"
            }`}
          >
            <Logo preload imageClassName={scrolled ? "h-8 w-auto md:h-9" : "h-9 w-auto md:h-11"} />

            <ul className="hidden items-center gap-5 md:flex lg:gap-10">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group relative py-2 text-[0.8125rem] font-medium tracking-[0.06em] whitespace-nowrap text-mist uppercase transition-colors hover:text-accent aria-[current=page]:text-ice"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute -bottom-0.5 left-0 h-px bg-brand transition-[width] duration-500 ease-out-expo ${
                        isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href={whatsappLink("Olá, JAT! Vim pelo site e gostaria de atendimento.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2.5 border border-white/15 px-4 py-2.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors hover:border-ice hover:bg-white/5 sm:inline-flex"
              >
                <MessageCircle className="size-4 text-accent" aria-hidden />
                {/* Entre md e lg o cabeçalho tem cinco links: o botão fica só com o ícone. */}
                <span className="md:max-lg:sr-only">Atendimento</span>
              </a>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-mobile"
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                className="relative grid size-11 place-items-center md:hidden"
              >
                <span
                  className={`absolute h-px w-6 bg-ice transition-transform duration-500 ease-out-expo ${
                    open ? "rotate-45" : "-translate-y-1"
                  }`}
                />
                <span
                  className={`absolute h-px w-6 bg-ice transition-transform duration-500 ease-out-expo ${
                    open ? "-rotate-45" : "translate-y-1"
                  }`}
                />
              </button>
            </div>
          </nav>
        </div>
        <span aria-hidden className="grain-layer" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            data-theme="dark"
            className="fixed inset-0 z-40 flex flex-col bg-carbon pt-[calc(6rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] md:hidden"
          >
            <ul className="shell flex flex-1 flex-col justify-center gap-2">
              {navigation.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.7 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="display flex items-baseline gap-4 py-2 text-[clamp(1.6rem,7.2vw,4rem)] text-ice/90 aria-[current=page]:text-ice"
                  >
                    <span className="eyebrow text-[0.65rem] text-fog">0{i + 1}</span>
                    {item.label}
                    {isActive(item.href) && <span className="mb-auto size-2 bg-brand" aria-hidden />}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="shell grid gap-3 border-t border-white/10 py-8 text-sm text-mist"
            >
              <a
                href={whatsappLink("Olá, JAT! Vim pelo site e gostaria de atendimento.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                <MessageCircle className="size-4" aria-hidden /> WhatsApp {site.contact.whatsapp}
              </a>
              <a href={site.contact.phoneHref} className="btn btn-ghost w-full">
                <Phone className="size-4" aria-hidden /> {site.contact.phone}
              </a>
              <p className="pt-1 text-center text-xs text-fog">{site.address.full}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
