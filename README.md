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
| `/projects/` | **Project Archive:** Photographs preserved from the previous site; project claims await review. |
| `/recognition/` | **Recognition:** Original document images linked for direct inspection. |
| `/about/` | **About Us:** Business introduction and catalog areas. |
| `/contact/` | **Contact:** Address, phone numbers, email, Telegram, and WhatsApp. |
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

---

## Deployment

The `.github/workflows/deploy.yml` workflow builds the site and deploys to GitHub Pages on pushes to `main`. The published project path is `https://yohannesmulugeta.github.io/universalelectronics/`. It sets `GITHUB_PAGES=true` so internal routes and assets use the repository path. Local builds continue to use `/`.

Before changing to a custom domain, update `astro.config.mjs`, remove the project base, configure DNS and GitHub Pages, and verify all public routes. See `REVIEW_REQUIRED.md` for business content that still needs review.
