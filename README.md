# Vex — Website Roaster

AI-powered website critique tool. Paste a URL, get scored across five categories — Clarity, Copy, CTA, Trust, Mobile — by a laid-off senior developer with zero patience for bad UX.

**[Live demo →](https://website-roaster-weld.vercel.app/)**

---

## What it does

Vex analyzes any public website and returns a brutally honest, structured critique — not generic AI fluff, but scores grounded in extracted facts (load behavior, copy clarity, CTA placement, trust signals, mobile rendering). Results are shareable via permanent link with a dynamically generated OG image, so a roast can travel on social media and pull in new visitors.

## Why it's more than a wrapper around an LLM API

- **SSRF-hardened fetching** — multi-layer URL validation (`validateUrl.ts`, `assertSafeUrl.server.ts`) with pinned-IP requests via `undici`, blocking DNS rebinding and obfuscated-IP bypasses (octal/hex/decimal IPv4, IPv6 bracket edge cases). Deliberately avoided the popular `private-ip` npm package after finding it has an unpatched SSRF CVE (GHSA-9h3q-32c7-r533).
- **Deterministic fact extraction before grading** — page facts are computed in code, not inferred by the model, which cuts hallucination and keeps scores reproducible. Gemini is used for judgment, not arithmetic.
- **Site-purpose classification** — an established SaaS product isn't graded against startup-landing-page conventions; the model classifies intent before scoring.
- **Caching with correctness in mind** — 24h Redis cache keyed by hostname+pathname.
- **Rate limiting + abuse resistance** — sliding-window limits via Upstash, layered on top of the SSRF protections above.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Gemini 2.5 Flash · Upstash Redis · undici · Satori (OG image generation) · Resend · Vercel

## Screenshots

`[homepage hero]`

`[roast result with populated scores]`

## Architecture notes

```
/api/roast        → validate URL → fetch (SSRF-safe) → extract facts → Gemini scoring → cache → return
/r/[shareId]       → permanent share page, backed by Redis
/api/og            → Satori-rendered OG image, score-reactive color coding
```

Full write-up of the SSRF defense layers and caching strategy available on request — happy to walk through the tradeoffs.

## Running locally

This repo is private and shared selectively. If you have access:

```bash
git clone https://github.com/Kopi-Naparan1/website-roaster.git
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev
```

Requires API keys for Gemini and Upstash Redis (see `.env.example`).

## Contact

Built by Nyro — [reach out](mailto:kopinaparan13@gmail.com) if you want to talk through any of the above.

---

© 2026 Nyro. All rights reserved. This code is provided for viewing/portfolio purposes only — no license is granted for reuse, modification, or distribution.
