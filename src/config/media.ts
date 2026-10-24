/**
 * MANIFESTO DE FOTOGRAFIAS REAIS
 *
 * Locais preparados para fotografias da JAT Veículos. Basta salvar o arquivo
 * no caminho indicado em `file` (dentro de /public) e gerar o build: o site
 * detecta o arquivo e substitui o conteúdo provisório automaticamente.
 *
 * Use somente imagens autorizadas pela JAT (fotos próprias da loja e do estoque).
 */

export interface MediaSlot {
  /** Caminho público esperado, relativo a /public. */
  file: string;
  alt: string;
  /** Onde a foto aparece e o que ela deve mostrar. */
  usage: string;
  specs: string;
  /** Composição provisória enquanto o arquivo real não existir. */
  fallback?: { src: string; alt: string; caption: string };
}

export const mediaSlots = {
  hero: {
    file: "/images/jat/hero.jpg",
    alt: "Veículo do estoque da JAT Veículos",
    usage: "Hero da página inicial: um veículo real do estoque da JAT, em ambiente escuro ou ao entardecer.",
    specs: "JPG horizontal, mínimo 2400 × 1600 px, carro à direita do quadro",
    fallback: {
      src: "/images/vehicles/porsche-panamera.jpg",
      alt: "Porsche Panamera preto em movimento ao entardecer, com a lanterna traseira acesa",
      caption: "Porsche Panamera Turbo · Fotografia ilustrativa",
    },
  },
  facade: {
    file: "/images/jat/fachada.jpg",
    alt: "Fachada da JAT Veículos na Av. Raja Gabáglia, 4855",
    usage: "Página A JAT: abertura em tela cheia.",
    specs: "JPG horizontal, mínimo 2400 × 1600 px",
    fallback: {
      src: "/images/editorial/garage.jpg",
      alt: "Mercedes-Benz branco em garagem iluminada de vermelho e azul",
      caption: "Fotografia ilustrativa",
    },
  },
  storefront: {
    // Recorte de jatfaixada.webp (1920 × 528) sem as fachadas vizinhas.
    file: "/images/jat/fachada-loja.webp",
    alt: "Fachada da JAT Veículos à noite, com o letreiro iluminado e o salão cheio de carros atrás da vitrine",
    usage: "Página A JAT: seção “A loja”, faixa panorâmica.",
    specs: "WebP panorâmico, cerca de 2,2 : 1",
  },
  showroom: {
    file: "/images/jat/showroom.jpg",
    alt: "Showroom da JAT Veículos",
    usage: "Página A JAT: seção “A loja”, ao lado da fachada.",
    specs: "JPG vertical ou horizontal, mínimo 1600 px no menor lado",
  },
} satisfies Record<string, MediaSlot>;

export type MediaSlotId = keyof typeof mediaSlots;

/**
 * Bastidores do Instagram (@jatveiculos_premium): capturas de stories da própria loja.
 * Verticais (~1206 × 2100 px). Para mais qualidade, substitua pelos originais
 * com o mesmo nome de arquivo.
 */
export const instagramStories = [
  { src: "/images/jat/instagram/story-01.jpg", alt: "Ford Mustang Mach 1 laranja no salão da JAT Veículos" },
  { src: "/images/jat/instagram/story-02.jpg", alt: "Capô do Ford Mustang Mach 1 com carros pretos ao fundo" },
  { src: "/images/jat/instagram/story-03.jpg", alt: "Volante do Ford Mustang com a vitrine da loja ao fundo" },
  { src: "/images/jat/instagram/story-04.jpg", alt: "Volante e painel de um Porsche no salão" },
  { src: "/images/jat/instagram/story-05.jpg", alt: "Roda de um BMW preto e o kart suspenso no teto da loja" },
  { src: "/images/jat/instagram/story-06.jpg", alt: "BMW preto e Mustang laranja sob o kart suspenso no salão" },
  { src: "/images/jat/instagram/story-07.jpg", alt: "Salão da JAT Veículos com BMWs pretos e o kart no teto" },
] as const;
