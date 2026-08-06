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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-12 md:grid-cols-2 md:gap-14">
          <div>
            <div
              className="pop-shadow relative aspect-square overflow-hidden rounded-[28px] border-4 border-[var(--ink)]"
              style={{ background: accent }}
            >
              <Image src={copy.images.hero} alt={product.name} fill className="object-contain p-8" unoptimized priority />
            </div>
            <div className={`mt-4 grid gap-3 ${copy.images.scenes.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}>
              {copy.images.scenes.map((scene) => (
                <div
                  key={scene.src}
                  className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[var(--ink)] bg-white"
                >
                  <Image src={scene.src} alt={scene.alt} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>

          <div className="md:pt-4">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-lg text-[var(--ink)]/60">{copy.tagline}</p>

            <div className="mt-8 flex items-center gap-4">
              <span className="rounded-full border-2 border-[var(--ink)] bg-[var(--yellow)] px-4 py-1.5 text-2xl font-bold">
                {formatMoney(product.price_cents)}
              </span>
              <span className={`text-sm font-bold ${soldOut ? "text-red-600" : "text-[var(--ink)]/50"}`}>
                {soldOut ? "Sold out" : `${product.inventory} in stock`}
              </span>
            </div>

            <Link
              href={`/checkout?slug=${product.slug}&qty=1`}
              aria-disabled={soldOut}
              className={`mt-7 inline-flex min-h-14 items-center justify-center rounded-full border-2 px-8 text-base font-bold transition-colors ${
                soldOut
                  ? "pointer-events-none border-black/10 bg-black/10 text-black/40"
                  : "pop-shadow border-[var(--ink)] bg-[var(--ink)] text-white"
              }`}
            >
              {soldOut ? "Sold out" : "Buy this pin"}
            </Link>

            <div className="mt-12 space-y-5 text-[1.05rem] leading-8 text-[var(--ink)]/78">
              {copy.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-y-3 border-t-2 border-dashed border-[var(--ink)]/20 pt-7 text-sm">
              {copy.specs.map((spec) => (
                <div key={spec.label} className="contents">
                  <dt className="text-[var(--ink)]/45 font-medium">{spec.label}</dt>
                  <dd className="font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="pop-shadow mt-20 overflow-hidden rounded-[32px] border-4 border-[var(--ink)] bg-white sm:mt-28">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <span
                className="inline-block -rotate-2 rounded-full border-2 border-[var(--ink)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white"
                style={{ background: accent }}
              >
                Design process
              </span>
              <h2 className="font-display mt-5 max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
                {copy.production.title}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--ink)]/62">{copy.production.intro}</p>

              <dl className="mt-9 grid gap-5 sm:grid-cols-2">
                {copy.production.details.map((detail) => (
                  <div key={detail.label} className="border-t-2 border-dashed border-[var(--ink)]/20 pt-4">
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink)]/38">{detail.label}</dt>
                    <dd className="mt-2 text-base font-semibold leading-6">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative min-h-[430px] border-t-4 border-[var(--ink)] bg-[var(--cream)] p-8 lg:border-l-4 lg:border-t-0 sm:p-10">
              <div
                className="absolute inset-0 opacity-45"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(23,21,28,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(23,21,28,.1) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              <div className="relative flex h-full min-h-[350px] items-center justify-center">
                <div className="relative flex items-end gap-10 sm:gap-16">
                  <div className="text-center">
                    <div className="pop-shadow relative mx-auto flex h-64 w-40 items-end justify-center rounded-[24px] border-4 border-[var(--ink)] bg-white p-4">
                      <Image
                        src={copy.images.frontArt}
                        alt={`${product.name} actual front artwork from the manufacturer spec sheet`}
                        width={300}
                        height={740}
                        unoptimized
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]/45">Front artwork</p>
                  </div>

                  <div className="text-center">
                    <div className="pop-shadow relative mx-auto flex h-64 w-40 items-end justify-center rounded-[24px] border-4 border-[var(--ink)] bg-white p-4">
                      <Image
                        src={copy.images.backArt}
                        alt={`${product.name} actual back artwork from the manufacturer spec sheet`}
                        width={300}
                        height={740}
                        unoptimized
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]/45">Clutch back</p>
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
