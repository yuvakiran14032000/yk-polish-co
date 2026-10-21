# YK Polish Co.

A complete Next.js App Router catalogue and WhatsApp enquiry experience for handmade press-on nails. Ivory, blush and plum styling, the extracted official logo, documented pricing and the supplied care guide are integrated. There is no online payment gateway.

## Run locally

Use Node.js 24 LTS (or Node >=22.13).

```powershell
cd D:\yogitha\yk-polish-co\storefront
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://127.0.0.1:3000. No Supabase credentials are required to explore the collections or prepare a custom WhatsApp brief. With no backend, admin access stays locked and the interface says enquiries are not saved.

For a development-only catalogue demonstration, set `NEXT_PUBLIC_ENABLE_DEMO=true` in `.env.local`, then restart development. Every sample is marked as a demo. Production ignores this flag and never publishes sample inventory.

## Supabase setup

1. Create a Supabase project. In the SQL editor, run `supabase/migrations/202610210001_catalogue.sql`, then `supabase/seed.sql`. The migration is transactional and intended to be applied once; the seed is repeatable.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Do not put the service key in any public variable or source file.
3. Create the owner's account through Supabase Authentication. After verifying its UUID, run this SQL with the actual account ID:

```sql
insert into public.admin_users(user_id) values ('ACTUAL_AUTH_USER_UUID');
```

4. Disable public account signup if it is not needed. This application has no customer account flow. Configure the Auth Site URL and allowed redirect origins for the deployment.
5. Sign in at `/admin`. Add real designs, upload product photographs, configure supported variants and sizes, choose collections, and publish. Drafts and archived designs stay out of the public catalogue. Set collection featured flags and display order to curate the homepage.
6. Upload a brand-owned hero photograph in Settings to replace the disclosed AI concept artwork. Set the WhatsApp number, Instagram URL, hero copy and announcement there.

The SQL enables RLS on every application table. Anonymous users can read published catalogue records and public settings; customer enquiries and admin membership cannot be edited publicly. Only authenticated, explicitly authorised admins can manage catalogue data. Public enquiry creation goes through server-side validation and a service-only transactional RPC. Database snapshots recheck prices and variants before storing an enquiry.

Product photographs live in the `product-images` public bucket with admin-only write policies. Uploads accept JPEG, PNG and WebP, check signatures and limit files to 5 MB. Uploading customer reference images is not enabled; customers share them privately through WhatsApp instead.

## What works

- Home, shop, 13 documented collections and collection detail routes.
- URL-driven search, collection, price, colour, shape, length, occasion and availability filters, sorting and load more. Data-specific filters appear only when products support them.
- Product details, image gallery and zoom, configured variants, quantities, notes, optional add-ons, quick view, related designs and direct enquiries.
- Zustand bag persistence with saved-data validation, quantity edits, preference and add-on edits, removal, clearing, estimated subtotals and Instagram summary copying.
- Server-revalidated combined WhatsApp summaries. The bag stays intact when WhatsApp opens. Preparing, opening and sending are separate states; delivery is never claimed.
- A three-step Custom Nail Studio with validation, review and an explicitly prepared WhatsApp link.
- Supabase admin authentication, product CRUD and archiving, image uploads, collection management, settings, enquiry inspection, status updates and private notes.
- Nail sizing/application/care/removal/reuse guide, brand story, privacy and enquiry terms.
- Page metadata, canonical URLs, Open Graph, robots, sitemap, accurate product and breadcrumb JSON-LD, accessible Radix dialogs, keyboard focus and reduced motion.

## Commands

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm start
node scripts/smoke.mjs
```

`smoke.mjs` requires a running local development server without Supabase credentials. It checks routes, 404s, protected writes, input validation, origin protection and stateless custom enquiry preparation. It never opens WhatsApp or sends a message.

## Vercel deployment

Import the `storefront` directory as the project root. Use the Next.js framework preset, Node 24 and `npm run build`; leave `YK_BUILD_TARGET` unset. Set the three Supabase variables and `NEXT_PUBLIC_SITE_URL` to the actual HTTPS origin, then deploy. The default build script invokes the real Next.js production compiler. This does not require the Sites runtime.

For durable public rate limits, configure Supabase with the migration applied. Set `RATE_LIMIT_IP_HEADER` only to a header overwritten by your trusted proxy (`x-vercel-forwarded-for` on Vercel or `cf-connecting-ip` on Cloudflare). Without Supabase, rate limits are per process; the credential-free fallback is for preview use. Use host-level request/body limits for public production traffic.

## Sites deployment

The existing project is recorded in `.openai/hosting.json`. Keep that identity and its owner-private audience. The retained Vinext/Cloudflare adapter can build the same App Router source for Sites. Set the build process variable `YK_BUILD_TARGET=sites` when calling the official Sites build helper; it dispatches to `scripts/run-framework.mjs`. Default Next/Vercel builds are unaffected.

Use the official Sites source workflow to push the exact source state, package the Worker build, and save/deploy its matching version. Credentials go through the helper's hidden stdin, never source files. Store runtime secrets through Sites environment-variable management and set the actual site origin. Do not publish development samples.

## Content and launch notes

The PDFs supply no actual product photographs, product names, testimonials or Instagram feed. Production therefore starts with collections and useful empty product states. Individual designs appear when the owner publishes them. The existing hero is explicitly marked as AI concept art, and collection nail illustrations are decorative. No customer reviews or sales claims are fabricated.

Before accepting purchases, the owner should confirm production/delivery timing, payment arrangements, cancellation/return terms and data-retention practice. The visible terms describe the enquiry workflow without inventing these policies. A live Supabase project is required to verify authentication, RLS, storage and saved-enquiry behaviour end to end; no successful connection is assumed without credentials.

## Architecture

- `app/`: server-rendered pages, metadata and route handlers.
- `components/`: storefront interactions and admin editors; `components/ui/` contains retained shadcn components.
- `lib/catalogue.ts`: request-memoised public Supabase catalogue with safe fallback.
- `lib/enquiry.ts`, `validation.ts`, `cart-storage.ts`: price snapshots, messages and validation.
- `lib/supabase/`: server-only authorisation/service access and browser session refresh.
- `supabase/`: normalised schema, RLS, storage policies, transactional functions and documented seed.
- `tests/`: meaningful business-rule, persistence and tamper-resistance checks.

The logo is extracted from the provided sticker without changing its proportions or typography. The original PDFs are available in `public/references/` for customers to consult.
