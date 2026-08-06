import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/lib/products";
import { PRODUCT_COPY } from "@/lib/copy";
import { formatMoney } from "@/lib/config";

export const dynamic = "force-dynamic";

const FEATURES = [
  ["01", "Small batch", "Only 50 of each design were produced."],
  ["02", "Hard enamel", "Polished silver-tone metal and saturated enamel."],
  ["03", "True scale", 'Each pin measures 1.5" tall.'],
];

export default async function HomePage() {
  const products = await listProducts();
  const larry = PRODUCT_COPY["layover-larry"];
  const roxie = PRODUCT_COPY["roxie-carry-on"];

  return (
    <main className="overflow-hidden bg-[#f4f0e8] text-[#151719]">
      <section className="relative min-h-[760px] border-b border-black/10 bg-[#f4f0e8]">
        <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-[#50c6c0] lg:block" />
        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
          <div className="relative z-10 max-w-xl">
            <p className="mb-8 text-sm font-semibold uppercase tracking-[0.22em] text-black/55">
              Pins for the permanently packed
            </p>
            <h1 className="text-[clamp(4rem,8vw,7.8rem)] font-semibold leading-[0.82] tracking-[-0.07em]">
              Carry the
              <span className="block italic text-[#258f8a]">inside joke.</span>
            </h1>
            <p className="mt-9 max-w-md text-lg leading-8 text-black/65">
              Two small-batch enamel pins inspired by the objects frequent flyers and crew
              members recognize instantly.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="#shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#151719] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#258f8a]"
              >
                Shop the first drop
              </a>
              <span className="text-sm font-medium text-black/50">$15 each · ships in days</span>
            </div>
          </div>

          <div className="relative mx-auto h-[520px] w-full max-w-[650px] sm:h-[610px]">
            <div className="absolute left-[2%] top-[4%] h-[76%] w-[57%] -rotate-6 overflow-hidden rounded-[34px] border border-black/10 bg-white shadow-[0_35px_80px_rgba(0,0,0,0.2)] transition-transform duration-500 hover:-rotate-2 hover:scale-[1.02]">
              {larry && (
                <Image
                  src={larry.images.hero}
                  alt="Turquoise Layover Larry enamel pin"
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
              )}
            </div>
            <div className="absolute bottom-[1%] right-[1%] h-[68%] w-[55%] rotate-6 overflow-hidden rounded-[34px] border border-black/10 bg-white shadow-[0_35px_80px_rgba(0,0,0,0.24)] transition-transform duration-500 hover:rotate-2 hover:scale-[1.02]">
              {roxie && (
                <Image
                  src={roxie.images.hero}
                  alt="Black Roxie Carry-On enamel pin"
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
              )}
            </div>
            <div className="absolute right-[8%] top-[2%] rounded-full bg-[#151719] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
              Edition of 50
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#151719] text-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/15 px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
          {FEATURES.map(([number, title, body]) => (
            <div key={number} className="py-9 md:px-8 md:first:pl-0 md:last:pr-0">
              <div className="flex items-start gap-5">
                <span className="text-xs font-semibold tracking-widest text-[#50c6c0]">{number}</span>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#258f8a]">The first drop</p>
            <h2 className="mt-4 text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">Pick your travel companion.</h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-black/55">
            Designed as recognizable little objects—not generic travel souvenirs.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-2">
          {products.map((product, index) => {
            const copy = PRODUCT_COPY[product.slug];
            if (!copy) return null;
            const soldOut = product.inventory <= 0;
            const lowStock = !soldOut && product.inventory <= 10;

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group relative overflow-hidden rounded-[38px] border border-black/10 bg-white"
              >
                <div className={`relative aspect-[4/4.35] overflow-hidden ${index === 0 ? "bg-[#a8e4df]" : "bg-[#ded8cf]"}`}>
                  <div className="absolute inset-6 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.15)] sm:inset-9">
                    <Image
                      src={copy.images.hero}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                  </div>
                  <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm sm:left-7 sm:top-7">
                    {index === 0 ? "Crew favorite" : "Road warrior"}
                  </span>
                  {(soldOut || lowStock) && (
                    <span className="absolute right-5 top-5 rounded-full bg-[#151719] px-4 py-2 text-xs font-semibold text-white sm:right-7 sm:top-7">
                      {soldOut ? "Sold out" : `Only ${product.inventory} left`}
                    </span>
                  )}
                </div>
                <div className="p-7 sm:p-9">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-3xl font-semibold tracking-[-0.04em]">{product.name}</h3>
                      <p className="mt-2 max-w-md text-base leading-7 text-black/55">{copy.tagline}</p>
                    </div>
                    <span className="shrink-0 text-xl font-semibold">{formatMoney(product.price_cents)}</span>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6 text-sm font-semibold">
                    <span>{soldOut ? "View the pin" : "See details & order"}</span>
                    <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-[#50c6c0]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Made for people who get it</p>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              Tiny pins. Very specific stories.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {larry && (
              <Link href="/products/layover-larry" className="relative aspect-square overflow-hidden rounded-[28px] bg-white shadow-xl transition hover:-translate-y-1">
                <Image src={larry.images.hero} alt="Shop Layover Larry" fill unoptimized className="object-cover" />
              </Link>
            )}
            {roxie && (
              <Link href="/products/roxie-carry-on" className="relative mt-10 aspect-square overflow-hidden rounded-[28px] bg-white shadow-xl transition hover:-translate-y-1">
                <Image src={roxie.images.hero} alt="Shop Roxie Carry-On" fill unoptimized className="object-cover" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#151719] px-5 py-20 text-center text-white sm:px-8 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#50c6c0]">Limited first edition</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
          Pick one before the carousel moves on.
        </h2>
        <a href="#shop" className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#151719] transition hover:-translate-y-0.5 hover:bg-[#50c6c0]">
          Shop both pins
        </a>
      </section>
    </main>
  );
}
