"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** Texto usado na busca por digitação quando `label` não é string. */
  text?: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Exibido quando nenhuma opção corresponde ao valor (ex.: "Selecione"). */
  placeholder?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  /**
   * `field`: caixa com borda, igual aos demais campos.
   * `bare`: só o texto, para encaixar em contêineres que já têm moldura.
   */
  variant?: "field" | "bare";
  className?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;
const MAX_HEIGHT = 288;
const GAP = 6;

type Placement = { top: number; left: number; width: number; maxHeight: number; up: boolean };

/** Lista de opções personalizada no estilo do site, com o padrão ARIA de listbox. */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  id,
  name,
  variant = "field",
  className = "",
  ...aria
}: SelectProps) {
  const autoId = useId();
  const triggerId = id ?? `select-${autoId}`;
  const listId = `${triggerId}-lista`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", timer: 0 });

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [place, setPlace] = useState<Placement | null>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;
  const isPlaceholder = !selected || selected.value === "";

  const enabledFrom = useCallback(
    (start: number, step: 1 | -1) => {
      for (let i = start; i >= 0 && i < options.length; i += step) if (!options[i].disabled) return i;
      return -1;
    },
    [options],
  );

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - GAP - 12;
    const above = r.top - GAP - 12;
    const up = below < Math.min(MAX_HEIGHT, 200) && above > below;
    const width = Math.max(r.width, 180);
    const left = Math.min(r.left, window.innerWidth - width - 12);
    setPlace({
      top: up ? r.top - GAP : r.bottom + GAP,
      left: Math.max(12, left),
      width,
      maxHeight: Math.min(MAX_HEIGHT, up ? above : below),
      up,
    });
  }, []);

  const openList = (index?: number) => {
    measure();
    setActive(index ?? (selectedIndex >= 0 && !options[selectedIndex].disabled ? selectedIndex : enabledFrom(0, 1)));
    setOpen(true);
  };

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  };

  const choose = (index: number) => {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    if (opt.value !== value) onChange(opt.value);
    close();
  };

  // Acompanha rolagem e redimensionamento enquanto aberto; fecha ao clicar fora.
  useLayoutEffect(() => {
    if (!open) return;
    measure();
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, measure]);

  // Mantém a opção ativa visível.
  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const runTypeahead = (key: string) => {
    const t = typeahead.current;
    window.clearTimeout(t.timer);
    t.text += key.toLowerCase();
    t.timer = window.setTimeout(() => (t.text = ""), 600);
    const start = open ? active + 1 : selectedIndex + 1;
    const order = [...options.keys()].map((_, i) => (start + i) % options.length);
    const match = order.find((i) => {
      const o = options[i];
      const text = (o.text ?? (typeof o.label === "string" ? o.label : String(o.value))).toLowerCase();
      return !o.disabled && text.startsWith(t.text);
    });
    if (match === undefined) return;
    if (open) setActive(match);
    else onChange(options[match].value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        e.preventDefault();
        openList(key === "ArrowUp" ? enabledFrom(options.length - 1, -1) : undefined);
      } else if (key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        runTypeahead(key);
      }
      return;
    }
    switch (key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = enabledFrom(active + 1, 1);
        if (next >= 0) setActive(next);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = enabledFrom(active - 1, -1);
        if (prev >= 0) setActive(prev);
        break;
      }
      case "Home":
        e.preventDefault();
        setActive(enabledFrom(0, 1));
        break;
      case "End":
        e.preventDefault();
        setActive(enabledFrom(options.length - 1, -1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        // Impede que o Escape também feche um painel (ex.: gaveta de filtros).
        e.preventDefault();
        e.stopPropagation();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) runTypeahead(key);
    }
  };

  const triggerClass =
    variant === "field"
      ? `field flex items-center justify-between gap-3 text-left ${open ? "border-accent" : ""}`
      : "flex w-full items-center justify-between gap-3 py-1 text-left text-base text-ice outline-none";

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        {...aria}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={`group cursor-pointer ${triggerClass} ${className}`}
      >
        <span className={`truncate ${isPlaceholder ? (variant === "field" ? "text-fog" : "") : ""}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={`size-4 shrink-0 text-fog transition-transform duration-300 ease-out-expo group-hover:text-ice ${
            open ? "rotate-180 text-accent group-hover:text-accent" : ""
          }`}
        />
      </button>
      {name && <input type="hidden" name={name} value={value} />}

      {/* `place` só existe no cliente após a primeira abertura: evita divergência na hidratação. */}
      {place &&
        createPortal(
          <AnimatePresence>
            {open && place && (
              <motion.ul
                ref={listRef}
                id={listId}
                role="listbox"
                aria-labelledby={aria["aria-labelledby"] ?? triggerId}
                tabIndex={-1}
                initial={{ opacity: 0, y: place.up ? 6 : -6, scaleY: 0.96 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: place.up ? 4 : -4, transition: { duration: 0.12 } }}
                transition={{ duration: 0.22, ease }}
                style={{
                  position: "fixed",
                  left: place.left,
                  width: place.width,
                  maxHeight: place.maxHeight,
                  ...(place.up ? { bottom: window.innerHeight - place.top } : { top: place.top }),
                  transformOrigin: place.up ? "bottom" : "top",
                }}
                // Impede que o botão perca o foco ao clicar numa opção.
                onMouseDown={(e) => e.preventDefault()}
                className="z-[90] overflow-y-auto overscroll-contain border border-steel border-t-2 border-t-accent bg-graphite py-1.5 shadow-[0_24px_48px_-12px_rgb(0_0_0/0.55)] [scrollbar-color:var(--color-brand)_transparent] [scrollbar-width:thin]"
              >
                {options.map((o, i) => {
                  const isSelected = i === selectedIndex;
                  const isActive = i === active;
                  return (
                    <li
                      key={o.value}
                      id={`${listId}-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={o.disabled || undefined}
                      onPointerEnter={() => !o.disabled && setActive(i)}
                      onClick={() => choose(i)}
                      className={`relative flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 text-[0.9375rem] transition-colors duration-150 ${
                        o.disabled
                          ? "cursor-not-allowed text-smoke"
                          : isActive
                            ? "bg-steel text-ice"
                            : isSelected
                              ? "text-ice"
                              : "text-mist"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-y-2 left-0 w-0.5 bg-accent transition-transform duration-200 ease-out-expo ${
                          isActive && !o.disabled ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                      <span className={`truncate ${o.value === "" ? "text-fog" : ""}`}>{o.label}</span>
                      {isSelected && <Check aria-hidden className="size-4 shrink-0 text-accent" />}
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
