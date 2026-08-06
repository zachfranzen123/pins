// Declares the Cloudflare bindings/vars this app expects, so TypeScript is
// happy even before `npm run cf-typegen` generates the full binding types
// from wrangler.jsonc.
export {};

declare global {
  interface CloudflareEnv {
    DB: D1Database;

    RESEND_API_KEY: string;
    FROM_EMAIL: string;

    ADMIN_PASSWORD: string;
    ADMIN_SESSION_SECRET: string;

    VENMO_HANDLE: string;
    ZELLE_CONTACT: string;
    APPLE_CASH_CONTACT: string;
  }
}
