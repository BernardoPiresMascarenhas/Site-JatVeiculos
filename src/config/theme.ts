/**
 * Paleta institucional. Fonte de verdade para valores usados fora do CSS
 * (meta theme-color, imagens geradas). Mantenha em sincronia com o bloco
 * @theme de src/app/globals.css.
 */
export const palette = {
  carbon: "#0B0D10",
  brand: "#FDBF01",
  brandDeep: "#E0A800",
  brandInk: "#7D5C00",
  ice: "#F5F5F5",
  danger: "#F0352C",
} as const;

/** Temas do site. O escuro é o padrão para novos visitantes. */
export type Theme = "dark" | "light";
export const defaultTheme: Theme = "dark";
/** Chave da preferência salva no localStorage. */
export const themeStorageKey = "jat-theme";

/**
 * Executado no <head> antes da primeira pintura: aplica o tema salvo e evita o
 * flash do tema errado. Valores desconhecidos são ignorados.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${themeStorageKey}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
