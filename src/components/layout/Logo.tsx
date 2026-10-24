import Image from "next/image";
import Link from "next/link";
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
  return (
    <Link href="/" aria-label="JAT Veículos Premium — página inicial" className={`inline-flex shrink-0 items-center ${className}`}>
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
