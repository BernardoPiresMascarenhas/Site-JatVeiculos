import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  tone?: "dark" | "light";
  id?: string;
}

export function SectionHeading({ index, eyebrow, title, children, tone = "dark", id }: SectionHeadingProps) {
  const muted = tone === "dark" ? "text-fog" : "text-smoke";
  return (
    <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <p className={`eyebrow mb-5 flex items-center gap-3 ${muted}`}>
          {index && <span className={tone === "dark" ? "text-accent" : "text-brand-ink"}>{index}</span>}
          <span aria-hidden className="h-px w-8 bg-current opacity-40" />
          {eyebrow}
        </p>
        <h2 id={id} className="display text-[clamp(2.4rem,6.2vw,5.5rem)]">
          {title}
        </h2>
      </div>
      {children && <div className={`text-[0.95rem] leading-relaxed md:col-span-4 ${muted}`}>{children}</div>}
    </Reveal>
  );
}
