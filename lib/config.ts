export const STORE_NAME = "Zach's Creations";

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Builds the "how to pay" text shown on the order-confirmation page and in
 * the order-received email, based on which payment method the buyer chose
 * and the payment handles configured as environment variables/secrets
 * (never hard-coded — see .dev.vars.example).
 */
export function paymentInstructions(
  env: Pick<CloudflareEnv, "VENMO_HANDLE" | "ZELLE_CONTACT" | "APPLE_CASH_CONTACT">,
  method: string,
  totalCents: number
): string {
  const amount = formatMoney(totalCents);
  switch (method) {
    case "venmo":
      return `Pay ${amount} via Venmo: ${env.VENMO_HANDLE}. Please include your order number in the payment note so we can match it up.`;
    case "zelle":
      return `Send ${amount} via Zelle to ${env.ZELLE_CONTACT}. Please include your order number in the memo so we can match it up.`;
    case "apple_cash":
      return `Send ${amount} via Apple Cash (Messages) to ${env.APPLE_CASH_CONTACT}. Please include your order number in the message so we can match it up.`;
    default:
      return `Please contact us to arrange payment of ${amount}.`;
  }
}

export const PAYMENT_METHODS = [
  { id: "venmo", label: "Venmo" },
  { id: "zelle", label: "Zelle" },
  { id: "apple_cash", label: "Apple Cash" },
] as const;

/**
 * Shipping is paused while the shop owner is away. Orders placed within this
 * window (inclusive, by calendar date) get a heads-up in their emails; orders
 * placed after `end` are unaffected — nothing to update when the trip is over.
 */
const VACATION_WINDOW = { start: "2026-08-10", end: "2026-08-20" } as const;
const VACATION_NOTICE =
  "Quick heads up: I'm away August 10–20, so shipping will be a little slower than usual for orders placed during that window. I'll get everything out as soon as I'm back — thanks for your patience!";

/** `dateStr` is a D1 timestamp like "2026-08-10 17:54:31" or an ISO date. */
export function vacationNoticeFor(dateStr: string): string | null {
  const date = dateStr.slice(0, 10);
  if (date >= VACATION_WINDOW.start && date <= VACATION_WINDOW.end) {
    return VACATION_NOTICE;
  }
  return null;
}
