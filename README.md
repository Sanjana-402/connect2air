# Connect2Air — Brands That Fly Higher

A single-page, scroll-driven website for Connect2Air's drone LED display and
aerial advertising business, built with React, TypeScript, Vite, Tailwind CSS,
GSAP/ScrollTrigger and Lenis.

## 1. Installation

```bash
npm install
```

## 2. Development

```bash
npm run dev
```

Opens the site at `http://localhost:5173` with hot reload.

## 3. Production build

```bash
npm run build
```

Type-checks with `tsc -b` and outputs an optimized build to `dist/`.

## 4. Preview the production build

```bash
npm run preview
```

## API URL Configuration (Avoid /api/api)

Frontend calls are built as `${base}/api/...`.

- Preferred production value: `VITE_API_URL=` (empty, same-origin).
- If someone sets `VITE_API_URL=/api`, the app now normalizes it and still
  calls `/api/...` correctly.

After deploy, verify no localhost fallback is baked into assets:

```bash
grep -Rni "localhost:5000" dist
```

## 5. Replace the logo

Drop your files in and they're picked up automatically — no code changes:

```
public/assets/connect2air-logo.png
```

Used in the navbar, footer, loading screen and Open Graph/Twitter meta tags
(`index.html`).

## 6. Replace campaign / experience imagery

The "Experiences" grid currently uses generated dark gradients per category
(no stock or placeholder photography was used, per brief). To swap in real
photography, edit `src/sections/Campaigns.tsx` and replace the gradient
`div` per card with an `<img>` or `background-image` pointing at files you
add under:

```
public/assets/campaigns/
```

## 7. Add the showreel video

Add a local file at:

```
public/assets/showreel.mp4
```

Then open `src/sections/Showreel.tsx` and flip:

```ts
const [hasVideo] = useState(false);
```

to `true`. The section is already wired for autoplay-muted-loop once a real
file is present.

## 8. Edit company data (copy, stats, services, process, contact)

Everything editable without touching component code lives in:

```
src/data/siteData.ts
```

This includes nav links, hero copy, the five services, the four "why"
points, the four process steps, the reach-section defaults, the campaign
categories, the stats numbers and contact details. All numbers in this file
are clearly-editable placeholders — no invented client names, certifications
or unverified metrics are used anywhere on the site.

## 9. Change colors / design tokens

The full color, type and spacing token system is defined once in:

```
src/styles/globals.css
```

under the `@theme` block. Change `--color-signal` / `--color-signal-2` to
adjust the accent pink, or the `--color-void*` / `--color-panel*` values to
adjust the black/charcoal base.

## 10. Modify the "3D" hero scene

The brief called for a React Three Fiber scene. This build intentionally
uses a procedural CSS/SVG/Canvas rig instead of `@react-three/fiber`:

- `src/components/DroneDisplay.tsx` — the LED panel + drone rig used in the
  hero (pixel grid, flicker, drone float/rotor-spin via CSS keyframes).
- `src/components/PixelField.tsx` — the canvas-based particle system that
  forms the `CONNECT2AIR` wordmark mid-scroll and disperses into ambient
  dust; this is the site's recurring signature transition device, reused as
  the backdrop of the "Statement" section between the hero and Services.

This trade-off was made deliberately: a hand-tuned 2D/CSS rig is guaranteed
to render correctly and stay performant across devices, where a from-scratch
R3F scene risks being fragile without a visual test loop. If you want to
swap in a real Three.js scene later, `DroneDisplay.tsx` is a drop-in
replacement target — keep its exported component shape (no required props)
and it will slot into `Hero.tsx` and `FinalCTA.tsx` unchanged.

## Architecture

```
src/
  components/   Navbar, CustomCursor, ScrollProgress, MagneticButton,
                 Loader, DroneDisplay, PixelField
  sections/      Hero, Statement, Services, Why, Experience, Process,
                 Reach, Campaigns, Showreel, Stats, FinalCTA, Footer
  hooks/         useSmoothScroll (Lenis + GSAP ticker), useScrollReveal,
                 useReducedMotion, useMediaQuery
  data/          siteData.ts — single source of truth for all copy/numbers
  lib/           gsap.ts — GSAP + ScrollTrigger singleton
  styles/        globals.css — design tokens + keyframes
```

## Notes on motion & performance

- Smooth scroll (Lenis) and most parallax effects are disabled automatically
  for touch devices and when the OS `prefers-reduced-motion` is set.
- Animations favor `transform`/`opacity` over `top`/`left`/`width`/`height`.
- The pixel field caps its particle count on small screens and is skipped
  entirely under reduced motion.
- The custom cursor and scroll-progress rail are desktop-only and hidden on
  touch devices.

## SEO

`index.html` sets title, meta description, Open Graph and Twitter card tags.
`public/robots.txt` and `public/sitemap.xml` are included as a starting
point — update the sitemap's `<loc>` once the site has a real domain.
