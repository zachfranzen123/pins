import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { PRODUCT_COPY } from "@/lib/copy";
import { formatMoney } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, copy] = await Promise.all([getProduct(slug), Promise.resolve(PRODUCT_COPY[slug])]);

  if (!product || !copy) notFound();

  const soldOut = product.inventory <= 0;
  const isRoxie = slug === "roxie-carry-on";
  const accent = isRoxie ? "var(--pink)" : "var(--teal)";

  return (
    <main className="bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <div
              className="pop-shadow relative aspect-square overflow-hidden rounded-2xl border-4 border-[var(--ink)]"
              style={{ background: accent }}
            >
              <Image src={copy.images.hero} alt={product.name} fill className="object-contain p-3" unoptimized priority />
            </div>
            <div className={`mt-3 grid gap-2 ${copy.images.scenes.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}>
              {copy.images.scenes.map((scene) => (
                <div
                  key={scene.src}
                  className="relative aspect-square overflow-hidden rounded-xl border-2 border-[var(--ink)] bg-white"
                >
                  <Image src={scene.src} alt={scene.alt} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-base text-[var(--ink)]/60">{copy.tagline}</p>

            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-full border-2 border-[var(--ink)] bg-[var(--yellow)] px-3 py-1 text-xl font-bold">
                {formatMoney(product.price_cents)}
              </span>
              <span className={`text-sm font-bold ${soldOut ? "text-red-600" : "text-[var(--ink)]/50"}`}>
                {soldOut ? "Sold out" : `${product.inventory} in stock`}
              </span>
            </div>

            <Link
              href={`/checkout?slug=${product.slug}&qty=1`}
              aria-disabled={soldOut}
              className={`mt-4 inline-flex min-h-11 items-center justify-center rounded-full border-2 px-6 text-sm font-bold transition-colors ${
                soldOut
                  ? "pointer-events-none border-black/10 bg-black/10 text-black/40"
                  : "pop-shadow border-[var(--ink)] bg-[var(--ink)] text-white"
              }`}
            >
              {soldOut ? "Sold out" : "Buy this pin"}
            </Link>

            <div className="mt-6 space-y-3 text-[0.95rem] leading-6 text-[var(--ink)]/78">
              {copy.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-y-2 border-t-2 border-dashed border-[var(--ink)]/20 pt-4 text-sm">
              {copy.specs.map((spec) => (
                <div key={spec.label} className="contents">
                  <dt className="text-[var(--ink)]/45 font-medium">{spec.label}</dt>
                  <dd className="font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="pop-shadow mt-10 overflow-hidden rounded-2xl border-4 border-[var(--ink)] bg-white sm:mt-12">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-5 sm:p-7 lg:p-8">
              <span
                className="inline-block -rotate-2 rounded-full border-2 border-[var(--ink)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white"
                style={{ background: accent }}
              >
                Design process
              </span>
              <h2 className="font-display mt-3 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                {copy.production.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--ink)]/62">{copy.production.intro}</p>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {copy.production.details.map((detail) => (
                  <div key={detail.label} className="border-t-2 border-dashed border-[var(--ink)]/20 pt-3">
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink)]/38">{detail.label}</dt>
                    <dd className="mt-1 text-sm font-semibold leading-5">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative min-h-[260px] border-t-4 border-[var(--ink)] bg-[var(--cream)] p-5 lg:border-l-4 lg:border-t-0 sm:p-6">
              <div
                className="absolute inset-0 opacity-45"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(23,21,28,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(23,21,28,.1) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative flex h-full min-h-[220px] items-center justify-center">
                <div className="relative flex items-end gap-6 sm:gap-8">
                  <div className="text-center">
                    <div className="pop-shadow relative mx-auto flex h-36 w-24 items-end justify-center rounded-2xl border-2 border-[var(--ink)] bg-white p-2">
                      <Image
                        src={copy.images.frontArt}
                        alt={`${product.name} actual front artwork from the manufacturer spec sheet`}
                        width={300}
                        height={740}
                        unoptimized
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]/45">Front artwork</p>
                  </div>

                  <div className="text-center">
                    <div className="pop-shadow relative mx-auto flex h-36 w-24 items-end justify-center rounded-2xl border-2 border-[var(--ink)] bg-white p-2">
                      <Image
                        src={copy.images.backArt}
                        alt={`${product.name} actual back artwork from the manufacturer spec sheet`}
                        width={300}
                        height={740}
                        unoptimized
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]/45">Clutch back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
