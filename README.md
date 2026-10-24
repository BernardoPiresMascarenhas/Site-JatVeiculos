# JAT Veículos: conceito de redesign

Showroom digital conceitual para a **JAT Veículos**, revenda de novos e seminovos em Belo Horizonte desde maio de 1995.

> **Projeto de portfólio não oficial**, sem vínculo com a JAT Veículos nem aprovação da empresa. Os anúncios do estoque foram conferidos no site oficial em 23/10/2026 e **não são atualizados em tempo real**. As informações comerciais (endereço, telefones, horário, serviços, história) foram conferidas em [jatveiculos.com.br](https://jatveiculos.com.br/) em 23/10/2026.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Motion · Lucide

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm run lint
```

Defina `NEXT_PUBLIC_SITE_URL` no deploy para gerar metadados, sitemap e URLs canônicas corretos.

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Hero cinematográfico, busca rápida, carrossel de marcas, destaques, showroom interativo, história, serviços, contato e mapa |
| `/estoque` | Catálogo com busca, filtros (marca, ano, preço, km, combustível), ordenação, contador, estado vazio e gaveta de filtros no mobile. Os filtros ficam sincronizados com a URL (`?marca=BMW&precoMax=750000`) |
| `/estoque/[slug]` | Apresentação do veículo: galeria com lightbox, ficha técnica, itens, CTA de WhatsApp e veículos relacionados |
| `/empresa` | História, a loja (fachada e showroom), posicionamento e serviços em composição editorial |
| `/contato` | Canais verificados, compositor de mensagem para WhatsApp e mapa |
| `/ficha-cadastral` | Protótipo da ficha cadastral em 4 etapas + revisão. Sem envio nem armazenamento ([detalhes](docs/ficha-cadastral.md)) |

## Onde editar o conteúdo

- **`src/config/site.ts`**: dados institucionais verificados (contato, endereço, horário, redes sociais, serviços, pilares) e a flag `concept.enabled`, que controla os avisos de "conceito" e o texto das mensagens de WhatsApp.
- **`src/data/vehicles.ts`**: modelo de dados e consultas do estoque. O showroom da home usa os veículos com o campo `showroom` (frase + ordem).
- **`src/data/official-vehicles.ts`**: anúncios conferidos no estoque oficial, com data de conferência e fotos do próprio veículo (vazio até haver fotos autorizadas).
- **`src/config/media.ts`**: manifesto das fotografias reais (hero, fachada, showroom). Salve o arquivo no caminho indicado e gere o build: o site troca o conteúdo provisório automaticamente.
- **`src/config/reviews.ts`**: avaliações do Google (nota, total e comentários copiados do perfil oficial). Vazio, a seção da home mostra só os links para ver e deixar avaliações.
- **`src/config/brands.ts`**: logotipos do carrossel de marcas (Simple Icons, CC0). Um SVG em `public/images/marcas/<slug>.svg` tem prioridade.
- **`public/brand`**: logotipo oficial JAT Veículos Premium (recortes sem alteração dos arquivos fornecidos em `public/images/Logótipo JAT Veículos Premium-*.png`).

## Materiais pendentes

| Arquivo | Uso | Situação atual |
| --- | --- | --- |
| `public/images/jat/hero.jpg` | Hero da página inicial (veículo real da JAT) | Porsche Panamera ilustrativo (Unsplash) |
| `public/images/jat/fachada.jpg` | Abertura e seção "A loja" da página A JAT | Foto ilustrativa na abertura; local reservado na seção |
| `public/images/jat/showroom.jpg` | Seção "A loja" | Local reservado |
| Pasta em `public/` + entrada em `official-vehicles.ts` | Novos anúncios com fotos do próprio veículo | 18 anúncios conferidos |
| `public/images/marcas/land-rover.svg` | Carrossel de marcas | Nome em texto |
| `public/images/marcas/jaguar.svg` | Carrossel de marcas | Nome em texto |

Fotos do estoque oficial (49 anúncios conferidos em 23/10/2026) ficam na plataforma da revenda e dependem de autorização da JAT; por isso não foram copiadas.

## Decisões do protótipo

- **Nada é armazenado.** O formulário de contato apenas monta uma mensagem e abre o WhatsApp da loja para o visitante revisar e enviar. A ficha cadastral é um protótipo: os dados ficam só em memória e o envio está desativado.
- **WhatsApp real.** Os links abrem o número verificado da JAT. A mensagem de cada anúncio pede confirmação de disponibilidade, já que o estoque não é sincronizado.
- **Galeria.** Com `photos` preenchido, mostra as fotos do próprio anúncio. Sem elas, gera três enquadramentos da mesma fotografia e indica isso; nunca mistura fotos de veículos diferentes.
- **Sem indexação.** `robots` bloqueia indexadores enquanto `concept.enabled` for `true`, para não competir com o site oficial.
- **Movimento.** As animações respeitam `prefers-reduced-motion` (via `MotionConfig reducedMotion="user"` e CSS).
- **Identidade.** Cabeçalho, rodapé e favicon usam o logotipo oficial fornecido, sem redesenho.
- **Paleta.** Tokens no bloco `@theme` de `src/app/globals.css` (espelhados em `src/config/theme.ts`): carbono `#0B0D10`, amarelo da marca `#FDBF01` (ações principais e indicadores ativos), dourado `#E0A800` (hover), dourado escuro `#7D5C00` (texto sobre fundo claro), gelo `#F5F5F5` e cinzas neutros. O vermelho (`danger`) é usado apenas em erros e validação. Selos informativos ("Conferido em…", "Conceito") são neutros para não competir com a marca.
