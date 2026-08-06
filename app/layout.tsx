import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { STORE_NAME } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${STORE_NAME} — Enamel Pins for Frequent Flyers`,
  description:
    "Small-batch hard enamel pins inspired by life on the road: Layover Larry and Roxie the Carry-On. $15 each, limited stock.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--cream)] text-[var(--ink)]">
        <header className="border-b-4 border-[var(--ink)] bg-[var(--cream)] relative z-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pink)] border-2 border-[var(--ink)] text-lg -rotate-6 group-hover:rotate-0 transition-transform">
                ✈
              </span>
              <span className="font-display font-semibold tracking-tight text-xl">
                {STORE_NAME}
              </span>
            </Link>
            <nav className="text-sm font-semibold flex items-center gap-3">
              <Link
                href="/#pins"
                className="rounded-full px-4 py-2 hover:bg-[var(--yellow)] hover:border-[var(--ink)] border-2 border-transparent transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/checkout"
                className="pop-shadow rounded-full bg-[var(--ink)] text-[var(--cream)] px-4 py-2 border-2 border-[var(--ink)]"
              >
                Checkout
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-4 border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm flex flex-col sm:flex-row gap-2 sm:justify-between">
            <p>© {new Date().getFullYear()} {STORE_NAME}. Small batch, made to fly.</p>
            <p className="text-[var(--cream)]/60">Questions about an order? Reply to your confirmation email.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
