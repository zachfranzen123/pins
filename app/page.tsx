import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/lib/products";
import { PRODUCT_COPY } from "@/lib/copy";
import { formatMoney } from "@/lib/config";

export const dynamic = "force-dynamic";

const FEATURES = [
  { emoji: "🎯", title: "Small batch", body: "Only 50 of each design were made.", color: "bg-[var(--yellow)]" },
  { emoji: "✨", title: "Hard enamel", body: "Polished metal, saturated color, no fading.", color: "bg-[var(--pink)] text-white" },
  { emoji: "📏", title: "True scale", body: 'Each pin measures a real 1.5" tall.', color: "bg-[var(--teal)]" },
];

export default async function HomePage() {
  const products = await listProducts();
  const larry = PRODUCT_COPY["layover-larry"];
  const roxie = PRODUCT_COPY["roxie-carry-on"];

  return (
    <main className="overflow-hidden bg-[var(--cream)] text-[var(--ink)]">
      {/* HERO */}
      <section className="relative border-b-4 border-[var(--ink)] bg-[var(--cream)]">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[var(--purple)] lg:block" />
        <div className="absolute right-[6%] top-10 hidden h-40 w-40 rounded-full bg-[var(--yellow)] blur-2xl opacity-70 lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-24">
          <div className="relative z-10 max-w-xl">
            <span className="pop-shadow inline-block rotate-[-3deg] rounded-full border-2 border-[var(--ink)] bg-[var(--yellow)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
              Pins for the permanently packed
            </span>
            <h1 className="font-display mt-7 text-[clamp(3.2rem,8vw,6.6rem)] font-semibold leading-[0.9] tracking-tight">
              Carry the
              <span className="block -rotate-2 text-[var(--pink)]">inside joke.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[var(--ink)]/70">
              Two small-batch enamel pins inspired by the objects frequent flyers and crew
              members recognize instantly.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href="#shop"
                className="pop-shadow inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-8 text-base font-bold text-[var(--cream)]"
              >
                Shop the first drop
              </a>
              <span className="text-sm font-bold uppercase tracking-wide text-[var(--ink)]/60">
                $15 each · ships in days
              </span>
            </div>
          </div>

          <div className="relative mx-auto h-[460px] w-full max-w-[600px] sm:h-[560px]">
            <div className="pop-shadow absolute left-[4%] top-[4%] h-[72%] w-[56%] -rotate-6 overflow-hidden rounded-[28px] border-4 border-[var(--ink)] bg-white transition-transform duration-300 hover:-rotate-2">
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
            <div className="pop-shadow absolute bottom-[2%] right-[2%] h-[64%] w-[54%] rotate-6 overflow-hidden rounded-[28px] border-4 border-[var(--ink)] bg-white transition-transform duration-300 hover:rotate-2">
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
            <div className="pop-shadow absolute right-[10%] top-0 -rotate-6 rounded-full border-2 border-[var(--ink)] bg-[var(--teal)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em]">
              Edition of 50
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="border-b-4 border-[var(--ink)] bg-[var(--ink)] py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-6 px-5 sm:px-8 lg:px-10">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`pop-shadow flex w-full items-start gap-4 rounded-3xl border-2 border-[var(--ink)] p-5 sm:w-[300px] ${f.color} ${
                i === 1 ? "sm:rotate-2" : i === 2 ? "sm:-rotate-2" : ""
              }`}
            >
              <span className="text-3xl">{f.emoji}</span>
              <div>
                <h2 className="font-display font-semibold text-lg leading-tight">{f.title}</h2>
                <p className="mt-1 text-sm leading-5 text-[var(--ink)]/70">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="shop" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="pop-shadow inline-block rotate-[-2deg] rounded-full border-2 border-[var(--ink)] bg-[var(--teal)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
              The first drop
            </span>
            <h2 className="font-display mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Pick your travel companion.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-[var(--ink)]/60">
            Designed as recognizable little objects — not generic travel souvenirs.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {products.map((product, index) => {
            const copy = PRODUCT_COPY[product.slug];
            if (!copy) return null;
            const soldOut = product.inventory <= 0;
            const lowStock = !soldOut && product.inventory <= 10;
            const bg = index === 0 ? "bg-[var(--yellow)]" : "bg-[var(--pink)]";

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className={`pop-shadow group relative overflow-hidden rounded-[32px] border-4 border-[var(--ink)] bg-white ${
                  index === 0 ? "lg:-rotate-1" : "lg:rotate-1"
                } hover:!rotate-0`}
              >
                <div className={`relative aspect-[4/4.2] overflow-hidden ${bg}`}>
                  <div className="absolute inset-6 overflow-hidden rounded-[24px] border-2 border-[var(--ink)] bg-white sm:inset-9">
                    <Image
                      src={copy.images.hero}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute left-5 top-5 -rotate-3 rounded-full border-2 border-[var(--ink)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] sm:left-7 sm:top-7">
                    {index === 0 ? "Crew favorite" : "Road warrior"}
                  </span>
                  {(soldOut || lowStock) && (
                    <span className="absolute right-5 top-5 rotate-3 rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-xs font-bold text-white sm:right-7 sm:top-7">
                      {soldOut ? "Sold out" : `Only ${product.inventory} left`}
                    </span>
                  )}
                </div>
                <div className="p-7 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h3>
                      <p className="mt-2 max-w-md text-base leading-6 text-[var(--ink)]/60">{copy.tagline}</p>
                    </div>
                    <span className="shrink-0 rounded-full border-2 border-[var(--ink)] bg-[var(--cream)] px-3 py-1 text-lg font-bold">
                      {formatMoney(product.price_cents)}
                    </span>
                  </div>
                  <div className="mt-7 flex items-center justify-between border-t-2 border-dashed border-[var(--ink)]/20 pt-5 text-sm font-bold">
                    <span>{soldOut ? "View the pin" : "See details & order"}</span>
                    <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SPLIT SECTION */}
      <section className="border-y-4 border-[var(--ink)] bg-[var(--teal)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <span className="pop-shadow inline-block rotate-2 rounded-full border-2 border-[var(--ink)] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
              Made for people who get it
            </span>
            <h2 className="font-display mt-6 max-w-xl text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
              Tiny pins. Very specific stories.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {larry && (
              <Link
                href="/products/layover-larry"
                className="pop-shadow relative aspect-square -rotate-3 overflow-hidden rounded-[24px] border-4 border-[var(--ink)] bg-white transition hover:rotate-0"
              >
                <Image src={larry.images.hero} alt="Shop Layover Larry" fill unoptimized className="object-cover" />
              </Link>
            )}
            {roxie && (
              <Link
                href="/products/roxie-carry-on"
                className="pop-shadow relative mt-10 aspect-square rotate-3 overflow-hidden rounded-[24px] border-4 border-[var(--ink)] bg-white transition hover:rotate-0"
              >
                <Image src={roxie.images.hero} alt="Shop Roxie Carry-On" fill unoptimized className="object-cover" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[var(--yellow)] px-5 py-20 text-center sm:px-8 lg:py-28">
        <span className="pop-shadow inline-block -rotate-2 rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white">
          Limited first edition
        </span>
        <h2 className="font-display mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Pick one before the carousel moves on.
        </h2>
        <a
          href="#shop"
          className="pop-shadow mt-9 inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-8 text-base font-bold text-white"
        >
          Shop both pins
        </a>
      </section>
    </main>
  );
}
