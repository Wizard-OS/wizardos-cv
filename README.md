# Osvaldo Cintra García — Portfolio

A bilingual, static portfolio based on [AstroWind](https://github.com/onwidget/astrowind), built with Astro, Tailwind CSS, TypeScript, and GSAP.

## Run locally

Requires Node.js 22.22.3 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:4321/en/. The root redirects to English. Spanish is at /es/.

Astro 7 starts a background development server. Stop it with:

```sh
npm run astro -- dev stop
```

## Production and checks

```sh
npm run check
npm run build
npm run test:build
npm run preview
```

Static output is in dist/. The GitHub repository is https://github.com/Wizard-OS/wizardos-cv.

## Deploy to Vercel

Import Wizard-OS/wizardos-cv in Vercel using the Astro framework preset. Build command: npm run build. Output directory: dist/. Install command: npm ci. Use Node.js 24.x.

The production URL is detected from Vercel's VERCEL_PROJECT_PRODUCTION_URL system variable. PUBLIC_SITE_URL takes precedence if a custom domain is configured. Canonical URLs, language alternates, social cards, robots.txt, and the sitemap use that origin. Keep automatic system environment variable exposure enabled.

For another host, copy .env.example to .env and set PUBLIC_SITE_URL to the real HTTPS origin before building. Never commit .env files or .vercel metadata.

## Edit the portfolio

- src/data/portfolio.ts: both languages, profile, contact, services, experience, and three project cases.
- src/assets/styles/portfolio.css: layout, green palette, responsive styles, and accessible motion.
- src/scripts/portfolio.ts: GSAP animations, page lifecycle cleanup, mobile navigation, process tabs, gallery controls, and email copy.
- src/components/portfolio/ProjectArt.astro: original conceptual SVG illustrations, not screenshots.
- src/config.yaml: AstroWind defaults. PUBLIC_SITE_URL overrides its site origin.
- public/documents/Osvaldo_Cintra_Garcia_CV.pdf: original English CV.

Work summaries are based on the supplied CV. No testimonials, client endorsements, invented results, or product screenshots are included. The illustrations are explicitly labeled as conceptual. Contact uses mailto and a clipboard button; no backend or email service is required. The phone number is not shown in the page; the original downloadable CV retains its original contents.

## Publish an article

Add a .md or .mdx file in src/data/articles/. Start from the included unpublished drafts:

```yaml
---
title: Your article title
excerpt: A short description.
lang: en
translationKey: a-shared-translation-key
publishDate: 2026-10-26
draft: false
---
```

The filename becomes the slug. Spanish articles use lang: es and a matching translationKey. They may use a different filename; the language switch locates the counterpart by translationKey.
Drafts and future-dated posts are excluded from lists and generated pages. With no published articles, the journal has a deliberate empty state.
For nested en/ or es/ folders, that locale prefix is omitted from the slug.
When an article has no translated counterpart, the language switch opens the other language's journal.

## Accessibility and motion

The mixed dark/light palette is intentional. Keyboard focus, skip navigation, native scrolling, language alternatives, semantic controls, and reduced-motion support are included.
On smaller screens, 3D hover and scroll effects are removed; the project gallery supports touch scrolling and buttons.
Content remains visible with JavaScript disabled. Process steps become a readable list and mobile navigation remains available.

## Attribution

Built on AstroWind. Its MIT license is retained in LICENSE.md. Original project illustrations and portfolio-specific code were created for this portfolio.
