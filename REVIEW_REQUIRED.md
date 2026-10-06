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

## Brand strip

- The strip lists brands attached to catalog products; it does not claim a partnership. The older logos came from the recovered site. Their white image backgrounds are visually blended into the pale strip, so keep that styling if the strip color changes.
- New logo files were sourced from the brand sites or branded services: [Sun King](https://sunkingcreditportal.com/static/img/SUNKING_FRAUD_APP.png), [Leoch](https://www.leoch.com/Public/Uploads/uploadfile/images/20260831/leochbatterylogo1-190.png), [MUST](https://www.mustpower.com/wp-content/uploads/2023/02/must0.5.png), [Trina Solar](https://www.trinasolar.com/en-glb/wp-content/themes/Child-EN/images/header/TrinasolarLogo_EN_PNG.png), [LONGi](https://www.longi.com/en/), [JBL Professional](https://d3nw26meo6dlp6.cloudfront.net/brands/by_harman_logos/6_1487694705/JBL_Pro_PMS172_RGB_large.png), and [Rockville](https://rockvilleaudio.com/cdn/shop/files/logo-rocklille.png?v=1755579269&width=600). Confirm commercial use of third-party logos before publication.
- **Trusound:** The catalog has a product photo and name, but no logo file. Several unrelated brands use the same name online, so the strip uses text until the product's authentic logo is supplied.

## Release

Run `npm.cmd run check` and `npm.cmd run build` in `site/`, review the pages at mobile and desktop widths, then test the final public routes and enquiry links after deployment. Local and live builds cannot verify external WhatsApp or Telegram account ownership.
