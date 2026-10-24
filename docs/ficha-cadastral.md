# Ficha cadastral: arquitetura e implementação futura

Estado atual: **protótipo de navegação**. Nenhum dado é enviado, armazenado ou transmitido. O botão "Enviar ficha" fica desativado (`creditApplicationGateway.enabled = false`) e a interface nunca exibe uma confirmação de envio.

## Organização

| Arquivo | Responsabilidade |
| --- | --- |
| `src/features/credit-application/schema.ts` | Etapas, grupos e campos (rótulo, tipo, máscara, obrigatoriedade, sensibilidade, condições). Baseado na ficha do site oficial. |
| `src/features/credit-application/validation.ts` | Máscaras, validação por campo e por etapa, e ocultação de dados sensíveis na revisão. |
| `src/features/credit-application/gateway.ts` | Interface única de envio. Hoje: `prototypeGateway` (desativado). |
| `src/components/credit/CreditApplicationWizard.tsx` | Interface em etapas, revisão e consentimento. Estado apenas em memória. |

## Etapas

1. **Dados pessoais**: identificação, contato, estado civil e cônjuge (exibido só para casado(a) ou união estável).
2. **Endereço**: residência atual, tipo e tempo de residência.
3. **Informações profissionais**: ocupação, empresa, admissão e renda.
4. **Financiamento**: bem a ser financiado, entrada, valor a financiar (calculado), parcelas e referências.
5. **Revisão**: resumo com dados sensíveis mascarados e consentimento.

Diferença intencional em relação à ficha oficial: **número de conta corrente e nome do gerente não são coletados** (minimização de dados). O banco e a agência bastam como referência; dados bancários completos, se necessários, devem ser pedidos depois, por canal seguro.

## Checklist para habilitar o envio

- [ ] Definir com a JAT a finalidade, a base legal, o prazo de retenção e quem acessa os dados.
- [ ] Publicar o aviso de privacidade e registrar a versão aceita (`ConsentRecord.privacyNoticeVersion`).
- [ ] Implementar `submit` em uma **Server Action** ou rota própria sob HTTPS; nunca enviar por e-mail em texto aberto nem por formulário de terceiros sem contrato de operador.
- [ ] Revalidar todos os campos no servidor com o mesmo `schema.ts`/`validation.ts`, e validar CPF/CNPJ pelos dígitos verificadores.
- [ ] Proteção contra abuso: limite de requisições, verificação anti-bot e tamanho máximo do payload.
- [ ] Armazenar criptografado em repouso, em sistema com controle de acesso e trilha de auditoria (CRM ou banco dedicado).
- [ ] Não registrar dados pessoais em logs, analytics, monitoramento de erros ou URLs.
- [ ] Gerar protocolo e confirmar o recebimento **somente** após a gravação no servidor.
- [ ] Atender aos direitos do titular (acesso, correção, eliminação) e indicar o canal do encarregado (DPO).
- [ ] Trocar `creditApplicationGateway` para a implementação real e remover os avisos de protótipo.
