# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static marketing website for **BeopenSound**, a hearing-care clinic in Viña del Mar, Chile (beopensound.cl). No build system, no package manager, no framework — plain HTML/CSS/JS deployed as-is to Vercel.

## Commands

There is no build/lint/test tooling. To preview locally, serve the directory as static files, e.g.:

```bash
python3 -m http.server 4173
```

The `.claude/launch.json` preview config expects a static server at `http://127.0.0.1:4173`.

Repo maintenance is done via small one-off Python scripts run directly with `python3 <script>.py` (see below) rather than a task runner.

## Architecture

- **Multi-page static site**: each top-level page is its own standalone `.html` file (`index.html`, `audifonos.html`, `audiometria.html`, `lavado-de-oidos.html`, `calibracion-de-audifonos.html`, `nosotros.html`, `preguntas-frecuentes.html`, `contacto.html`, `politica-de-privacidad.html`). There is no templating engine — shared markup (nav, footer, header) is duplicated across every file.
- **Shared assets**: one global `style.css` and one global `script.js` are linked from every page. `script.js` wires up the mobile hamburger menu (`#menuToggle` / `#navLinks` + a generated `.nav-overlay`) and smooth-scroll anchor handling; treat it as the single source of truth for interactive behavior.
- **Because nav/footer are duplicated per page**, any change to site-wide navigation or footer content must be applied consistently across *all* `.html` files. `update_navs.py` shows the established pattern: regex-replace the `<nav class="nav-links" id="navLinks" ...>`, `<nav class="footer-nav" ...>`, and `<div class="footer-bottom">` blocks across `glob.glob("*.html")`. Prefer writing/reusing a similar script for any cross-page structural change rather than hand-editing each file.
- **SEO/metadata is per-page and heavy**: each `<head>` carries canonical URL, Open Graph, Twitter Card, and Schema.org JSON-LD (`WebSite`, `MedicalClinic`/`Person`, etc.). Keep these in sync with page content when editing titles/descriptions.
- **Routing/redirects**: `vercel.json` configures `cleanUrls: true` (so `/audifonos.html` is served at `/audifonos`) plus redirects (`/index.html` → `/`, `/home` → `/`, `/inicio` → `/`). Internal links throughout the HTML use the clean, extension-less paths (e.g. `href="/audifonos"`).
- **Analytics/tracking conventions**: outbound WhatsApp links (`href="https://wa.me/56971372348"`) and form submit buttons carry inline `onclick="gtag('event', ...)"` handlers for GA event tracking (`click_whatsapp`, `submit_form` events). When adding new WhatsApp CTAs or forms, follow the existing `gtag` event/category/label pattern (see `fix_wa.py`, `fix_wa2.py`, `fix_form_submit.py` for the exact conventions used).
- **Images**: served from `images/`, expected to have non-empty `alt` text and `loading="lazy"` (except the first/logo image on a page) — see `check_images.py` for the convention this repo enforces and `fix_lazy_load.py` for how it was applied in bulk.
- **One-off maintenance scripts** (`fix_*.py`, `update_navs.py`, `check_*.py`) are throwaway/idempotent-ish tools used historically to apply repo-wide find/replace edits across all HTML files. They are kept as a record of past bulk edits and as templates — when a task requires the same kind of cross-file change (e.g. updating nav links, footer text, adding tracking attributes), write a similar small `glob.glob("*.html")` + string/regex replace script rather than editing every file by hand.
- **robots.txt / sitemap.xml**: kept in sync with the live page set; update both when adding or removing a page.
