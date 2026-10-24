"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useSyncExternalStore } from "react";
import { defaultTheme, type Theme, themeStorageKey } from "@/config/theme";

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function readStored(): Theme | null {
  try {
    const t = localStorage.getItem(themeStorageKey);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

/** Observa o atributo no <html>: a fonte de verdade é o DOM, não o estado React. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function applyTheme(next: Theme) {
  const root = document.documentElement;
  const swap = () => {
    // Desliga as transições de cor durante a troca para não haver cascata.
    root.setAttribute("data-theme-switching", "");
    root.setAttribute("data-theme", next);
    requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute("data-theme-switching")));
  };

  try {
    localStorage.setItem(themeStorageKey, next);
  } catch {
    // Sem armazenamento (aba privada): o tema vale só para esta visita.
  }

  // Esmaecimento curto entre os temas; troca seca com movimento reduzido.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && typeof document.startViewTransition === "function") document.startViewTransition(swap);
  else swap();
}

/** Alternador sol/lua do cabeçalho. Os ícones trocam via CSS, sem flash na hidratação. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => defaultTheme);

  // Em desenvolvimento o Strict Mode remonta o <html> e apaga o atributo do script.
  useLayoutEffect(() => {
    const stored = readStored();
    if (stored && readTheme() !== stored) document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const next: Theme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={next === "light" ? "Ativar tema claro" : "Ativar tema escuro"}
      title={next === "light" ? "Tema claro" : "Tema escuro"}
      className={`group grid size-11 place-items-center border border-white/15 text-mist transition-colors hover:border-ice hover:bg-white/5 hover:text-ice ${className}`}
    >
      <Sun className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45 light:hidden" aria-hidden />
      <Moon className="hidden size-4 transition-transform duration-500 ease-out-expo group-hover:-rotate-12 light:block" aria-hidden />
    </button>
  );
}
