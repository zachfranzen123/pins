import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/lib/products";
import { PRODUCT_COPY } from "@/lib/copy";
import { formatMoney } from "@/lib/config";

export const dynamic = "force-dynamic";

const FEATURES = [
  { emoji: "🔥", title: "Sold out once already", body: "The first batch went fast — this is round two.", color: "bg-[var(--yellow)]" },
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
        <div className="absolute right-[6%] top-6 hidden h-32 w-32 rounded-full bg-[var(--yellow)] blur-2xl opacity-70 lg:block" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-14">
          <div className="relative z-10 max-w-xl">
            <span className="pop-shadow inline-block rotate-[-3deg] rounded-full border-2 border-[var(--ink)] bg-[var(--yellow)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
              Back by popular demand
            </span>
            <h1 className="font-display mt-4 text-[clamp(2.4rem,6.5vw,4.6rem)] font-semibold leading-[0.92] tracking-tight">
              Sold out once.
              <span className="block -rotate-2 text-[var(--pink)]">Not this time.</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-[var(--ink)]/70">
              The first batch of these enamel pins disappeared fast. We dug up a small second
              batch for everyone who missed out — or wants another one.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="#shop"
                className="pop-shadow inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-6 text-sm font-bold text-[var(--cream)]"
              >
                Shop the restock
              </a>
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--ink)]/60">
                $10 each · won&apos;t last long
              </span>
            </div>
          </div>

          <div className="relative mx-auto h-[300px] w-full max-w-[420px] sm:h-[360px]">
            <div className="pop-shadow absolute left-[4%] top-[4%] h-[72%] w-[56%] -rotate-6 overflow-hidden rounded-[22px] border-4 border-[var(--ink)] bg-white transition-transform duration-300 hover:-rotate-2">
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
            <div className="pop-shadow absolute bottom-[2%] right-[2%] h-[64%] w-[54%] rotate-6 overflow-hidden rounded-[22px] border-4 border-[var(--ink)] bg-white transition-transform duration-300 hover:rotate-2">
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
            <div className="pop-shadow absolute right-[10%] top-0 -rotate-6 rounded-full border-2 border-[var(--ink)] bg-[var(--teal)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
              Restocked · 50 each
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="border-b-4 border-[var(--ink)] bg-[var(--ink)] py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4 px-5 sm:px-8 lg:px-10">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`pop-shadow flex w-full items-center gap-3 rounded-2xl border-2 border-[var(--ink)] p-3.5 sm:w-[260px] ${f.color} ${
                i === 1 ? "sm:rotate-2" : i === 2 ? "sm:-rotate-2" : ""
              }`}
            >
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <h2 className="font-display font-semibold text-base leading-tight">{f.title}</h2>
                <p className="mt-0.5 text-xs leading-4 text-[var(--ink)]/70">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="shop" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="pop-shadow inline-block rotate-[-2deg] rounded-full border-2 border-[var(--ink)] bg-[var(--teal)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
              The restock
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Grab yours before they&apos;re gone. Again.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[var(--ink)]/60">
            Same two pins from the first run — a second, smaller batch for latecomers and repeat offenders.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
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
                className={`pop-shadow group relative overflow-hidden rounded-[24px] border-4 border-[var(--ink)] bg-white ${
                  index === 0 ? "lg:-rotate-1" : "lg:rotate-1"
                } hover:!rotate-0`}
              >
                <div className={`relative aspect-[16/10] overflow-hidden ${bg}`}>
                  <div className="absolute inset-4 overflow-hidden rounded-2xl border-2 border-[var(--ink)] bg-white sm:inset-5">
                    <Image
                      src={copy.images.hero}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute left-3 top-3 -rotate-3 rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] sm:left-4 sm:top-4">
                    {index === 0 ? "Crew favorite" : "Road warrior"}
                  </span>
                  {(soldOut || lowStock) && (
                    <span className="absolute right-3 top-3 rotate-3 rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-3 py-1 text-[11px] font-bold text-white sm:right-4 sm:top-4">
                      {soldOut ? "Sold out" : `Only ${product.inventory} left`}
                    </span>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{product.name}</h3>
                      <p className="mt-1 max-w-md text-sm leading-5 text-[var(--ink)]/60">{copy.tagline}</p>
                    </div>
                    <span className="shrink-0 rounded-full border-2 border-[var(--ink)] bg-[var(--cream)] px-2.5 py-0.5 text-base font-bold">
                      {formatMoney(product.price_cents)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-[var(--ink)]/20 pt-3 text-sm font-bold">
                    <span>{soldOut ? "View the pin" : "See details & order"}</span>
                    <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden>
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
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-14">
          <div>
            <span className="pop-shadow inline-block rotate-2 rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
              Made for people who get it
            </span>
            <h2 className="font-display mt-4 max-w-xl text-3xl font-semibold leading-[0.95] tracking-tight sm:text-4xl">
              Tiny pins. Very specific stories.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {larry && (
              <Link
                href="/products/layover-larry"
                className="pop-shadow relative aspect-square -rotate-3 overflow-hidden rounded-2xl border-4 border-[var(--ink)] bg-white transition hover:rotate-0"
              >
                <Image src={larry.images.hero} alt="Shop Layover Larry" fill unoptimized className="object-cover" />
              </Link>
            )}
            {roxie && (
              <Link
                href="/products/roxie-carry-on"
                className="pop-shadow relative mt-7 aspect-square rotate-3 overflow-hidden rounded-2xl border-4 border-[var(--ink)] bg-white transition hover:rotate-0"
              >
                <Image src={roxie.images.hero} alt="Shop Roxie Carry-On" fill unoptimized className="object-cover" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[var(--yellow)] px-5 py-12 text-center sm:px-8 lg:py-16">
        <span className="pop-shadow inline-block -rotate-2 rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">
          Limited second run
        </span>
        <h2 className="font-display mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Once this batch is gone, that&apos;s it.
        </h2>
        <a
          href="#shop"
          className="pop-shadow mt-6 inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] px-6 text-sm font-bold text-white"
        >
          Shop both pins
        </a>
      </section>
    </main>
  );
}
