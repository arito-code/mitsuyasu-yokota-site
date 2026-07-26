# DESIGN.md — Mitsuyasu Yokota

## Design concept
**漆黒 × 金箔 × 京紫**
Museum-like Japanese contemporary luxury.

Visual metaphor:
> 漆黒の余白の中で、金が光を受け、京紫が気配として残る。

## Palette
- Black / primary: `#070709`
- Black / elevated: `#0D0C10`
- Panel: `#111015`
- Gold: `#C9A45D`
- Light gold: `#EAD49D`
- Kyoto purple: `#56346A`
- Purple highlight: `#7D5A91`
- Warm white: `#F5F1E8`
- Muted text: `#A9A2AB`
- Gold line: `rgba(201,164,93,.28)`

### Color meaning
- Black = silence / prestige / spatial depth
- Gold = heritage / provenance / value
- Purple = inner world / mystery / spirit

Gold must not exceed roughly 10–15% of the visible UI.
Purple should appear in gradients, glow, hover, section transitions, not large solid blocks.

## Typography
Goal: Japanese editorial luxury, not “samurai font”.

Japanese:
- Prefer Noto Serif JP / Shippori Mincho / Yu Mincho
English display:
- Cormorant Garamond / EB Garamond / high-contrast serif
UI:
- Inter / Helvetica / sans-serif

Large headlines may use dramatic scale:
desktop 72–128px.
Body 15–18px, generous line-height 1.8–2.0.

## Layout
- Max content width: 1400–1480px
- Large whitespace
- Hero = nearly full viewport
- Asymmetrical 40/60 and 55/45 compositions
- Full-bleed image sections for proof/case studies
- Avoid repetitive equal-sized cards

## Photography rules
Priority:
1. Full artwork
2. Detail / light / texture
3. Artwork in space
4. Artist working
5. Artist portrait
6. Exhibition / provenance

A single section should not mix low-resolution media thumbnails with high-resolution professional art photography.

## Motion
Allowed:
- Hero Ken Burns: 14–20 sec
- Scroll reveal: opacity + 20–40px
- Image parallax: very subtle
- Hover image scale: 1.02–1.06
- Gold line drawing
- Page transition fade

Avoid:
- Fast carousels
- particle effects
- neon purple
- excessive 3D
- bouncing buttons
- generic luxury sparkles

Respect `prefers-reduced-motion`.

## UI tone
Buttons:
- Primary: gold fill / black text
- Secondary: thin gold border
- Text links: understated arrow

Preferred labels:
- Available Works
- Request a Private Viewing
- Private Commission
- For Interior Designers
- View Provenance
- Inquire About This Work

Avoid:
- SALE
- BUY NOW everywhere
- Only 1 left!
- Limited offer
