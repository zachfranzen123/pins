export const STORE_NAME = "Layover Pins";

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
