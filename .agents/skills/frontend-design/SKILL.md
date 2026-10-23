---
name: frontend-design
description: >-
  Lead Creative Design Director standards for crafting distinctive, production-grade web interfaces. Use when designing web pages, landing pages, creating new UI components, or elevating existing websites to avoid generic AI styling and ensure distinctive typography, intentional color palettes, and fluid micro-animations.
---

# Frontend Design: Creative Design Director Standard

This skill elevates web development beyond generic templates and predictable AI styling.

## 1. Aesthetic Direction (Choose Before Coding)
Never default to the same generic dark/purple template. Pick a deliberate aesthetic direction that matches the product:
- **Neo-Brutalist**: High-contrast borders, bold typography, hard shadows, offset cards.
- **Editorial / Magazine**: Serif headlines, refined whitespace, restrained palette, storytelling layout.
- **Sleek Dark Mode**: Deep slate/zinc surfaces (`#09090b`), subtle borders (`rgba(255,255,255,0.08)`), glowing radial accents, glassmorphic cards (`backdrop-blur-md`).
- **Warm Minimalist**: Earthy neutrals, soft rounded geometry, elegant typography, warm muted accents.

## 2. Typography Strategy
- Never use default browser system fonts without intention.
- Import distinct, modern typefaces (e.g. from Google Fonts):
  - **Display / Headers**: *Outfit, Syne, Clash Display, Space Grotesk, Cabinet Grotesk, Playfair Display*.
  - **Body / Reading**: *Plus Jakarta Sans, Inter, DM Sans, Satoshi*.
  - **Mono / Technical**: *JetBrains Mono, Fira Code, Space Mono*.
- Establish a strict modular scale: `h1` (clamp(2.5rem, 5vw, 4rem)), `h2` (2rem), `h3` (1.5rem), body (1rem).

## 3. Curated Color Systems & Tokens
- Use HSL or CSS variables for semantic design tokens:
  - `--background`: base canvas color
  - `--surface`: card and panel elevation (contrast with background)
  - `--surface-border`: subtle border separation (`1px solid hsl(var(--border) / 0.1)`)
  - `--primary`: intentional brand color
  - `--accent`: high-contrast focal accent used sparingly
- Avoid flat pure black (`#000000`). Use rich deep undertones (`#0a0b10` or `#0b0f19`).

## 4. Visual Dynamism & Polish
- **Dynamic Micro-Interactions**: Hover lifts (`translateY(-2px)`), button glow, card borders that lighten on hover.
- **Hero Staging**: Lead with an impactful, interactive visual or live preview rather than a generic 3-card stat grid.
- **No Missing Images**: Never leave broken `<img>` tags or placeholders. Use inline SVGs, CSS patterns, or generate clean media assets.
