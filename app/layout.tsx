import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: `${STORE_NAME} — Enamel Pins for Frequent Flyers`,
  description:
    "Small-batch hard enamel pins inspired by life on the road: Layover Larry and Roxie the Carry-On. $15 each, limited stock.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf8f4] text-[#1f2430]">
        <header className="border-b border-black/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              ✈ {STORE_NAME}
            </Link>
            <nav className="text-sm flex items-center gap-6">
              <Link href="/#pins" className="hover:underline">
                Shop
              </Link>
              <Link href="/checkout" className="hover:underline">
                Checkout
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 mt-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 text-sm text-black/60 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <p>© {new Date().getFullYear()} {STORE_NAME}. Small batch, made to fly.</p>
            <p>Questions about an order? Reply to your confirmation email.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
