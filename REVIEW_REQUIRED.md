# Universal Electronics — Review Before Publication

The site is a local rebuild from the recovered WordPress and SQL backup. The original files remain unchanged.

## Contact and domain

- **WhatsApp:** The owner chose the recovered Contact page mobile number, +251 911 102 251, for now. The site uses `wa.me/251911102251`. Confirm this number actually has the intended WhatsApp account before publishing.
- **Telegram:** The owner confirmed `@universal_electronics_et`.
- **Conflicting number:** The old Home page also mentions +251 911 917 583. Decide which number, if any, should appear on the new site.
- **Domain:** GitHub Pages uses the repository URL for now. The expired domain is no longer embedded in enquiry messages. Update `astro.config.mjs` and DNS only when a final custom domain is ready.

## Product content

- **59 products:** Titles, descriptions, features and specification tables came from the archived catalog. Review model names, brand assignments, and technical values against current manufacturer sheets before publishing. Some archived copy contains mixed models, citation text, or marketing claims.
- **Images:** Three products lack matched product photography: `leoch-um6k-10d-um6k-20d-residential-energy-storage-battery-wall-mounted`, `ritar-ress-48v-51-2v-lifepo4-battery-rack-mount-residential-energy-storage`, and `grundfos-sp7-31-submersible-borehole-pump-high-head-stainless-steel`. The catalog shows a neutral image-unavailable state.
- **Prices and stock:** The backup contains no reliable current prices or inventory. Get current business data before adding either.

## Projects and recognition

- **Project archive:** The public page shows recovered photographs without detailed project performance claims. Review project records before publishing individual case studies, figures, locations, or captions.
- **Recognition:** The public page links to original document images. Review translations, dates, issuer names, and document claims before using them in public captions or marketing copy.
- **Brand relationships:** Do not use “authorized distributor” or exclusivity language until current agreements are confirmed.
- **Founding year, warranty, delivery:** Confirm these with the business before adding them to the site.

## Release

Run `npm.cmd run check` and `npm.cmd run build` in `site/`, review the pages at mobile and desktop widths, then test the final public routes and enquiry links after deployment. Local and live builds cannot verify external WhatsApp or Telegram account ownership.
