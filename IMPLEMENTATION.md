# IMPLEMENTATION.md

## Recommended stack
- Next.js 15+ App Router
- TypeScript strict
- Tailwind CSS OR CSS Modules (choose one; do not mix chaotically)
- Framer Motion for restrained transitions
- next-intl for locale routing
- Vercel or Cloudflare deployment
- Inquiry form (current static HTML): Google Apps Script → Spreadsheet (`CONTACT_FORM_SETUP.md`, `js/contact-form.js`, `gas/inquiry-to-sheet.gs`)
- Future Next.js: Resend / Formspree / server action may replace GAS if needed
- Stripe for direct-payment works if approved
- Wise may be used for B2B invoices / transfers, not as the only consumer checkout

## Routing
Use:
- `/en/...`
- `/ja/...`

Do not implement language solely by client-side text replacement.
Use locale URLs for SEO and sharing.

## Data model
Create `data/works.ts` or CMS schema.

```ts
type Artwork = {
  slug: string
  title: { ja: string; en: string }
  category: "waglass" | "calligraphy"
  year?: number
  status: "available" | "sold" | "por" | "archive"
  priceUSD?: number
  materials?: { ja: string; en: string }
  dimensions?: { width: number; height: number; depth?: number; unit: "mm" | "cm" }
  weightKg?: number
  oneOfOne?: boolean
  certificate?: boolean
  story: { ja: string; en: string }
  images: { src: string; altJa: string; altEn: string }[]
  provenance?: string[]
}
```

Do the same for exhibitions.

## Image performance
- source originals 2500–4000px long edge
- AVIF/WebP
- do not preload all gallery images
- hero priority only
- correct width/height
- responsive `sizes`
- blur placeholder

## SEO
- hreflang ja/en
- canonical
- sitemap
- robots
- OG image
- title/description per route
- VisualArtwork / Person / Organization structured data
- alt text in each locale

## Analytics
Track:
- hero_available_works_click
- hero_commission_click
- work_view
- work_inquiry
- commission_start
- commission_submit
- interior_inquiry
- language_switch
- provenance_view
- shipping_policy_view
- checkout_start
- purchase

GA4 + Search Console minimum.

## Accessibility
- contrast check gold/black
- keyboard nav
- visible focus
- reduced motion
- semantic headings
- alt
- buttons vs anchors correct

## Security / forms
- server-side validation
- rate limiting / anti-spam
- no exposed private email
- file upload restrictions for interior plans
- privacy consent

## Performance target
Lighthouse:
- Performance 90+
- Accessibility 95+
- Best Practices 95+
- SEO 95+
Mobile first.
