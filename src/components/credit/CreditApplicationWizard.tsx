"use client";

import { ArrowLeft, ArrowRight, Check, Eraser, Lock, MessageCircle, Pencil, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import { creditApplicationGateway } from "@/features/credit-application/gateway";
import { type FieldDef, type FormValues, fictitiousValues, steps } from "@/features/credit-application/schema";
import { applyMask, formatForReview, validateStep, visibleFields } from "@/features/credit-application/validation";
import { whatsappLink } from "@/lib/whatsapp";

const ease = [0.16, 1, 0.3, 1] as const;
const REVIEW = steps.length;
const spanClass = { 2: "sm:col-span-2", 3: "sm:col-span-3", 4: "sm:col-span-4", 6: "sm:col-span-6" } as const;

function Field({
  field,
  values,
  error,
  onChange,
}: {
  field: FieldDef;
  values: FormValues;
  error?: string;
  onChange: (id: string, value: string) => void;
}) {
  const id = `ficha-${field.id}`;
  const describedBy = [error && `${id}-erro`, field.hint && `${id}-dica`].filter(Boolean).join(" ") || undefined;
  const value = field.compute ? field.compute(values) : (values[field.id] ?? "");
  const common = {
    id,
    name: field.id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": field.required || undefined,
    // Dados sensíveis não são memorizados pelo preenchimento automático do navegador.
    autoComplete: field.sensitive ? "off" : (field.autoComplete ?? "off"),
    className: `field ${error ? "border-danger" : ""}`,
  };

  return (
    <div className={`col-span-6 ${spanClass[field.span ?? 6]}`}>
      <label htmlFor={id} className="eyebrow mb-2 flex items-center gap-1.5 text-[0.62rem] text-fog">
        {field.label}
        {field.required && <span className="text-accent" aria-hidden>*</span>}
        {field.sensitive && <Lock className="size-3 text-accent/80" aria-label="dado sensível" />}
      </label>
      {field.type === "select" ? (
        <select {...common} value={value} onChange={(e) => onChange(field.id, e.target.value)}>
          <option value="">Selecione</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={field.mask ? "text" : field.type}
          inputMode={field.mask === "currency" || field.mask === "cpf" || field.mask === "cep" || field.mask === "cnpj" ? "numeric" : field.mask === "phone" ? "tel" : undefined}
          value={value}
          readOnly={Boolean(field.compute)}
          placeholder={field.compute ? "Calculado automaticamente" : field.placeholder}
          min={field.type === "number" ? 0 : undefined}
          onChange={(e) => onChange(field.id, field.mask ? applyMask(field.mask, e.target.value) : e.target.value)}
        />
      )}
      {field.hint && !error && (
        <p id={`${id}-dica`} className="mt-1.5 text-xs text-fog">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={`${id}-erro`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function CreditApplicationWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [consent, setConsent] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const consentId = useId();

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setErrors({});
    top.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  };

  const onChange = (id: string, value: string) => {
    setValues((v) => ({ ...v, [id]: value }));
    if (errors[id]) {
      setErrors((current) => {
        const rest = { ...current };
        delete rest[id];
        return rest;
      });
    }
  };

  const next = () => {
    const found = validateStep(steps[step], values);
    if (Object.keys(found).length) {
      setErrors(found);
      document.getElementById(`ficha-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setCompleted((c) => new Set(c).add(step));
    goTo(step + 1);
  };

  const reset = () => {
    setValues({});
    setErrors({});
    setCompleted(new Set());
    setConsent(false);
    goTo(0);
  };

  const fillFictitious = () => {
    setValues(fictitiousValues);
    setErrors({});
  };

  const progress = Math.round((Math.min(step, REVIEW) / REVIEW) * 100);
  const current = steps[step];

  return (
    <div ref={top} className="scroll-mt-24">
      {/* Aviso de protótipo */}
      <div className="flex flex-col gap-4 border border-white/15 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex gap-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <p className="text-sm leading-relaxed text-mist">
            <strong className="font-semibold text-ice">Protótipo de interface.</strong> Nenhum dado é enviado,
            armazenado ou transmitido: tudo fica apenas nesta aba e é descartado ao sair. Não informe dados reais.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={fillFictitious} className="btn btn-ghost min-h-11 px-4 text-[0.7rem]">
            <Sparkles className="size-3.5" aria-hidden />
            Dados fictícios
          </button>
          <button type="button" onClick={reset} className="btn btn-ghost min-h-11 px-4 text-[0.7rem]" aria-label="Apagar todos os campos">
            <Eraser className="size-3.5" aria-hidden />
            Limpar
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Etapas */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="mb-3 flex items-baseline justify-between lg:hidden">
              <p className="eyebrow text-fog">
                {step < REVIEW ? `Etapa ${step + 1} de ${steps.length}` : "Revisão"}
              </p>
              <p className="eyebrow text-fog tabular-nums">{progress}%</p>
            </div>
            <div className="h-px bg-white/10 lg:hidden" aria-hidden>
              <motion.div className="h-px bg-brand" animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease }} />
            </div>

            <ol className="hidden border-l border-white/10 lg:block" aria-label="Etapas da ficha">
              {[...steps.map((s) => s.title), "Revisão"].map((title, i) => {
                const isCurrent = i === step;
                const isDone = completed.has(i);
                const reachable = i <= step || completed.has(i) || (i === REVIEW && steps.every((_, j) => completed.has(j)));
                return (
                  <li key={title} className="relative">
                    {isCurrent && (
                      <motion.span layoutId="ficha-step" className="absolute top-0 -left-px h-full w-px bg-brand" transition={{ duration: 0.5, ease }} />
                    )}
                    <button
                      type="button"
                      disabled={!reachable || isCurrent}
                      onClick={() => goTo(i)}
                      aria-current={isCurrent ? "step" : undefined}
                      className="group flex w-full items-center gap-4 py-4 pl-6 text-left disabled:cursor-default"
                    >
                      <span
                        className={`grid size-8 shrink-0 place-items-center border font-mono text-[0.7rem] transition-colors duration-500 ${
                          isCurrent ? "border-ice bg-ice text-carbon" : isDone ? "border-brand/60 text-accent" : "border-white/15 text-fog"
                        }`}
                      >
                        {isDone && !isCurrent ? <Check className="size-3.5" aria-hidden /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`headline text-sm uppercase transition-colors ${isCurrent ? "text-ice" : reachable ? "text-mist group-hover:text-ice" : "text-smoke"}`}>
                        {title}
                        {isDone && !isCurrent && <span className="sr-only"> (concluída)</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 hidden border-t border-white/10 pt-6 text-xs leading-relaxed text-fog lg:block">
              <p className="eyebrow mb-3 text-[0.6rem] text-mist">Privacidade</p>
              <p>
                Campos com <Lock className="inline size-3 text-accent/80" aria-hidden /> são dados sensíveis ou financeiros.
                Na versão definitiva, o envio exigirá consentimento expresso, conexão segura e armazenamento
                protegido, conforme a LGPD.
              </p>
            </div>
          </div>
        </aside>

        {/* Formulário */}
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (step < REVIEW) next();
          }}
          className="surface min-w-0 border border-white/10 bg-ink lg:col-span-8"
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.45, ease }}
              className="p-6 md:p-10"
            >
              {step < REVIEW ? (
                <>
                  <p className="eyebrow text-accent">Etapa {String(step + 1).padStart(2, "0")}</p>
                  <h2 ref={heading} tabIndex={-1} className="headline mt-3 text-2xl uppercase outline-none md:text-3xl">
                    {current.title}
                  </h2>
                  <p className="mt-2 text-sm text-fog">{current.description}</p>

                  {Object.keys(errors).length > 0 && (
                    <p role="alert" className="mt-6 border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm text-ice">
                      Revise {Object.keys(errors).length === 1 ? "o campo destacado" : `os ${Object.keys(errors).length} campos destacados`} para continuar.
                    </p>
                  )}

                  {current.groups
                    .filter((g) => !g.when || g.when(values))
                    .map((group, gi) => (
                      <fieldset key={group.title ?? gi} className="mt-8">
                        {group.title && (
                          <legend className="eyebrow mb-5 flex w-full items-center gap-3 text-mist">
                            {group.title}
                            <span aria-hidden className="h-px flex-1 bg-white/10" />
                          </legend>
                        )}
                        <div className="grid grid-cols-6 gap-x-4 gap-y-5">
                          {group.fields
                            .filter((f) => !f.when || f.when(values))
                            .map((field) => (
                              <Field key={field.id} field={field} values={values} error={errors[field.id]} onChange={onChange} />
                            ))}
                        </div>
                      </fieldset>
                    ))}
                </>
              ) : (
                <Review values={values} consent={consent} consentId={consentId} onConsent={setConsent} onEdit={goTo} onReset={reset} headingRef={heading} />
              )}
            </motion.div>
          </AnimatePresence>

          {step < REVIEW && (
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-5 md:px-10">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                className="btn btn-ghost min-h-12 px-5 disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Voltar
              </button>
              <button type="submit" className="btn btn-primary min-h-12 px-6">
                {step === steps.length - 1 ? "Revisar" : "Continuar"}
                <ArrowRight className="btn-arrow size-4" aria-hidden />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Review({
  values,
  consent,
  consentId,
  onConsent,
  onEdit,
  onReset,
  headingRef,
}: {
  values: FormValues;
  consent: boolean;
  consentId: string;
  onConsent: (v: boolean) => void;
  onEdit: (step: number) => void;
  onReset: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <>
      <p className="eyebrow text-accent">Revisão</p>
      <h2 ref={headingRef} tabIndex={-1} className="headline mt-3 text-2xl uppercase outline-none md:text-3xl">
        Confira as informações
      </h2>
      <p className="mt-2 text-sm text-fog">Dados sensíveis aparecem parcialmente ocultos.</p>

      <div className="mt-8 space-y-8">
        {steps.map((s, i) => {
          const filled = visibleFields(s, values)
            .map((f) => ({ f, value: f.compute ? f.compute(values) : (values[f.id] ?? "") }))
            .filter(({ value }) => value);
          return (
            <section key={s.id} aria-labelledby={`revisao-${s.id}`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 id={`revisao-${s.id}`} className="headline text-sm uppercase">
                  {s.title}
                </h3>
                <button type="button" onClick={() => onEdit(i)} className="eyebrow flex items-center gap-1.5 text-fog transition-colors hover:text-ice">
                  <Pencil className="size-3" aria-hidden />
                  Editar
                </button>
              </div>
              {filled.length ? (
                <dl className="grid gap-x-6 sm:grid-cols-2">
                  {filled.map(({ f, value }) => (
                    <div key={f.id} className="flex justify-between gap-4 border-b border-white/[0.06] py-2.5 text-sm">
                      <dt className="text-fog">{f.label}</dt>
                      <dd className="text-right text-ice">{formatForReview(f, value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="py-3 text-sm text-fog">Nenhum campo preenchido.</p>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-10 border border-white/10 bg-graphite/50 p-5">
        <label htmlFor={consentId} className="flex cursor-pointer gap-3 text-sm leading-relaxed text-mist">
          <input
            id={consentId}
            type="checkbox"
            checked={consent}
            onChange={(e) => onConsent(e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-brand"
          />
          <span>
            Autorizo o tratamento dos meus dados pela JAT Veículos para análise de crédito e simulação de
            financiamento, conforme a política de privacidade.{" "}
            <em className="text-fog not-italic">(texto ilustrativo: a redação final deve ser definida pela empresa)</em>
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={!creditApplicationGateway.enabled}
          aria-describedby="envio-desativado"
          className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar ficha
        </button>
        <button type="button" onClick={onReset} className="btn btn-ghost">
          <Eraser className="size-4" aria-hidden />
          Apagar dados e recomeçar
        </button>
      </div>
      <p id="envio-desativado" className="mt-4 text-sm leading-relaxed text-fog">
        <Lock className="mr-1.5 inline size-3.5 text-accent" aria-hidden />
        Envio desativado neste protótipo: nenhum dado foi enviado à JAT. Para iniciar um financiamento de
        verdade, fale com a equipe.{" "}
        <a
          href={whatsappLink("Olá, JAT! Gostaria de iniciar uma ficha cadastral para financiamento.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-ice underline decoration-brand underline-offset-4"
        >
          <MessageCircle className="size-3.5" aria-hidden />
          WhatsApp
        </a>
      </p>
    </>
  );
}
