# EazyDataFix → Python-ecosystem documentation portal

Preserve the current visual language (typography, spacing, neutral palette, VS Code-style code blocks). All additions extend the docs system — no marketing patterns.

## 1. Shared shell upgrades (`__root.tsx` / header)

- **Header layout** (left → right): wordmark · `Latest ▼` version switcher · nav links · search input · `pip install eazydatafix` inline snippet with copy button (hidden < md) · GitHub↗ · theme toggle.
- **VersionSwitcher** — `DropdownMenu` (shadcn). Items: `v0.1.0 (Latest)`, `v0.2.0 — planned`, `v0.3.0 — planned`, `v1.0 — planned`. Static; stores selection in local state only, non-planned items disabled.
- **DocSearch** — `Dialog` opened by clicking the header input or `⌘K`. Fuzzy-matches a static index (title, section, url, keywords) using a tiny local matcher (no library). Grouped results: Getting Started · Reference · Guides · Meta. Keyboard nav (↑↓, Enter, Esc). Index entries cover: Installation, Quick Start, assess(), fix(), profile(), Examples, Roadmap, Contributing, Changelog, Benchmarks, Ecosystem.
- **HeaderInstall** — small mono chip `$ pip install eazydatafix` + copy icon, reused on every docs page hero.

## 2. Route architecture

```
src/routes/
  index.tsx                          Home (docs-first, unchanged philosophy)
  docs.tsx                           Docs layout: left sidebar + <Outlet/> + right TOC
    docs.index.tsx                   → /docs (Introduction landing)
    docs.installation.tsx
    docs.quickstart.tsx
    docs.assessment.tsx
    docs.fixing.tsx
    docs.profiling.tsx
    docs.reports.tsx
    docs.examples.tsx                (in-docs overview; gallery lives at /examples)
    docs.reference.tsx               Reference index (list of functions)
    docs.reference.assess.tsx
    docs.reference.fix.tsx
    docs.reference.profile.tsx
  examples.tsx                       Gallery layout
    examples.index.tsx               grid of example cards
    examples.$slug.tsx               dynamic per-example page
                                     slugs: csv-cleaning, excel-cleaning,
                                     hospital, hr, sales, student, titanic
  roadmap.tsx
  changelog.tsx
  benchmarks.tsx
  ecosystem.tsx
  contributing.tsx
```

Every route defines its own `head()` with unique title/description/og. GitHub link stays external. All URLs typed via `<Link to=... params=...>` (no href interpolation).

## 3. Documentation layout (`docs.tsx`)

Three-column grid on ≥ lg: `[sidebar 260px] [content 1fr max-w-3xl] [on-this-page 220px]`. Below lg the sidebar collapses into a `Sheet`, the right TOC hides.

- **DocsSidebar** — grouped, FastAPI/Pydantic style. Groups: **Getting Started** (Installation, Quick Start), **Guides** (Assessment, Fixing, Profiling, Reports, Examples), **API Reference** (assess, fix, profile — nested under Reference), **Meta** (Roadmap, Changelog, Benchmarks, Ecosystem, Contributing). Active item highlighted from `useRouterState`. Collapsible groups with `defaultOpen` on the group containing the active route. Uses shadcn `Sidebar` primitives with `collapsible="icon"`.
- **OnThisPage** — right-rail component. Reads headings from the content region via a `useEffect` querySelector, then uses `IntersectionObserver` (rootMargin `-10% 0px -70% 0px`) to mark the active section. Clicking scrolls with `scrollIntoView({ behavior: "smooth", block: "start" })`. Sections per page are derived from actual `<h2>`/`<h3>` — spec's list (Installation, Quick Start, Core APIs, Examples, Roadmap) is enforced on `/docs` index only.
- **DocPageHeader** — breadcrumb · title · one-line description · `HeaderInstall` chip so `pip install eazydatafix` stays visible on every doc page.

## 4. Per-function reference pages

Reusable `<FunctionDocPage>` renders the NumPy/Pydantic-style contract in this order, each as an anchored section: **Signature** (mono), **Description**, **Parameters** (table: name · type · default · description), **Returns**, **Raises**, **Examples** (multiple `<ReplBlock>` / `<CodeBlock>`), **Notes**, **Best Practices**, **See Also** (links to sibling functions). Content lives per-page in typed constants so the reference index page can list functions with their one-line descriptions.

## 5. Code block system

Replace the current `CodeBlock` with a shared primitive supporting two modes:

- `variant="code"` — VS Code chrome, filename tab, language chip, action row.
- `variant="repl"` — new **ReplBlock**. Renders Python REPL: `>>> ` prompt lines dim-highlighted, continuation `... ` lines, plain output lines rendered as monospace muted text below (styled like Pandas notebook output — small header row + values for tabular output where relevant, e.g. `Quality Score  94%`).

**Action row** (both variants): `Copy` · `Download` (blob download of raw source, `.py` for code, `.txt` for REPL transcript) · `Open in Colab` (link to `https://colab.research.google.com/#create=true` placeholder) · `Open in GitHub` (link to a placeholder repo path). Icons only on mobile, icon+label ≥ md. Tooltip on hover.

Syntax highlighting continues via the existing highlighter; REPL prompts styled via a small pre/post transform.

## 6. Examples gallery

- `/examples` — responsive card grid. Each card: dataset name, one-line summary, tags (CSV/Excel/etc.), small mono snippet peek.
- `/examples/$slug` — sections: **Overview** · **Dataset** (schema table with placeholder columns/rows) · **Python Code** (`CodeBlock` with all four action buttons) · **Expected Output** (`ReplBlock`) · **Download Dataset** button (disabled with `Placeholder` badge) · **Related Examples**.
- Content stored as typed objects in `src/content/examples.ts` so the index and detail pages share one source.

## 7. Changelog (`/changelog`)

Vertical timeline (left rail with dot markers). Entries: `v0.1.0 — Initial Release`, `v0.1.1 — Bug Fixes`, `v0.2.0 — JSON, Parquet, SQLite Support` (marked `Planned`). Each entry: date (placeholder), summary, bullet list of changes grouped by **Added / Changed / Fixed**. Status chip (`Released` / `Planned`) matches the version switcher.

## 8. Benchmarks (`/benchmarks`)

Grid of comparison cards clearly labeled **Placeholder — measurements pending**. Cards: Execution Time, Memory Usage, Dataset Size Scaling, vs Pandas, vs Polars. Each card = compact stat table + tiny inline bar (pure CSS `div` widths, no chart lib) with `--` values. Top banner explains numbers are illustrative until v1.0.

## 9. Ecosystem (`/ecosystem`)

Card grid, each card = icon (lucide) · name · one-sentence description · status chip (`Available` / `Coming Soon` / `Planned`). Cards: Python Library (Available), CLI Tool, REST API, VS Code Extension, AI Assistant, Web Application, Enterprise Edition, Community. Groups: **Core**, **Developer Tools**, **Cloud & Enterprise**, **Community**.

## 10. Community widget

Small `<CommunityWidget>` (compact variant of existing stats): Stars, Forks, Latest Release, Contributors, License — all placeholder values with a subtle `placeholder` badge in the corner. Rendered in the homepage community section AND at the bottom of the docs sidebar (compact stacked version).

## 11. Homepage adjustments

Keep existing structure; tighten wording so the page reads as `/docs/introduction`:

- Rename hero secondary heading tone to match a doc intro (no "Get Started free" energy).
- Reorder: Hero → What is EazyDataFix (was "Why") → Install (single `CodeBlock`) → Quick Start (`ReplBlock` variant) → Core APIs (cards link to `/docs/reference/*`) → Supported Data Sources → Features → Examples preview (3 cards linking to `/examples`) → Documentation Preview (short excerpt from `/docs/reference/assess`) → Roadmap teaser → Community widget.
- Same typography, spacing, header/footer as docs pages — no hero background gradient, no oversized CTA row.

## 12. Head metadata

Update `__root.tsx` defaults to `EazyDataFix — Data Quality & Cleaning for Python`. Each route sets route-specific `title`, `description`, `og:title`, `og:description`. Reference sub-pages template: `<fn>() — EazyDataFix API Reference`. No `og:image` on `__root`; leaf routes omit unless a real asset exists.

## 13. Files added / touched

**New components** (`src/components/`): `VersionSwitcher.tsx`, `DocSearch.tsx`, `HeaderInstall.tsx`, `DocsSidebar.tsx`, `OnThisPage.tsx`, `DocPageHeader.tsx`, `ReplBlock.tsx`, `FunctionDocPage.tsx`, `ExampleCard.tsx`, `TimelineEntry.tsx`, `EcosystemCard.tsx`, `BenchmarkCard.tsx`, `CommunityWidget.tsx`.

**Extended**: existing `CodeBlock` (adds `Download` / `Colab` / `GitHub` actions + `repl` variant), `SiteHeader` (version switcher, search, install chip).

**Content modules** (`src/content/`): `search-index.ts`, `docs-nav.ts`, `reference/*.ts`, `examples.ts`, `changelog.ts`, `ecosystem.ts`, `benchmarks.ts`.

## 14. Out of scope

- No real search backend, no GitHub API calls, no Colab/dataset uploads (all placeholders).
- No versioned docs implementation — switcher is UI only.
- No MDX runtime — content stays as typed TS objects rendered by React components (keeps SSR clean, avoids extra deps).
- No new backend / Lovable Cloud; everything is static.

## Technical notes

- Sidebar uses shadcn `Sidebar` primitives with `SidebarProvider` scoped to the `docs.tsx` layout only (not global) so `/`, `/examples`, `/changelog`, etc. keep the current full-width layout.
- `OnThisPage` runs entirely client-side inside `useEffect`; SSR renders the empty rail to avoid hydration mismatch.
- Search dialog index is a plain array of `{ title, section, url, keywords }`; matching is `title.toLowerCase().includes(q)` plus keyword hits, ranked by field. No fuse.js dependency.
- Version switcher state stays in React state; no persistence (spec says static).
- All external links (`GitHub`, `Colab`, dataset downloads) use `rel="noopener noreferrer" target="_blank"` and point at placeholder URLs (`#` or `https://github.com/…`).
