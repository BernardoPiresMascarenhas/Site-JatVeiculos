/**
 * Fita diagonal "DESTAQUE" no canto superior esquerdo da foto do card.
 * O contêiner da foto precisa de `relative overflow-hidden`: as pontas da faixa
 * passam das bordas e são aparadas por ele, sem sair do card.
 */
export function FeaturedRibbon() {
  return (
    <span
      aria-hidden
      // Centro da faixa na diagonal do canto, a ~3.3rem (sm: 3.6rem) do vértice:
      // o trecho visível (≈ 2× essa distância) comporta a palavra inteira.
      // top = d/√2 − altura/2 · left = d/√2 − largura/2.
      className="pointer-events-none absolute top-[1.73rem] -left-[2.67rem] z-10 w-40 -rotate-45 bg-brand py-[0.3rem] pl-[0.24em] text-center text-[0.6rem] leading-none font-bold tracking-[0.24em] text-on-brand uppercase shadow-[0_3px_10px_-2px_rgb(0_0_0/0.45)] [font-stretch:115%] sm:top-[1.87rem] sm:-left-[2.95rem] sm:w-44 sm:py-[0.35rem] sm:text-[0.66rem]"
    >
      Destaque
    </span>
  );
}
