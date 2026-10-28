"use client";

import { ArrowUpRight, Info } from "lucide-react";
import { useId, useState, useSyncExternalStore } from "react";
import { site } from "@/config/site";
import {
  type InterestErrors,
  type InterestValues,
  type VehicleRef,
  deliverInterest,
  interestChannel,
  interestLimits,
  interestMessage,
  maskWhatsapp,
  validateInterest,
} from "@/features/vehicle-interest/interest";

/** Endereço real da página (no build, `site.url` pode não ser o domínio publicado). */
const noop = () => () => {};
function useOrigin() {
  return useSyncExternalStore(noop, () => window.location.origin, () => site.url);
}

type Status = { kind: "idle" } | { kind: "opened"; url: string } | { kind: "demo" };

const fields = ["name", "whatsapp", "message"] as const;

/**
 * "Interessado neste veículo?": nome, WhatsApp e mensagem opcional. O veículo é
 * identificado automaticamente. Canal e regras de privacidade em
 * `src/features/vehicle-interest/interest.ts`.
 */
export function VehicleInterestForm({ vehicle, anchorId = "interesse" }: { vehicle: VehicleRef; anchorId?: string }) {
  const id = useId();
  const origin = useOrigin();
  const [values, setValues] = useState<InterestValues>({ name: "", whatsapp: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof InterestValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const allErrors = validateInterest(values);
  const errors: InterestErrors = Object.fromEntries(
    fields.filter((f) => (submitted || touched[f]) && allErrors[f]).map((f) => [f, allErrors[f]]),
  );
  const text = interestMessage(vehicle, values, `${origin}${vehicle.path}`);

  const update = (field: keyof InterestValues, value: string) => {
    setValues((v) => ({ ...v, [field]: field === "whatsapp" ? maskWhatsapp(value) : value }));
    // Editar depois de abrir o WhatsApp exige abrir de novo com a mensagem atualizada.
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const invalid = fields.find((f) => allErrors[f]);
    if (invalid) {
      document.getElementById(`${id}-${invalid}`)?.focus();
      return;
    }
    const delivery = deliverInterest(text);
    if (delivery.channel === "whatsapp") {
      window.open(delivery.url, "_blank", "noopener,noreferrer");
      setStatus({ kind: "opened", url: delivery.url });
    } else {
      setStatus({ kind: "demo" });
    }
  };

  const describedBy = (field: keyof InterestValues, hint?: string) =>
    [hint, errors[field] && `${id}-${field}-error`].filter(Boolean).join(" ") || undefined;

  return (
    <section
      id={anchorId}
      aria-labelledby={`${id}-title`}
      // O cabeçalho fixo não cobre o título ao navegar pela âncora.
      className="scroll-mt-[calc(5.5rem+env(safe-area-inset-top))]"
    >
      <h2 id={`${id}-title`} tabIndex={-1} className="headline text-[1.35rem] uppercase outline-none md:text-2xl">
        Interessado neste veículo?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-fog">Deixe seus dados para consultar nossa equipe sobre este veículo.</p>

      <form onSubmit={submit} noValidate className="mt-6 grid grid-cols-1 gap-5">
        {/* Identificação automática do anúncio */}
        <div className="border-l-2 border-brand bg-graphite px-4 py-3">
          <p className="eyebrow text-[0.58rem] text-fog">Veículo</p>
          <p className="mt-1.5 text-sm leading-snug text-ice">{vehicle.label}</p>
          <p className="mt-1 truncate font-mono text-[0.68rem] text-fog">Ref. {vehicle.id}</p>
        </div>

        <div>
          <label htmlFor={`${id}-name`} className="eyebrow mb-2 block text-fog">
            Nome
          </label>
          <input
            id={`${id}-name`}
            name="name"
            className="field"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            maxLength={interestLimits.name}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
          />
          {errors.name && (
            <p id={`${id}-name-error`} className="mt-2 text-xs text-danger">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-whatsapp`} className="eyebrow mb-2 block text-fog">
            WhatsApp
          </label>
          <input
            id={`${id}-whatsapp`}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            className="field font-mono tracking-wide"
            value={values.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, whatsapp: true }))}
            autoComplete="tel-national"
            enterKeyHint="next"
            placeholder="(31) 98765-4321"
            required
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={describedBy("whatsapp")}
          />
          {errors.whatsapp && (
            <p id={`${id}-whatsapp-error`} className="mt-2 text-xs text-danger">
              {errors.whatsapp}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <label htmlFor={`${id}-message`} className="eyebrow block text-fog">
              Mensagem <span className="tracking-normal normal-case">(opcional)</span>
            </label>
            <span className="font-mono text-[0.65rem] text-fog" aria-hidden>
              {values.message.length}/{interestLimits.message}
            </span>
          </div>
          <textarea
            id={`${id}-message`}
            name="message"
            className="field min-h-[6.5rem]"
            rows={3}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            maxLength={interestLimits.message}
            placeholder="Ex.: gostaria de agendar uma visita para conhecer o veículo."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
          />
          {errors.message && (
            <p id={`${id}-message-error`} className="mt-2 text-xs text-danger">
              {errors.message}
            </p>
          )}
        </div>

        <details className="group/preview text-sm">
          <summary className="eyebrow flex min-h-11 cursor-pointer list-none items-center gap-2 text-fog transition-colors hover:text-ice [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="inline-block transition-transform duration-300 group-open/preview:rotate-90">
              ›
            </span>
            Prévia da mensagem
          </summary>
          <p className="mt-1 border-l-2 border-white/15 py-1 pl-4 text-[0.8rem] leading-relaxed break-words whitespace-pre-line text-mist">
            {text}
          </p>
        </details>

        <button type="submit" className="btn btn-light w-full">
          {interestChannel === "whatsapp" ? "Continuar no WhatsApp" : "Ver mensagem (demonstração)"}
          <ArrowUpRight className="btn-arrow size-4" aria-hidden />
        </button>

        <div aria-live="polite" className="empty:hidden">
          {status.kind === "opened" && (
            <div className="border border-white/15 px-4 py-3 text-sm leading-relaxed text-mist">
              <p>
                O WhatsApp foi aberto em uma nova aba com a sua mensagem.{" "}
                <strong className="font-semibold text-ice">Para concluir, revise e envie por lá.</strong>
              </p>
              <a
                href={status.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-ice underline decoration-brand underline-offset-4 hover:decoration-2"
              >
                Não abriu? Abrir o WhatsApp
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </div>
          )}
          {status.kind === "demo" && (
            <p className="border border-white/15 px-4 py-3 text-sm leading-relaxed text-mist">
              Modo demonstrativo: nada foi enviado. A “Prévia da mensagem” mostra o texto que seria encaminhado à equipe.
            </p>
          )}
        </div>

        <p className="flex gap-2 text-xs leading-relaxed text-fog">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>
            {interestChannel === "whatsapp"
              ? `Você será direcionado ao WhatsApp da JAT, ${site.contact.whatsapp}, para revisar e enviar a mensagem. `
              : "Demonstração: o formulário não envia dados. "}
            Este site não armazena seus dados. Não informe CPF, RG ou dados bancários.
          </span>
        </p>
      </form>
    </section>
  );
}
