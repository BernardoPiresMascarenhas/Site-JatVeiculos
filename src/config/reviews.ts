/**
 * AVALIAÇÕES NO GOOGLE
 *
 * Depoimentos publicados por clientes no perfil da JAT Veículos no Google
 * (identificador: 0xa697f05ea53d71:0xc6626d7f4bdcae26), fornecidos pelo autor
 * do projeto.
 *
 * Regras: copiar o texto exatamente como publicado, sem corrigir, resumir ou
 * editar. Nota, estrelas e datas só devem ser preenchidas se forem copiadas do
 * Google; a seção não exibe nenhum desses campos quando estão vazios.
 *
 * Estrelas: todas as avaliações cadastradas são de 5 estrelas no Google.
 * Ao adicionar uma nova, preencha `rating` com a nota publicada.
 */

const featureId = "0xa697f05ea53d71:0xc6626d7f4bdcae26";
const cid = "14295108560728403494";

export interface GoogleReview {
  /** Nome como aparece no Google. */
  author: string;
  /** Texto integral, sem alterações. */
  text: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  when?: string;
}

export const googleReviews = {
  /** Abre a lista de avaliações do perfil no Google. */
  reviewsUrl: `https://www.google.com/search?q=jat+veiculos#lrd=${featureId},1,,,,`,
  /** Abre o formulário para deixar uma avaliação. */
  writeReviewUrl: `https://www.google.com/search?q=jat+veiculos#lrd=${featureId},3,,,,`,
  mapsUrl: `https://www.google.com/maps?cid=${cid}`,

  reviews: [
    {
      author: "Lucas Quintão",
      rating: 5,
      text: "Comprei minha Q3 com o Flávio e o Melk. Atendimento de primeira! Carro estado de zero. Muito bom.",
    },
    {
      author: "Fernanda Quina",
      rating: 5,
      text: "Foi a minha 3a compra de veículos com a JAT e equipe. Flávio e Rattes sempre atenciosos, carros de procedência, confiáveis. Sou cliente desde 2011. Fazem simulações de melhores formas de pagamento, auxiliam na documentação. Continuarei a recomendar.",
    },
    {
      author: "Ronaldo Ribeiro",
      rating: 5,
      text: "Muito satisfeito com minha compra, o veículo estava em excelente estado de conservação. O vendedor Renato Guerra se mostrou muito prestativo tanto durante o processo de compra como no pós venda. Recomendo a JAT Veículos a todos.",
    },
    {
      author: "Bruno Gabarra",
      rating: 5,
      text: "Foi uma das melhores experiências de compra que já tive. Meu primeiro veículo premium, pensei que por chegar com meu symbol 2011 eu não iria ser bem atendido, pois não parecia congruente alguém chegar com um carro velho e comprar uma mercedes. Porém na prática foi bem diferente, o vendedor Renato me atendeu com a maior atenção do mundo, solucionou todas as minhas preocupações e conseguiu uma negociação fora da curva. Parabéns Flavio, seu negócio é um exemplo. Obrigado Renato pelo carinho atenção, vcs são incríveis!!",
    },
    {
      author: "Arcobaleno Brasil",
      rating: 5,
      text: "Sou de Porto Alegre e fiz a compra de um carro na Jat totalmente à distância. Fui muito bem atendida pelo Renato, que me passou segurança e me deu toda a assistência. O veículo veio de carreta e foi tudo bem. Super recomendo.",
    },
    {
      author: "Matheus Cunha",
      rating: 5,
      text: "Não tenho palavras para agradecer e descrever a experiência na JAT. Comprei minha primeira BMW com eles, fui muito bem atendido pelo Felipe e pelo Wanderson. Todo processo de compra durou apenas 5 dias e o carro super confiável e de procedência. Muito obrigado mais uma vez e super recomendo a JAT veiculos.",
    },
    {
      author: "Gustavo Guimaraes",
      rating: 5,
      text: "Excelente atendimento, pessoal muito honesto!",
    },
    {
      author: "Marcos Cordeiro",
      rating: 5,
      text: "Excelente experiência na Jat Veículos Premium! Comprei minha primeira BMW e fui muito bem atendido pelo Renato. Profissionalismo e pronto atendimento, inclusive fora do horário comercial. Recomendo!",
    },
    {
      author: "Evaldo Rezende",
      rating: 5,
      text: "Sou da Regiao dos Lagos RJ. No dia 11/05/2023 fui a Belo Horizonte na JAT VEÍCULOS PREMIUM, para compra de uma oferta de um veículo especifico. A empresa é extremamente idonea. O proprietário e vendedores formam uma equipe altamente qualificada, com alto conhecimento, e além disto, deram todo o suporte necessário da minha estadia na cidade . Fui atendido pelo vendedor Renato que é um ótimo negociador que transmitiu confiança, honestidade, segurança e alto conhecimento. Fiquei muito satisfeito com a transação a cordialidade dos funcionários e proprietário bem como a qualidade do veículo.",
    },
    {
      author: "Pri Mendes",
      rating: 5,
      // Quebras de linha preservadas como no original.
      text: "Minha segunda compra na Jat Veículos.\nExcelente experiência de compra! Veículos em ótimos estado, e de boa procedência.\nVendedor Flávio atencioso, acompanha toda a venda. Muito satisfeita com essa empresa!",
    },
  ] satisfies GoogleReview[] as GoogleReview[],
};

export const hasReviewData = () => googleReviews.reviews.length > 0;
