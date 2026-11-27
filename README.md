# Interactive Bento Grid
> **Live Demo:** View Interactive Bento Grid: (https://nextjs-telemetry-bento-beta.vercel.app)
> 
> Built as a clean 4-card UI showcase in Next.js and TypeScript with simulated telemetry data, smooth motion transitions, and mobile-friendly interactions. Feel free to explore the live preview, inspect the code, or adapt any part of it for your own UI experiments.

A lightweight, zero-dependency interactive Bento Grid component for Next.js (App Router) and TypeScript. Built with CSS variables, native Web Animations API, and `IntersectionObserver` / `ResizeObserver` so animations stay smooth and pause automatically when off-screen.

## Overview

- **4 Interactive Cards:**
  1. **Real-Time Event Pipeline (`c1`):** Live event stream with source/status filtering (`All`, `Webhooks`, `Errors`) and a manual test-event trigger.
  2. **Edge Latency & Routing (`c2`):** Multi-region latency monitor with animated bar sweeps, live jitter ticks, and one-click outage failover simulation.
  3. **Integration Beam Hub (`c3`):** Responsive SVG cubic-bezier wires with animated gradient pulses and pointer/touch beam highlighting.
  4. **Live Activity & Telemetry (`c4`):** Time-window metric tweening (`1h`, `24h`, `7d`) paired with an auto-rotating overlapping activity card stack.
- **Zero External Animation Dependencies:** Uses CSS transitions, SMIL SVG gradients, and the native Web Animations API (`element.animate`).
- **SSR & Hydration Safe:** Defers `Date.now()` and random ID generation until client mount to prevent Next.js prerender or hydration mismatches.
- **Accessible & Motion-Aware:** Includes ARIA roles and states (`tablist`, `aria-pressed`, `aria-live`), pointer-only card hover states (`@media (hover: hover) and (pointer: fine)`), and `@media (prefers-reduced-motion: reduce)` fallbacks.

## Project Structure

```text
├── app/
│   ├── globals.css        # Theme tokens, 12-column grid layout, and scoped card styles
│   ├── layout.tsx         # Google Fonts setup (Instrument Serif, Inter, JetBrains Mono)
│   └── page.tsx           # Renders <BentoGrid />
├── components/
│   └── BentoGrid.tsx      # Self-contained client component and card sub-components
└── data/
    └── bento-data.json    # Default card copy, regions, beam nodes, and telemetry data
```

## Setup & Installation

### 1. Copy the Files

Place the following files into your Next.js App Router project:

- `components/BentoGrid.tsx`
- `data/bento-data.json`
- `app/globals.css`
- `app/layout.tsx`

### 2. Configure Fonts in `app/layout.tsx`

The stylesheet expects three CSS font variables (`--font-serif`, `--font-sans`, `--font-mono`) loaded via `next/font/google`:

```tsx
import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Interactive Bento Grid",
  description: "Reusable interactive bento grid component for Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
```

### 3. Render the Component

Import and render `BentoGrid` in any page or layout:

```tsx
import BentoGrid from "@/components/BentoGrid";

export default function HomePage() {
  return <BentoGrid />;
}
```

*(Ensure your `tsconfig.json` maps `"@/*": ["./*"]` or `"./src/*"` depending on whether you use a `src/` directory.)*

## Customizing Data

### Option A: Edit `data/bento-data.json`

Update titles, descriptions, intervals, region latencies, beam nodes, or telemetry numbers directly in `data/bento-data.json`.

### Option B: Pass a `data` Prop to `<BentoGrid />`

Override any individual card configuration (`events`, `regions`, `beam`, or `activity`) by passing its complete card config object:

```tsx
import BentoGrid from "@/components/BentoGrid";

export default function CustomPage() {
  return (
    <BentoGrid
      data={{
        regions: {
          icon: "globe",
          title: "Global Edge Network",
          desc: "Automatic failover across active PoPs.",
          defaultActiveId: "iad1",
          tickMs: 2200,
          items: [
            { id: "iad1", base: 12, city: "Virginia" },
            { id: "fra1", base: 20, city: "Frankfurt" },
            { id: "sin1", base: 29, city: "Singapore" },
            { id: "hnd1", base: 25, city: "Tokyo" },
          ],
        },
      }}
    />
  );
}
```

### Available Icons

Each card and beam node accepts an `icon` string matching one of the built-in SVG icons in `BentoGrid.tsx`:

`stream` | `bolt` | `globe` | `chart` | `link` | `queue` | `store` | `audit`

## Styling & CSS Customization

Component styles are scoped under `.bento` and driven by `:root` CSS variables in `app/globals.css`:

```css
:root {
  --canvas: #F7F8FA;        /* Page background */
  --surface: #FFFFFF;       /* Card background */
  --inset: #F3F5F8;         /* Inner panel background */
  --hover-card: #FBFCFD;    /* Card background on pointer hover */
  --hover-inset: #F1F4F8;   /* Inner panel background on pointer hover */
  --hairline: rgba(15, 23, 42, .09);
  --ink: #0F172A;           /* Primary headings & buttons */
  --body: #475569;          /* Body descriptions */
  --meta: #8A99AD;          /* Timestamps & labels */
  --blue: #2563EB;          /* Active beam & focus accent */
  --emerald: #059669;       /* Healthy status & active region bar */
}
```

### Responsive Breakpoints

- **Desktop (`>= 1024px`):** 12-column grid — Row 1 uses `7 / 5` columns (`c1`, `c2`), Row 2 uses `6 / 6` columns (`c5`, `c6`).
- **Tablet (`768px – 1023px`):** 2×2 equal-width grid.
- **Mobile (`<= 767px`):** Single-column stacked layout with `40px` minimum touch targets and scaled beam node spacing.
