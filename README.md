# Northstar Advisory — Interactive Brand Guidelines

> **Clarity in complexity.**

An interactive brand identity portal for **Northstar Advisory**, a strategic business consultancy. Built as a single-page vanilla HTML/CSS/JS application with zero framework dependencies.

🌐 **Live site:** https://lawrencelyko.github.io/northstar-advisory/

---

## Features

- **12 Brand Chapters** — Introduction through Governance, all interactive
- **42-Page Slide Viewer** — Full PDF page inspector with thumbnail strip, keyboard navigation, and touch swipe
- **Logo Playground** — Switch logo types, ground colours, and scale; toggle clear space; download active SVG
- **Colour System** — Click-to-copy hex swatches, colour ratio bar, WCAG contrast matrix
- **Live Typography Studio** — Adjust font, weight, size, and tracking with real-time preview
- **Copy Analyzer** — Real-time brand voice compliance checker with banned/approved word detection
- **Photo Gallery** — Filterable gallery with lightbox (keyboard + swipe)
- **Social Post Generator** — Live on-brand social mockups
- **Motion Simulator** — Logo draw-on animation and text reveal demos
- **Asset Downloads** — Full brand asset pack ZIP, individual SVGs, PDF
- **Command Palette** — ⌘K search to jump between any section
- **Dark/Light Theme Toggle** — Navy and Ivory theme modes

---

## Brand Identity

| Token | Value |
|---|---|
| Primary Colour | Deep Navy `#0B1F3A` (60%) |
| Secondary Colour | Warm Ivory `#F5F1E8` (30%) |
| Accent Colour | Electric Blue `#2D6BFF` (10%) |
| Display Font | Manrope (300–700) |
| Body Font | DM Sans (400, 500) |
| Tagline | "Clarity in complexity." |

---

## File Structure

```
northstar-advisory/
├── index.html                          # Single-page application
├── css/
│   ├── style.css                       # Core brand stylesheet (2,800+ lines)
│   └── supplements.css                 # Component styles & layout bridges
├── js/
│   ├── data.js                         # Brand data (NORTHSTAR_DATA)
│   └── app.js                          # All interactivity
└── assets/
    ├── logos/                          # 12× SVG logos (all variants)
    ├── patterns/                       # Dot-grid & star-matrix SVG patterns
    ├── mockups/                        # Photography & product mockups
    ├── icons/                          # Icon system reference sheet
    ├── pdf_pages/                      # 42 PDF page renders (page_01–42.png)
    ├── pdf/                            # Complete guidelines PDF
    └── Northstar_Advisory_Assets_Master.zip
```

---

## Running Locally

```bash
cd northstar-advisory
python3 -m http.server 3000
# Open http://localhost:3000
```

No build step. No npm. Pure vanilla.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open command palette |
| `←` / `→` | Navigate slide viewer pages |
| `ESC` | Close lightbox / command palette |

---

## Credits

- **Identity design:** Lyko Artistry
- **Agency:** Northstar Advisory
- **Brand system version:** 1.0
