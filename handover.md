# wood.mattbedford.work — Project Handover

## Overview

A static woodworking portfolio site for Matt Bedford. Minimal, image-heavy, updated once or twice a month.

## Architecture

- **Hosting**: Cloudflare Pages (deployed from Git repo)
- **Images**: Cloudflare R2 (referenced by URL from the site)
- **Data**: A single `projects.json` file acts as the "database"
- **Build step**: None. Pure static HTML/CSS/JS. No frameworks, no bundlers, no Node dependencies.
- **Domain**: `https://wood.mattbedford.work`

The workflow for adding a new project:
1. Upload photos to R2
2. Add a new entry to `projects.json`
3. Git push → Cloudflare Pages deploys automatically

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` or `/index.html` | Landing page — hero/intro, maybe a few featured projects |
| Projects | `/projects.html` | Grid/gallery of all projects with tag filtering (client-side JS) |
| Single Project | `/project.html?slug=xxx` | Detail view for a single project (reads from JSON by slug) |
| About | `/about.html` | About Matt / the woodworking |

### Navigation Flow

Home → Projects → Single Project (with back button + next/previous project navigation)

## Data Schema: `projects.json`

```json
{
  "imageBaseUrl": "https://images.mattbedford.work",
  "projects": [
    {
      "slug": "oak-coffee-table",
      "title": "Oak Coffee Table",
      "description": "Built from reclaimed oak, hand-finished with Danish oil.",
      "date": "2025-02-01",
      "lastModified": "2025-02-05",
      "tags": ["tables"],
      "mainImage": "main.jpg",
      "gallery": [
        "01.jpg",
        "02.jpg"
      ]
    }
  ]
}
```

### Image URL construction

The JS constructs full image URLs from three parts:

```
{imageBaseUrl}/{slug}/{filename}
```

For example: `https://images.mattbedford.work/oak-coffee-table/main.jpg`

This means if the R2 subdomain ever changes, you update `imageBaseUrl` once and everything still works.

### R2 folder structure

Each project gets a folder in R2 named after its slug:

```
r2-bucket/
├── oak-coffee-table/
│   ├── main.jpg        ← hero/thumbnail image
│   ├── 01.jpg          ← gallery images, numbered
│   ├── 02.jpg
│   └── 03.jpg
├── walnut-lamp/
│   ├── main.jpg
│   ├── 01.jpg
│   └── 02.jpg
```

Convention: folder name = slug, `main.jpg` is always the hero/thumbnail, numbered files are gallery images.

### Notes on the schema
- `imageBaseUrl` is defined once at the top level — all image paths are relative to `{imageBaseUrl}/{slug}/`
- `slug` is used for URL routing (`project.html?slug=oak-coffee-table`), as a unique identifier, and as the R2 folder name
- `tags` is a flat array — no hierarchy. Known tags so far: `little wooden houses`, `lighting`, `tables`, `boxes`, `restorations`. New tags can be added freely.
- `description` is plain text, kept short (a sentence or two).

## Design Spec

### Overall Feel
- **Minimal** with plenty of whitespace
- The photography provides the texture and "grit" — the design itself stays clean
- Not cookie-cutter or template-y. Should feel personal and crafted.

### Typography
- **Headers/titles**: A serif font (choose something with character — not Times New Roman)
- **Body/everything else**: A clean sans-serif
- Both from Google Fonts or similar free source

### Layout
- Generous whitespace throughout
- Image-forward — photos should be the dominant visual element
- Responsive (mobile-friendly)

### Header & Footer
- **Shared across all pages using Web Components** (native custom elements)
  - `<site-header>` — nav with links to Home, Projects, About
  - `<site-footer>` — contact info lives here (no dedicated contacts page)
- These are defined in a shared JS file and used on every page
- This is Matt's first time using Web Components, so keep them clean and well-commented

### Colour Palette
- Keep it restrained. Whites, off-whites, maybe a warm neutral or muted accent.
- Let the project photos be the colour.

## Tag Filtering (Projects Page)

- Client-side JavaScript
- Show all tags as clickable filters above the project grid
- Click a tag → show only projects with that tag
- "All" option to reset
- No URL routing needed — just show/hide

## Single Project Page

- Receives project slug via query parameter: `project.html?slug=oak-coffee-table`
- Reads `projects.json`, finds matching project
- Displays: title, date, description, main image, gallery
- Navigation: Back to Projects button + Previous/Next project links
- Gallery: simple lightbox or scrollable gallery (keep it lightweight, no heavy libraries)

## File Structure

```
/
├── index.html              # Home page
├── projects.html           # Projects listing with tag filters
├── project.html            # Single project detail (query param routing)
├── about.html              # About page
├── projects.json           # Project data
├── css/
│   └── style.css           # All styles
├── js/
│   ├── components.js       # Web Components (header, footer)
│   ├── projects.js         # Projects page logic (fetch JSON, render grid, filtering)
│   └── project.js          # Single project page logic (fetch JSON, render detail)
└── img/
    └── (any site assets — logo, favicon, etc. NOT project photos)
```

## Technical Notes

- **No build tools**. No npm, no bundlers, no transpilation. Just files.
- **No frameworks**. Vanilla HTML, CSS, JS.
- **No external JS dependencies**. The lightbox/gallery should be built from scratch or CSS-only.
- **Web Components** for header/footer — use `customElements.define()`, Shadow DOM optional (up to you, but keep it simple).
- **CSS**: Use custom properties (variables) for colours, fonts, spacing. Makes it easy to tweak later.
- **Responsive**: Mobile-first or at least fully responsive. CSS Grid and/or Flexbox.
- **Accessibility**: Semantic HTML, alt text on images (can come from project title), keyboard navigation.
- Matt **hates Python and JavaScript** (though uses JS when necessary). So keep JS minimal, clean, and well-commented. Don't over-engineer.

## What's NOT In Scope (Yet)

- **Contact form** — might come later, possibly using Brevo API. For now, contact info is just text in the footer.
- **R2 setup** — the R2 bucket and URL structure need to be configured separately. For now, use placeholder image URLs in the JSON.
- **Git repo setup** — Matt will handle this. The handover is for the site code itself.

## Matt's Preferences (for Claude Code)

- Step by step. Wait for confirmation before proceeding.
- Explain what you're doing and why — Matt wants to learn.
- Custom solutions over off-the-shelf. No plugins, no libraries.
- Lightweight and clean. Every line of code should earn its place.
- PHP developer by trade, comfortable with code but new to Web Components.
