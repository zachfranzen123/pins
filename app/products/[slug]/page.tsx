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

  return (
    <main className="bg-[#f7f4ee] text-[#20242d]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-12 md:grid-cols-2 md:gap-14">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[28px] bg-[#efede8]">
              <Image src={copy.images.hero} alt={product.name} fill className="object-contain p-8" unoptimized priority />
            </div>
            <div className={`mt-4 grid gap-3 ${copy.images.scenes.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}>
              {copy.images.scenes.map((scene) => (
                <div key={scene.src} className="relative aspect-square overflow-hidden rounded-2xl bg-[#efede8]">
                  <Image src={scene.src} alt={scene.alt} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>

          <div className="md:pt-4">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-lg text-black/55">{copy.tagline}</p>

            <div className="mt-8 flex items-center gap-4">
              <span className="text-3xl font-semibold">{formatMoney(product.price_cents)}</span>
              <span className={`text-sm ${soldOut ? "text-red-600" : "text-black/45"}`}>
                {soldOut ? "Sold out" : `${product.inventory} in stock`}
              </span>
            </div>

            <Link
              href={`/checkout?slug=${product.slug}&qty=1`}
              aria-disabled={soldOut}
              className={`mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-7 font-medium transition-colors ${
                soldOut
                  ? "pointer-events-none bg-black/10 text-black/40"
                  : "bg-[#20242d] text-white hover:bg-[#343b4a]"
              }`}
            >
              {soldOut ? "Sold out" : "Buy this pin"}
            </Link>

            <div className="mt-12 space-y-5 text-[1.05rem] leading-8 text-black/78">
              {copy.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-y-3 border-t border-black/10 pt-7 text-sm">
              {copy.specs.map((spec) => (
                <div key={spec.label} className="contents">
                  <dt className="text-black/45">{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="mt-20 overflow-hidden rounded-[32px] border border-black/10 bg-white sm:mt-28">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#258f8a]">Design process</p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                {copy.production.title}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-black/62">{copy.production.intro}</p>

              <dl className="mt-9 grid gap-5 sm:grid-cols-2">
                {copy.production.details.map((detail) => (
                  <div key={detail.label} className="border-t border-black/10 pt-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-black/38">{detail.label}</dt>
                    <dd className="mt-2 text-base font-medium leading-6">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative min-h-[430px] border-t border-black/10 bg-[#ece9e2] p-8 lg:border-l lg:border-t-0 sm:p-10">
              <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "linear-gradient(rgba(32,36,45,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(32,36,45,.1) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
              <div className="relative flex h-full min-h-[350px] items-center justify-center">
                <div className="relative flex items-end gap-10 sm:gap-16">
                  <div className="text-center">
                    <div className="relative mx-auto h-64 w-40">
                      {isRoxie ? (
                        <div className="absolute inset-x-2 bottom-0 h-52 rounded-[24px] border-[7px] border-[#aeb1b1] bg-[#111] shadow-xl">
                          <div className="absolute left-5 right-5 top-12 h-px bg-[#aeb1b1]" />
                          <div className="absolute bottom-5 left-5 right-5 h-24 rounded-[14px] border-2 border-[#aeb1b1]" />
                          <div className="absolute -top-14 left-1/2 h-16 w-16 -translate-x-1/2 rounded-t-[18px] border-[7px] border-b-0 border-[#aeb1b1] bg-transparent" />
                          <div className="absolute right-3 top-8 h-24 w-3 rounded-full border border-[#aeb1b1]" />
                        </div>
                      ) : (
                        <div className="absolute inset-x-6 bottom-0 h-64 rounded-full rounded-b-[20px] border-[7px] border-[#b8bbbb] bg-[#58c8c4] shadow-xl before:absolute before:left-1/2 before:top-20 before:h-36 before:w-16 before:-translate-x-1/2 before:rounded-b-xl before:border-x-[7px] before:border-b-[7px] before:border-[#b8bbbb] before:bg-[#58c8c4]" />
                      )}
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Front artwork</p>
                  </div>

                  <div className="text-center">
                    <div className={`relative mx-auto bg-[#c7c9c7] shadow-lg ${isRoxie ? "h-52 w-36 rounded-[22px]" : "h-64 w-28 rounded-full rounded-b-[18px]"}`}>
                      <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#20242d]" />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Clutch back</p>
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
