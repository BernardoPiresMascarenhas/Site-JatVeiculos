import { palette } from "./theme";

/**
 * Informações institucionais da JAT Veículos.
 *
 * Tudo neste arquivo foi conferido no site oficial (https://jatveiculos.com.br)
 * em 23/10/2026. Os textos institucionais seguem `docs/conteudo-oficial.md`
 * (texto integral da página "Nossa empresa"). Não acrescente fatos que não
 * estejam lá.
 * Os anúncios do estoque ficam em `src/data/official-vehicles.ts`.
 */

export const site = {
  name: "JAT Veículos",
  shortName: "JAT",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "JAT Veículos: novos e seminovos, nacionais e importados, desde maio de 1995. Av. Raja Gabáglia, 4855, Belo Horizonte. Conceito de redesign com showroom digital.",

  /** Este projeto é um conceito de portfólio não oficial. */
  concept: {
    enabled: true,
    label: "Conceito de redesign",
    note: "Projeto conceitual de portfólio, não oficial e sem vínculo com a JAT Veículos. Anúncios conferidos no site oficial, sem atualização em tempo real.",
  },

  foundedLabel: "maio de 1995",
  foundedYear: 1995,

  contact: {
    phone: "(31) 3286-6769",
    phoneHref: "tel:+553132866769",
    whatsapp: "(31) 98705-9657",
    whatsappNumber: "5531987059657",
    email: "vendas@jatveiculos.com.br",
    hours: "Segunda a sábado, das 8h às 18h",
  },

  address: {
    street: "Av. Raja Gabáglia, 4855",
    district: "Santa Lúcia",
    city: "Belo Horizonte",
    state: "MG",
    full: "Av. Raja Gabáglia, 4855, Santa Lúcia, Belo Horizonte - MG",
  },

  social: {
    instagram: "https://www.instagram.com/jatveiculos_premium/",
    facebook: "https://www.facebook.com/JAT-VEICULOS-220916614608878/",
  },

  officialSite: "https://jatveiculos.com.br/",
  verifiedAt: "23/10/2026",
} as const;

/**
 * Logotipo oficial "JAT Veículos Premium".
 * Origem: arquivos fornecidos para o projeto em public/images/ (Logótipo JAT
 * Veículos Premium-1.png e -2.png). As versões em /brand são apenas recortes das
 * margens transparentes, sem alteração de desenho, proporção ou cor.
 */
export const brandAssets = {
  horizontal: { src: "/brand/jat-veiculos-premium-horizontal.png", width: 1400, height: 433 },
  compact: { src: "/brand/jat-veiculos-premium-compacto.png", width: 900, height: 578 },
  alt: "JAT Veículos Premium",
  /** Amarelo institucional do logotipo (ver src/config/theme.ts). */
  color: palette.brand,
} as const;

/** Snapshot do estoque oficial usado apenas como referência (não é exibido como estoque). */
export const officialInventoryReference = {
  url: "https://jatveiculos.com.br/estoque/",
  checkedAt: "23/10/2026",
  listings: 49,
  note: "Fotos hospedadas na plataforma da revenda; uso depende de autorização da JAT.",
} as const;

export const mapsQuery = encodeURIComponent(site.address.full);
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&z=16&output=embed`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

export const navigation = [
  { href: "/", label: "Início" },
  { href: "/estoque", label: "Estoque" },
  // Leva direto à ficha cadastral de financiamento.
  { href: "/ficha-cadastral", label: "Financiamento" },
  { href: "/empresa", label: "A JAT" },
  { href: "/contato", label: "Contato" },
] as const;

/**
 * Serviços divulgados na página "Nossa empresa" do site oficial:
 * compra, venda, consignação e financiamento (com parcerias bancárias
 * para financiamento e leasing).
 */
export const services = [
  {
    id: "compra",
    index: "01",
    title: "Compra",
    lead: "Consultoria total na escolha",
    body: "Profissionais altamente qualificados esclarecem quaisquer dúvidas sobre características, acessórios, modelos e equipamentos. Consultoria total é o diferencial da JAT.",
    whatsappText: "Olá! Gostaria de ajuda para escolher um veículo.",
  },
  {
    id: "venda",
    index: "02",
    title: "Venda",
    lead: "Venda do seu veículo",
    body: "A JAT está preparada para prestar todos os serviços necessários para a venda do seu veículo. Fale com a equipe.",
    whatsappText: "Olá! Gostaria de conversar sobre a venda do meu veículo.",
  },
  {
    id: "consignacao",
    index: "03",
    title: "Consignação",
    lead: "Consignação do seu veículo",
    body: "A JAT está preparada para prestar todos os serviços necessários para a consignação do seu veículo. Consulte as condições.",
    whatsappText: "Olá! Gostaria de saber como funciona a consignação.",
  },
  {
    id: "financiamento",
    index: "04",
    title: "Financiamento",
    lead: "Parcerias com os melhores bancos",
    body: "Parcerias com os melhores bancos do mercado para apresentar as melhores taxas de financiamento e leasing para automóveis.",
    whatsappText: "Olá! Gostaria de simular um financiamento.",
  },
] as const;

/** Pontos institucionais da página "Nossa empresa" (ver docs/conteudo-oficial.md). */
export const companyPillars = [
  {
    title: "Procedência",
    body: "Garantia de procedência de todos os veículos, nacionais e importados.",
  },
  {
    title: "Atendimento exclusivo",
    body: "Atendimento exclusivo e diferenciado, com uma estrutura moderna e dinâmica.",
  },
  {
    title: "Pós-venda",
    body: "Alto padrão de serviços, pós-venda e bom relacionamento com os clientes.",
  },
  {
    title: "Relacionamento",
    body: "Quem escolhe a JAT passa a fazer parte de uma família que respeita o cliente.",
  },
] as const;
