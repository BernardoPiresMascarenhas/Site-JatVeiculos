import type { FieldDef, FormValues, Mask, StepDef } from "./schema";

const digits = (v: string) => v.replace(/\D/g, "");

/** Aplica a máscara enquanto o usuário digita. */
export function applyMask(mask: Mask, raw: string) {
  const d = digits(raw);
  switch (mask) {
    case "cpf":
      return d.slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    case "cnpj":
      return d
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    case "cep":
      return d.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    case "phone": {
      const p = d.slice(0, 11);
      if (p.length <= 10) return p.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
      return p.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{4})$/, "$1-$2");
    }
    case "currency": {
      if (!d) return "";
      const n = Number(d.slice(0, 12)) / 100;
      return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
  }
}

const lengths: Partial<Record<Mask, number[]>> = { cpf: [11], cnpj: [14], cep: [8], phone: [10, 11] };

export function validateField(field: FieldDef, value: string): string | null {
  const v = value.trim();
  if (!v) return field.required ? "Campo obrigatório." : null;
  if (field.mask && lengths[field.mask] && !lengths[field.mask]!.includes(digits(v).length)) {
    return "Formato incompleto.";
  }
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "E-mail inválido.";
  if (field.type === "date" && Number.isNaN(Date.parse(v))) return "Data inválida.";
  return null;
}

export function visibleFields(step: StepDef, values: FormValues) {
  return step.groups
    .filter((g) => !g.when || g.when(values))
    .flatMap((g) => g.fields)
    .filter((f) => !f.when || f.when(values));
}

export function validateStep(step: StepDef, values: FormValues) {
  const errors: Record<string, string> = {};
  for (const field of visibleFields(step, values)) {
    if (field.compute) continue;
    const error = validateField(field, values[field.id] ?? "");
    if (error) errors[field.id] = error;
  }
  return errors;
}

/** Exibição na revisão: datas em pt-BR e dados sensíveis parcialmente ocultos. */
export function formatForReview(field: FieldDef, value: string) {
  if (!value) return value;
  if (field.type === "date") return value.split("-").reverse().join("/");
  if (field.type === "month") return value.split("-").reverse().join("/");
  if (!field.sensitive) return value;
  return value.replace(/\d(?=(?:\D*\d){2})/g, "•");
}
