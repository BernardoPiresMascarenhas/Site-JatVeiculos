const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat("pt-BR");

export const formatPrice = (value: number) => currency.format(value);

export const formatKm = (value: number) => `${integer.format(value)} km`;

export const formatNumber = (value: number) => integer.format(value);

/** "R$ 300 mil", "R$ 1,5 mi" — usado nos rótulos de filtros. */
export function formatPriceShort(value: number) {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  }
  return `R$ ${integer.format(value / 1000)} mil`;
}

export const formatYear = (manufacture: number, model: number) =>
  manufacture === model ? `${model}` : `${manufacture}/${model}`;

/** Normaliza texto para busca sem acentos e sem diferenciar maiúsculas. */
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
