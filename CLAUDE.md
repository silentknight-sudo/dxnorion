# CLAUDE.md — DXN Orion

Pre-launch marketing site + lead CRM/blog admin for **DXN Orion**, Sector 22D, Yamuna Expressway (YEIDA), Greater Noida. Live domain: https://dxn-orion.com

## Commands
- `npm run dev` / `npm start` — runs `server.ts` via tsx (Express + Vite middleware in dev, serves `dist/` in prod)
- `npm run build` — `vite build` to `dist/`
- `npm run lint` — `tsc --noEmit` (the only check; there are no tests)

## Architecture (actual, as of Oct 2026)
- **Frontend:** React 19 + TypeScript + Tailwind v4, single SPA in `src/` (`App.tsx` does client-side routing; pages in `src/pages/`, admin in `src/pages/admin/`).
- **Backend:** `server.ts` (Express). On Vercel it runs as a serverless function via `api/index.ts`; `vercel.json` rewrites `/api/*`, `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml` to it and everything else to `index.html`.
- **Data:** `src/server/db.ts` keeps a JSON store (`data/db.json`) synced with **Firebase Firestore** (`src/lib/firebase.ts`, `firestoreService.ts`, rules in `firestore.rules`). Leads, posts and site settings live in Firestore.
  - README / `prisma/` / `.env.example` still describe Cloud SQL + Prisma + GCS; that stack is **not** wired up in code — treat as stale.
- **Images:** admin uploads go through `/api/admin/upload`; `src/utils/imageCompressor.ts` compresses client-side to stay under Firestore's 1 MB doc limit.
- **Admin auth:** cookie/JWT via `/api/admin/*` and `src/utils/adminAuth.ts`.
- **Tracking:** `src/utils/analytics.ts` — `trackEvent`/`fireLeadConversion`; `loadTrackingScripts()` (called in `main.tsx`) injects GA4 / Google Ads / Meta Pixel only when `VITE_GA4_ID`, `VITE_GOOGLE_ADS_ID`, `VITE_META_PIXEL_ID` are set at build time.

## SEO conventions (from the HOTH audit, Oct 2026)
- `index.html` holds the head SEO: title ≤60 chars, meta description 120–160 chars, canonical `https://dxn-orion.com/`, hreflang `en-IN` + `x-default`, OG/Twitter cards, JSON-LD `@graph` (ApartmentComplex, RealEstateListing, Organization, WebSite, FAQPage, BreadcrumbList).
- `#root` contains static crawlable HTML (H1, price list, location, amenities, FAQs, address) for search/AI crawlers; React replaces it on mount. Keep it in sync with HomePage facts.
- One H1 per page containing "DXN Orion Sector 22D Yamuna Expressway"; headings must not skip levels (H2 → H3, no H4 directly under H2).
- Target keywords: DXN Orion, DXN Orion Sector 22D, DXN Orion Yamuna Expressway, DXN Orion price list / floor plan, 3 & 4 BHK Yamuna Expressway, flats near Jewar / Noida International Airport, YEIDA Sector 22D.
- Sitemap, robots.txt and RSS are generated in `server.ts`.

## Brand / business facts
- Logo: `public/logo.png` (ORION Yamuna Expressway, 178×63, dark text) — shown on a white pill in Header/Footer because the site background is navy `#0B1426`. Gold `#C9A86A`, ivory `#F7F4EE`.
- Sales phone: +91 72172 27777 (also in `App.tsx` / `db.ts` defaults). Keep JSON-LD phone in sync.
- Address used: Plot GH-01, Sector 22D, Yamuna Expressway, Greater Noida, UP 203201.
- Pricing/RERA claims (from ₹2.20 Cr*, UPRERA-PRJ-2025-APP-88492, IGBC Gold) are marketing copy — confirm with the owner before changing.

## Gotchas
- Running `bun install`/`npm i` rewrites `bun.lock`; don't commit that unless dependencies actually changed.
- `public/uploads/` contains admin-uploaded files committed to the repo.
- Outstanding off-code SEO tasks: real GSC verification code, real tracking IDs, social profiles + `sameAs`, SPF/DMARC DNS, Google Business Profile.
