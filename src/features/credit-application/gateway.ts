import type { FormValues } from "./schema";

/**
 * Ponto único de envio da ficha cadastral.
 *
 * Neste protótipo o envio está DESATIVADO: nenhum dado sai do navegador,
 * nada é armazenado (nem em localStorage) e a interface não simula sucesso.
 *
 * Implementação futura (ver docs/ficha-cadastral.md):
 * - Server Action ou rota HTTPS própria, nunca e-mail em texto aberto.
 * - Revalidar no servidor com o mesmo esquema (`schema.ts` + `validation.ts`).
 * - Registrar o consentimento (versão do aviso de privacidade + data/hora).
 * - Criptografar em repouso, restringir acesso e definir prazo de retenção.
 * - Não registrar dados pessoais em logs, analytics ou ferramentas de erro.
 */

export interface ConsentRecord {
  accepted: boolean;
  privacyNoticeVersion: string;
}

export type SubmissionResult = { ok: true; protocol: string } | { ok: false; reason: "disabled" | "invalid" | "error" };

export interface CreditApplicationGateway {
  readonly enabled: boolean;
  submit(values: FormValues, consent: ConsentRecord): Promise<SubmissionResult>;
}

export const prototypeGateway: CreditApplicationGateway = {
  enabled: false,
  async submit() {
    return { ok: false, reason: "disabled" };
  },
};

export const creditApplicationGateway: CreditApplicationGateway = prototypeGateway;
