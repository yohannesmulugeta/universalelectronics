# Universal Electronics Website

The **Universal Electronics** website is built with **Astro**, **TypeScript** (strict mode), **Tailwind CSS**, and a **React** island for interactive product filtering.

It presents a responsive catalog and direct-message enquiry flow for solar and sound products in Ethiopia.

---

## Technical Stack

* **Framework:** [Astro](https://astro.build/) (Static Site Generation, `trailingSlash: 'always'`)
* **Interactive Island:** React 19 + TypeScript for catalog search and filtering (`src/components/CatalogFilter.tsx`)
* **Styling:** Tailwind CSS with custom design tokens (`tailwind.config.mjs`) and typography in `src/styles/global.css`
* **Data:** Strictly typed local TypeScript data in `src/data/` derived from the curated `rebuild-ready/` archive
* **Assets:** Curated images organized in `public/assets/` with no external runtime dependencies

---

## Getting Started (PowerShell Commands on Windows)

Open a PowerShell terminal in the `site/` directory:

```powershell
# Navigate into the site directory
cd D:\01_Software_Development\1.1_Web_Applications_and_Sites\unversalelectronicset\site

# Install dependencies (already installed during initial build)
npm.cmd install

# Start the local development server (runs at http://localhost:4321/)
npm.cmd run dev

# Run TypeScript type check
npm.cmd run check

# Build the static production distribution
npm.cmd run build

# Preview the built production files locally
npm.cmd run preview
```

---

## Page Routes

| Route | Purpose & Content |
| --- | --- |
| `/` | **Home:** Solar and sound introduction, featured products, archive links, and contact CTA. |
| `/shop/` | **Catalog:** All 59 published products with interactive keyword search, category dropdown, brand filter, alphabetical sorting, and shareable URL query parameters. |
| `/shop/solar/` | **Solar Solutions:** 39 solar products grouped across Inverters, Solar Batteries, Solar Water Pumps, Solar Panels, and Lanterns. |
| `/shop/sound/` | **Professional Sound:** 20 sound products grouped across Speakers, Amplifiers, Microphones, Keyboards, and Mixers. |
| `/category/[slug]/` | **10 Static Category Pages:** Generated routes for `inverters`, `solar-batteries`, `solar-panels`, `solar-water-pumps`, `lanterns`, `speakers`, `amplifiers`, `microphones`, `keyboards`, `mixer`. |
| `/product/[slug]/` | **59 Static Product Detail Pages:** Archived product details, WhatsApp and Telegram enquiry links, and related items. |
| `/projects/` | **Project Archive:** AI-assisted recreations of archived project photographs; project claims await review. |
| `/recognition/` | **Recognition:** Original document images linked for direct inspection. |
| `/about/` | **About Us:** Business introduction and catalog areas. |
| `/contact/` | **Contact:** Address, phone numbers, email, Telegram, WhatsApp, and an email-drafting form. The visitor sends the prepared message from their email app. |
| `/404/` | **Error 404:** Friendly not-found page with catalog links. |

---

## How to Update Content

1. **Updating Products:**
   * Edit `src/data/products.ts`. Each product is typed via the `Product` interface in `src/types/index.ts`.
2. **Updating WhatsApp Phone Number:**
   * Open `src/data/siteConfig.ts` and update `whatsappNumber` when the owner confirms the account. The current number is provisional from the archived Contact page.
3. **Updating Projects:**
   * Edit `src/data/projects.ts`.
4. **Updating Recognition / Certificates:**
   * Edit `src/data/recognition.ts`.
5. **Updating Contact Email:**
   * Edit `email` in `src/data/siteConfig.ts`. The contact form uses this address for its email draft; it does not send messages from the website.

---

## Deployment

Production is hosted by Cloudflare Workers, served exclusively at `https://universalelectronicet.com`. The Worker is named `universalelectronics`. The Cloudflare Workers Builds connection listens for commits to the GitHub `main` branch, runs `npm run build`, then runs `npx wrangler deploy`. The `wrangler.toml` file explicitly names the Worker, static `dist` assets, custom domain, and disabled `workers.dev` URLs. Never remove the custom-domain route when deploying.

A separate GitHub Actions workflow continues publishing a historical mirror at `https://yohannesmulugeta.github.io/universalelectronics/` using `GITHUB_PAGES=true`. Canonical URLs on both builds point to the paid domain. Update the main branch to publish changes, then verify the Cloudflare Workers build is successful. See `REVIEW_REQUIRED.md` for business content still needing review.


## Cloudflare Workers production deployment

- Primary website: https://universalelectronicet.com/
- Worker: `universalelectronics` (not the deleted Cloudflare Pages project).
- Git source: `yohannesmulugeta/universalelectronics`, branch `main`.
- Cloudflare Workers Builds: build `npm run build`, deploy `npx wrangler deploy`.
- Static output: `dist`, configured in `wrangler.toml`.
- `workers.dev` and preview URLs intentionally disabled.
- Search crawler files: `/robots.txt` and generated `/sitemap.xml`.
- Google Search Console property requires sign-in by the owner; Cloudflare Web Analytics is enabled through Cloudflare.

If a Cloudflare build fails, inspect Workers & Pages → universalelectronics → Builds before making DNS changes.

## SEO and asset maintenance

The XML sitemap is generated from the current catalog and category data and is exposed at `https://universalelectronicet.com/sitemap.xml`. The `public/robots.txt` file points crawlers to that URL. Canonical and social-sharing metadata use the purchased domain. Product photographs with no verified match display an explicitly labeled placeholder instead of an unrelated product image.

Current image optimization backlog: several source images exceed 1 MB; compress and resize these binary assets using verified originals before replacing them in `public/assets/`. Do not present a representative manufacturer image as an exact product model without labeling it.
