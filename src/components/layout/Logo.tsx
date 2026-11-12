"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { brandAssets } from "@/config/site";

interface LogoProps {
  className?: string;
  /** Altura controlada pelo contêiner; a largura segue a proporção original. */
  imageClassName?: string;
  preload?: boolean;
}

/** Logotipo oficial JAT Veículos Premium, sem alterações de desenho ou cor. */
export function Logo({ className = "", imageClassName = "h-10 w-auto", preload }: LogoProps) {
  const { src, width, height } = brandAssets.horizontal;
  const pathname = usePathname();

  // Na home, rola suavemente até o hero em vez de recarregar a rota.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.getElementById("hero");
    const top = hero ? hero.getBoundingClientRect().top + window.scrollY : 0;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label="JAT Veículos Premium — página inicial"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src={src}
        alt={brandAssets.alt}
        width={width}
        height={height}
        preload={preload}
        sizes="200px"
        className={`transition-[height] duration-500 ease-out-expo ${imageClassName}`}
      />
    </Link>
  );
}
