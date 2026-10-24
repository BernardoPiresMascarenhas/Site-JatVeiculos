import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32 pb-20">
      <p aria-hidden className="display text-outline pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[clamp(10rem,36vw,30rem)] leading-none">
        404
      </p>
      <div className="shell relative text-center">
        <p className="eyebrow text-accent">Página não encontrada</p>
        <h1 className="display mt-5 text-[clamp(2.4rem,6vw,5rem)]">Fora da rota</h1>
        <p className="mx-auto mt-5 max-w-md text-mist">
          O endereço pode ter mudado, ou o veículo não está mais no showroom.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/estoque" className="btn btn-primary">
            Explorar estoque
          </Link>
          <Link href="/" className="btn btn-ghost">
            Página inicial
          </Link>
        </div>
      </div>
    </section>
  );
}
