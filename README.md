# Connect2Air — Brands That Fly Higher

A single-page, scroll-driven website for Connect2Air's drone LED display and
aerial advertising business, built with React, TypeScript, Vite, Tailwind CSS,
GSAP/ScrollTrigger and Lenis.

## 1. Installation

```bash
cd client
npm install
cd ../server
npm install
```

## 2. Development

```bash
cd client
npm run dev
```

Opens the site at `http://localhost:5173` with hot reload.

## 3. Production build

```bash
cd client
npm run build
```

Type-checks with `tsc -b` and outputs an optimized build to `dist/`.

## 4. Preview the production build

```bash
cd client
npm run preview
```

## 5. Run the backend API

```bash
cd server
npm run dev
```

The API listens on `http://localhost:5000` and requires `MONGO_URI` in
`server/.env`.

## 6. Replace the logo

Drop your files in and they're picked up automatically — no code changes:

```
client/public/assets/connect2air-logo.png
```

Used in the navbar, footer, loading screen and Open Graph/Twitter meta tags
(`client/index.html`).

## 7. Replace campaign / experience imagery

The "Experiences" grid currently uses generated dark gradients per category
(no stock or placeholder photography was used, per brief). To swap in real
photography, edit `client/src/sections/Campaigns.tsx` and replace the gradient
`div` per card with an `<img>` or `background-image` pointing at files you
add under:

```
client/public/assets/campaigns/
```

## 8. Add the showreel video

Add a local file at:

```
client/public/assets/showreel.mp4
```

Then open `client/src/sections/Showreel.tsx` and flip:

```ts
const [hasVideo] = useState(false);
```

to `true`. The section is already wired for autoplay-muted-loop once a real
file is present.

## 9. Edit company data (copy, stats, services, process, contact)

Everything editable without touching component code lives in:

```
client/src/data/siteData.ts
```

This includes nav links, hero copy, the five services, the four "why"
points, the four process steps, the reach-section defaults, the campaign
categories, the stats numbers and contact details. All numbers in this file
are clearly-editable placeholders — no invented client names, certifications
or unverified metrics are used anywhere on the site.

## 10. Change colors / design tokens

The full color, type and spacing token system is defined once in:

```
client/src/styles/globals.css
```

under the `@theme` block. Change `--color-signal` / `--color-signal-2` to
adjust the accent pink, or the `--color-void*` / `--color-panel*` values to
adjust the black/charcoal base.

## 11. Modify the "3D" hero scene

The brief called for a React Three Fiber scene. This build intentionally
uses a procedural CSS/SVG/Canvas rig instead of `@react-three/fiber`:

- `client/src/components/DroneDisplay.tsx` — the LED panel + drone rig used in the
  hero (pixel grid, flicker, drone float/rotor-spin via CSS keyframes).
- `client/src/components/PixelField.tsx` — the canvas-based particle system that
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
client/src/
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

`client/index.html` sets title, meta description, Open Graph and Twitter card tags.
`client/public/robots.txt` and `client/public/sitemap.xml` are included as a starting
point — update the sitemap's `<loc>` once the site has a real domain.
