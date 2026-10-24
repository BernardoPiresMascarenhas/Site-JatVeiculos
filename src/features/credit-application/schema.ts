/**
 * Ficha cadastral: definição declarativa das etapas e campos.
 *
 * Estrutura baseada na ficha do site oficial (dados pessoais, cônjuge,
 * endereço, dados profissionais, referências e bem a ser financiado),
 * reorganizada em 4 etapas. A mesma definição deve ser reutilizada na
 * validação do servidor quando o envio for implementado.
 *
 * Minimização (LGPD): número de conta corrente e dados bancários completos
 * não são coletados aqui; devem ser solicitados apenas por canal seguro.
 */

export type Mask = "cpf" | "cnpj" | "cep" | "phone" | "currency";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "month" | "number" | "select";
  required?: boolean;
  mask?: Mask;
  options?: readonly FieldOption[];
  /** Dado sensível ou financeiro: sem autocompletar e mascarado na revisão. */
  sensitive?: boolean;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  /** Colunas ocupadas na grade de 6 colunas (desktop). */
  span?: 2 | 3 | 4 | 6;
  /** Exibe o campo somente quando a condição for verdadeira. */
  when?: (values: FormValues) => boolean;
  /** Campo calculado, apenas leitura. */
  compute?: (values: FormValues) => string;
}

export interface FieldGroup {
  title?: string;
  fields: FieldDef[];
  when?: (values: FormValues) => boolean;
}

export interface StepDef {
  id: string;
  title: string;
  description: string;
  groups: FieldGroup[];
}

export type FormValues = Record<string, string>;

const UF = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(
  (uf) => ({ value: uf, label: uf }),
);

const opts = (...labels: string[]) => labels.map((label) => ({ value: label, label }));

const hasSpouse = (v: FormValues) => v.estadoCivil === "Casado(a)" || v.estadoCivil === "União estável";

const toNumber = (currency: string) => Number(currency.replace(/\D/g, "")) / 100;
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const steps: StepDef[] = [
  {
    id: "pessoais",
    title: "Dados pessoais",
    description: "Identificação do proponente e, se houver, do cônjuge.",
    groups: [
      {
        fields: [
          { id: "nome", label: "Nome completo", type: "text", required: true, autoComplete: "name", span: 4 },
          { id: "dataNascimento", label: "Data de nascimento", type: "date", required: true, span: 2 },
          { id: "cpf", label: "CPF", type: "text", mask: "cpf", required: true, sensitive: true, placeholder: "000.000.000-00", span: 2 },
          { id: "rg", label: "RG", type: "text", sensitive: true, span: 2 },
          { id: "rgOrgao", label: "Órgão emissor / UF", type: "text", placeholder: "SSP/MG", span: 2 },
          { id: "celular", label: "Celular", type: "tel", mask: "phone", required: true, autoComplete: "tel", span: 2 },
          { id: "email", label: "E-mail", type: "email", required: true, autoComplete: "email", span: 4 },
          { id: "estadoCivil", label: "Estado civil", type: "select", required: true, options: opts("Solteiro(a)", "Casado(a)", "União estável", "Divorciado(a)", "Viúvo(a)"), span: 2 },
          { id: "naturalidade", label: "Naturalidade", type: "text", span: 2 },
          { id: "dependentes", label: "Nº de dependentes", type: "number", span: 2 },
          { id: "nomeMae", label: "Nome da mãe", type: "text", span: 3 },
          { id: "nomePai", label: "Nome do pai", type: "text", span: 3 },
        ],
      },
      {
        title: "Cônjuge",
        when: hasSpouse,
        fields: [
          { id: "conjugeNome", label: "Nome do cônjuge", type: "text", required: true, span: 4 },
          { id: "conjugeNascimento", label: "Data de nascimento", type: "date", span: 2 },
          { id: "conjugeCpf", label: "CPF do cônjuge", type: "text", mask: "cpf", sensitive: true, span: 3 },
        ],
      },
    ],
  },
  {
    id: "endereco",
    title: "Endereço",
    description: "Endereço residencial atual.",
    groups: [
      {
        fields: [
          { id: "cep", label: "CEP", type: "text", mask: "cep", required: true, autoComplete: "postal-code", span: 2 },
          { id: "logradouro", label: "Endereço", type: "text", required: true, autoComplete: "address-line1", span: 4 },
          { id: "numero", label: "Número", type: "text", required: true, span: 2 },
          { id: "complemento", label: "Complemento", type: "text", autoComplete: "address-line2", span: 2 },
          { id: "bairro", label: "Bairro", type: "text", required: true, span: 2 },
          { id: "cidade", label: "Cidade", type: "text", required: true, autoComplete: "address-level2", span: 4 },
          { id: "uf", label: "UF", type: "select", required: true, options: UF, span: 2 },
          { id: "tipoResidencia", label: "Tipo de residência", type: "select", options: opts("Própria", "Alugada", "Financiada", "Familiar", "Outro"), span: 3 },
          { id: "tempoResidencia", label: "Tempo de residência", type: "select", options: opts("Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "Mais de 5 anos"), span: 3 },
        ],
      },
    ],
  },
  {
    id: "profissional",
    title: "Informações profissionais",
    description: "Ocupação e renda, usadas na análise de crédito.",
    groups: [
      {
        fields: [
          { id: "ocupacao", label: "Tipo de ocupação", type: "select", required: true, options: opts("Assalariado(a)", "Servidor(a) público(a)", "Autônomo(a)", "Empresário(a)", "Profissional liberal", "Aposentado(a) / pensionista"), span: 3 },
          { id: "profissao", label: "Profissão", type: "text", required: true, span: 3 },
          { id: "empresa", label: "Empresa", type: "text", autoComplete: "organization", span: 4 },
          { id: "cnpj", label: "CNPJ da empresa", type: "text", mask: "cnpj", span: 2 },
          { id: "cargo", label: "Cargo ou função", type: "text", span: 2 },
          { id: "admissao", label: "Data de admissão", type: "month", span: 2 },
          { id: "telefoneComercial", label: "Telefone comercial", type: "tel", mask: "phone", span: 2 },
          { id: "renda", label: "Renda mensal bruta", type: "text", mask: "currency", required: true, sensitive: true, span: 3 },
          { id: "outrasRendas", label: "Outras fontes de renda", type: "text", mask: "currency", sensitive: true, span: 3, hint: "Opcional. Informe a origem abaixo." },
          { id: "origemOutrasRendas", label: "Origem das outras rendas", type: "text", span: 6, when: (v) => toNumber(v.outrasRendas ?? "") > 0 },
        ],
      },
    ],
  },
  {
    id: "financiamento",
    title: "Financiamento",
    description: "Bem a ser financiado, condições desejadas e referências.",
    groups: [
      {
        title: "Bem a ser financiado",
        fields: [
          { id: "veiculo", label: "Veículo de interesse", type: "text", required: true, placeholder: "Marca, modelo e ano", span: 4 },
          { id: "combustivel", label: "Combustível", type: "select", options: opts("Flex", "Gasolina", "Diesel", "Híbrido", "Elétrico"), span: 2 },
          { id: "valorVenda", label: "Valor de venda", type: "text", mask: "currency", required: true, sensitive: true, span: 2 },
          { id: "entrada", label: "Entrada", type: "text", mask: "currency", sensitive: true, span: 2 },
          {
            id: "valorFinanciado",
            label: "Valor a financiar",
            type: "text",
            span: 2,
            compute: (v) => {
              const total = toNumber(v.valorVenda ?? "") - toNumber(v.entrada ?? "");
              return total > 0 ? brl(total) : "";
            },
          },
          { id: "parcelas", label: "Nº de parcelas", type: "select", required: true, options: opts("12", "24", "36", "48", "60"), span: 2 },
        ],
      },
      {
        title: "Referências",
        fields: [
          { id: "refPessoalNome", label: "Referência pessoal", type: "text", span: 4 },
          { id: "refPessoalTelefone", label: "Telefone", type: "tel", mask: "phone", span: 2 },
          { id: "refBanco", label: "Banco de relacionamento", type: "text", span: 4, hint: "Dados de conta não são solicitados neste formulário." },
          { id: "refAgencia", label: "Agência", type: "text", span: 2 },
        ],
      },
    ],
  },
];

export const allFields = steps.flatMap((s) => s.groups.flatMap((g) => g.fields));

/**
 * Valores claramente fictícios para demonstrar a navegação.
 * Documentos zerados e domínio reservado (example.com): não correspondem a pessoas reais.
 */
export const fictitiousValues: FormValues = {
  nome: "Cliente Exemplo",
  dataNascimento: "1990-01-01",
  cpf: "000.000.000-00",
  rg: "00.000.000",
  rgOrgao: "SSP/MG",
  celular: "(31) 90000-0000",
  email: "cliente@example.com",
  estadoCivil: "Solteiro(a)",
  naturalidade: "Belo Horizonte",
  dependentes: "0",
  cep: "00000-000",
  logradouro: "Rua Exemplo",
  numero: "0",
  bairro: "Bairro Exemplo",
  cidade: "Belo Horizonte",
  uf: "MG",
  tipoResidencia: "Própria",
  ocupacao: "Assalariado(a)",
  profissao: "Profissão exemplo",
  empresa: "Empresa Exemplo",
  renda: "R$ 0,00",
  veiculo: "Veículo demonstrativo",
  valorVenda: "R$ 0,00",
  parcelas: "48",
};
