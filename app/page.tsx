import Link from "next/link";
import Image from "next/image";
import { listProducts } from "@/lib/products";
import { PRODUCT_COPY } from "@/lib/copy";
import { formatMoney } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listProducts();

  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Enamel pins for people who live on the road.
        </h1>
        <p className="mt-4 text-black/70 max-w-xl mx-auto">
          Two small-batch hard enamel pins, $15 each. A few dozen of each — once they&apos;re
          gone, they&apos;re gone.
        </p>
      </section>

      <section id="pins" className="mx-auto max-w-5xl px-4 sm:px-6 pb-24 grid sm:grid-cols-2 gap-8">
        {products.map((product) => {
          const copy = PRODUCT_COPY[product.slug];
          if (!copy) return null;
          const soldOut = product.inventory <= 0;
          return (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group rounded-2xl border border-black/10 bg-white overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square bg-[#f4f1ec]">
                <Image
                  src={copy.images.hero}
                  alt={product.name}
                  fill
                  className="object-contain p-6 group-hover:scale-[1.02] transition-transform"
                  unoptimized
                />
                {soldOut && (
                  <span className="absolute top-3 right-3 rounded-full bg-black text-white text-xs px-3 py-1">
                    Sold out
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-black/60 mt-1">{copy.tagline}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium">{formatMoney(product.price_cents)}</span>
                  <span className="text-sm text-black/50">
                    {soldOut ? "Sold out" : `${product.inventory} left`}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
