import Link from "next/link";
import Image from "next/image";
import { listProducts } from "@/lib/products";
import { PRODUCT_COPY } from "@/lib/copy";
import { formatMoney } from "@/lib/config";

export const dynamic = "force-dynamic";

const FEATURES = [
  "Hard enamel, die-struck",
  "True 1.5\" scale",
  "Only 50 of each made",
  "Ships in days",
];

export default async function HomePage() {
  const products = await listProducts();
  const larry = PRODUCT_COPY["layover-larry"];
  const roxie = PRODUCT_COPY["roxie-carry-on"];

  return (
    <div>
      <section className="relative overflow-hidden bg-[#1f2430] text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 relative">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#6ad4cb]">
            Small batch · $15 each
          </span>
          <h1 className="mt-6 text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-xl">
            Pins for people who <span className="text-[#6ad4cb]">live on the road.</span>
          </h1>
          <p className="mt-5 text-white/70 max-w-md text-lg">
            Two hard enamel pins built from the gear every frequent flyer knows by heart.
            A few dozen of each — once they&apos;re gone, they&apos;re gone.
          </p>
          <a
            href="#pins"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#6ad4cb] text-[#0f1115] font-semibold px-6 py-3 hover:bg-[#84e0d8] transition-colors"
          >
            Shop the drop
            <span aria-hidden>→</span>
          </a>

          {larry && (
            <div className="hidden sm:block absolute right-[-10px] top-4 w-48 rotate-6 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image src={larry.images.hero} alt="" width={400} height={400} unoptimized className="w-full h-auto block" />
            </div>
          )}
          {roxie && (
            <div className="hidden sm:block absolute right-40 top-64 w-40 -rotate-12 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image src={roxie.images.hero} alt="" width={400} height={400} unoptimized className="w-full h-auto block" />
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-black/60">
          {FEATURES.map((f, i) => (
            <span key={f} className="flex items-center gap-3">
              {i > 0 && <span className="text-black/20">·</span>}
              {f}
            </span>
          ))}
        </div>
      </section>

      <section id="pins" className="mx-auto max-w-5xl px-4 sm:px-6 py-20">
        <div className="grid sm:grid-cols-2 gap-8">
          {products.map((product, i) => {
            const copy = PRODUCT_COPY[product.slug];
            if (!copy) return null;
            const soldOut = product.inventory <= 0;
            const lowStock = !soldOut && product.inventory <= 10;
            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className={`group rounded-[28px] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ${
                  i % 2 === 0 ? "sm:rotate-[-0.5deg]" : "sm:rotate-[0.5deg]"
                } hover:rotate-0`}
              >
                <div className="relative aspect-square bg-[#f4f1ec]">
                  <Image
                    src={copy.images.hero}
                    alt={product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-[1.04] transition-transform duration-200"
                    unoptimized
                  />
                  {soldOut && (
                    <span className="absolute top-4 right-4 rounded-full bg-black text-white text-xs font-medium px-3 py-1">
                      Sold out
                    </span>
                  )}
                  {lowStock && (
                    <span className="absolute top-4 right-4 rounded-full bg-amber-400 text-[#1f2430] text-xs font-semibold px-3 py-1">
                      Only {product.inventory} left
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold tracking-tight">{product.name}</h2>
                  <p className="text-sm text-black/60 mt-1">{copy.tagline}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold">{formatMoney(product.price_cents)}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1f2430] group-hover:gap-2.5 transition-all">
                      {soldOut ? "View" : "Shop now"}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
