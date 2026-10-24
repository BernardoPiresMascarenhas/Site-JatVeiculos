"use client";

import { ArrowUpRight } from "lucide-react";
import { useId, useState } from "react";
import { services } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

const subjects = [...services.map((s) => s.title), "Visita à loja", "Outro assunto"];

/**
 * Monta uma mensagem e abre o WhatsApp da JAT em nova aba.
 * Nenhum dado é enviado a servidores deste site nem armazenado.
 */
export function ContactComposer() {
  const id = useId();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  const text = [
    `Olá, JAT! Meu nome é ${name.trim() || "…"}.`,
    `Assunto: ${subject}.`,
    message.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  const nameError = touched && !name.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim()) return;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={submit} noValidate className="surface border border-white/10 bg-ink p-6 md:p-10">
      <p className="eyebrow text-fog">Mensagem rápida</p>
      <h2 className="headline mt-3 text-2xl uppercase md:text-3xl">Escreva e continue no WhatsApp</h2>

      <div className="mt-8 grid gap-5">
        <div>
          <label htmlFor={`${id}-name`} className="eyebrow mb-2 block text-fog">
            Seu nome
          </label>
          <input
            id={`${id}-name`}
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="given-name"
            aria-invalid={nameError}
            aria-describedby={nameError ? `${id}-name-error` : undefined}
            maxLength={60}
          />
          {nameError && (
            <p id={`${id}-name-error`} className="mt-2 text-xs text-danger">
              Informe seu nome para personalizar a mensagem.
            </p>
          )}
        </div>

        <fieldset>
          <legend className="eyebrow mb-3 block text-fog">Assunto</legend>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <label
                key={s}
                className="cursor-pointer border border-white/12 px-3 py-2 text-sm text-mist transition-colors hover:border-white/40 has-[:checked]:border-ice has-[:checked]:bg-ice has-[:checked]:text-carbon has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand"
              >
                <input
                  type="radio"
                  name={`${id}-subject`}
                  value={s}
                  checked={subject === s}
                  onChange={() => setSubject(s)}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${id}-message`} className="eyebrow mb-2 block text-fog">
            Mensagem <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <textarea
            id={`${id}-message`}
            className="field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={600}
            placeholder="Conte o que procura: modelo, faixa de preço, ano…"
          />
        </div>

        <div className="border-l-2 border-brand/60 bg-graphite/60 px-4 py-3">
          <p className="eyebrow mb-2 text-[0.58rem] text-fog">Prévia</p>
          <p className="text-sm whitespace-pre-line text-mist">{text}</p>
        </div>

        <button type="submit" className="btn btn-primary w-full sm:w-auto sm:justify-self-start">
          Abrir no WhatsApp
          <ArrowUpRight className="btn-arrow size-4" aria-hidden />
        </button>
        <p className="text-xs leading-relaxed text-fog">
          A conversa abre no seu WhatsApp para você revisar e enviar. Este site não envia nem armazena seus
          dados. Não inclua CPF, RG ou outros dados sensíveis.
        </p>
      </div>
    </form>
  );
}
