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

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-square rounded-2xl bg-[#f4f1ec] overflow-hidden">
            <Image src={copy.images.hero} alt={product.name} fill className="object-contain p-8" unoptimized priority />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {copy.images.scenes.map((scene) => (
              <div key={scene.src} className="relative aspect-square rounded-xl bg-[#f4f1ec] overflow-hidden">
                <Image src={scene.src} alt={scene.alt} fill className="object-contain p-2" unoptimized />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-2 text-black/60">{copy.tagline}</p>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatMoney(product.price_cents)}</span>
            <span className={`text-sm ${soldOut ? "text-red-600" : "text-black/50"}`}>
              {soldOut ? "Sold out" : `${product.inventory} in stock`}
            </span>
          </div>

          <Link
            href={`/checkout?slug=${product.slug}&qty=1`}
            aria-disabled={soldOut}
            className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 font-medium transition-colors ${
              soldOut
                ? "bg-black/10 text-black/40 pointer-events-none"
                : "bg-[#1f2430] text-white hover:bg-[#343b4a]"
            }`}
          >
            {soldOut ? "Sold out" : "Buy this pin"}
          </Link>

          <div className="mt-10 space-y-4 text-black/80 leading-relaxed">
            {copy.story.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <dl className="mt-10 border-t border-black/10 pt-6 grid grid-cols-2 gap-y-3 text-sm">
            {copy.specs.map((spec) => (
              <div key={spec.label} className="contents">
                <dt className="text-black/50">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
