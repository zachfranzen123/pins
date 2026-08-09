# Zach's Creations

A small storefront for two enamel pins — **Layover Larry** (the ice mallet) and
**Roxie the Carry-On** (the rolling suitcase) — built on Next.js and deployed
to Cloudflare Workers.

No Stripe: checkout collects the order and shipping info, then shows the
buyer your Venmo / Zelle / Apple Cash handle to pay directly. You mark orders
paid by hand in `/admin`, which is when the payment-confirmation email goes
out and status updates.

> **Note on naming:** "TravelPro" is a real trademarked luggage brand, so the
> suitcase pin is sold here as "Roxie the Carry-On" instead of using that
> name. It's just a string in `lib/copy.ts` and `schema.sql` if you want to
> rename it.

## Stack

- Next.js 16 (App Router) + Tailwind
- Cloudflare Workers via `@opennextjs/cloudflare`, static assets served from
  the Workers Assets binding
- Cloudflare D1 (SQLite) for products, orders, and coupons
- Resend for order emails
- No client-side cart library — checkout is a single page with a quantity
  stepper per pin

## Project layout

- `app/` — storefront pages, checkout, order confirmation, `/admin`
- `lib/` — D1 queries (`products.ts`, `orders.ts`, `coupons.ts`), email
  (`email.ts`), admin session signing (`admin-auth.ts`), and
  `config.ts`/`copy.ts` for store text and payment-instruction copy
- `schema.sql` — D1 schema + seed (both pins start at 50 in stock, $10)
- `public/images/` — product photography stand-ins: a hero shot plus three
  scale-accurate mockups (denim jacket, tote bag, cap) per pin, generated
  from the manufacturer's 1.5" spec-sheet artwork so proportions are correct.
  Swap in real photos of the physical pins whenever you have them — same
  filenames, `public/images/<slug>-hero.jpg` etc.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars   # then fill in real values (gitignored)
npm run db:migrate:local         # creates & seeds the local D1 database
npm run dev                      # next dev, fastest iteration
```

`npm run dev` doesn't have Cloudflare bindings wired up for every edge case.
To test against the real Workers runtime + local D1 before deploying:

```bash
npm run preview     # builds the Worker and runs it locally via Wrangler
```

## Environment variables / secrets

Never commit real values — `.dev.vars` is gitignored. `.dev.vars.example` is
the committed template.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Your existing Resend API key |
| `FROM_EMAIL` | Verified sender, e.g. `zach@hizach.com` |
| `ADMIN_NOTIFICATION_EMAIL` | Optional — where new-order alerts go. Falls back to `FROM_EMAIL` if unset |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_SESSION_SECRET` | Random string signing the admin session cookie — generate with `openssl rand -hex 32` |
| `VENMO_HANDLE` | Shown to buyers who choose Venmo |
| `ZELLE_CONTACT` | Shown to buyers who choose Zelle |
| `APPLE_CASH_CONTACT` | Shown to buyers who choose Apple Cash |

## Deploying to Cloudflare

1. **Create the D1 database** (one time):
   ```bash
   npx wrangler d1 create pins-store-db
   ```
   Copy the `database_id` it prints into `wrangler.jsonc` (replacing
   `REPLACE_WITH_YOUR_D1_DATABASE_ID`), then apply the schema to it:
   ```bash
   npm run db:migrate:remote
   ```

2. **Set production secrets** — either in the Cloudflare dashboard
   (Workers & Pages → your Worker → Settings → Variables and Secrets) or via:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put FROM_EMAIL
   npx wrangler secret put ADMIN_NOTIFICATION_EMAIL   # optional, defaults to FROM_EMAIL
   npx wrangler secret put ADMIN_PASSWORD
   npx wrangler secret put ADMIN_SESSION_SECRET
   npx wrangler secret put VENMO_HANDLE
   npx wrangler secret put ZELLE_CONTACT
   npx wrangler secret put APPLE_CASH_CONTACT
   ```

3. **Git-connected Worker build settings** (Workers & Pages → Create → connect
   to `zachfranzen123/pins`):
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx wrangler deploy` (the dashboard default — leave it)

4. **Custom domain**: once deployed, add `pins.hizach.com` under the
   Worker's Settings → Domains & Routes (requires `hizach.com`'s DNS to be on
   Cloudflare).

## Running the store day to day

- **Inventory**: `/admin` → Inventory tab, type a new count, Save. Both pins
  seed at 50.
- **Orders**: `/admin` → Orders tab. New orders show as "pending" until you
  confirm the payment actually landed in Venmo/Zelle/Apple Cash, then click
  **Mark paid** — this sends the payment-confirmation email and unlocks
  **Mark shipped**. **Cancel** on a pending order restores its stock.
- **Emails sent automatically**:
  - When an order is placed: the buyer gets "Order received" (with payment
    instructions), and you get "New order" at `ADMIN_NOTIFICATION_EMAIL` (or
    `FROM_EMAIL` if that's not set) — this is your cue to go check Venmo/Zelle/
    Apple Cash for the payment.
  - When you click **Mark paid**: the buyer gets "Payment confirmed".
  - When you click **Mark shipped**: the buyer gets a fun "Shipped — on its way ✈️" email. No tracking number (we don't collect one), just a heads up it's en route.
- **Coupons**: `/admin` → Coupons tab. Create a percent-off or fixed-amount
  code, optionally cap total uses. Deactivate anytime; codes aren't deleted
  so usage history is kept.
