# EazyDataFix Website

This repository powers [eazydatafix.com](https://eazydatafix.com): the customer-facing product website, public Data Studio preview, developer documentation, public blog and private editorial Content Studio for EazyDataFix.

## Product direction

EazyDataFix turns messy CSV and Excel files into transparent, reviewable outputs for:

- Analysis Ready data
- Leakage-safe ML Ready inputs
- Power BI Ready model inputs

The primary customer flow is:

1. Upload a file or load a sample.
2. Select the intended outcome.
3. Inspect detected issues.
4. Approve or reject proposed transformations.
5. Compare the original and cleaned preview.
6. Export the result with readiness evidence.

The public `/studio` route is intentionally an honest browser-local CSV preview. It demonstrates the customer experience without claiming to expose the complete Python engine. The open-source v1.4.0 engine remains available through PyPI and the developer documentation.

## Public routes

- `/` — product-facing homepage
- `/studio` — customer Data Studio preview
- `/pricing` — free preview, open-source engine and assisted pilot scope
- `/blog` — published content generated and reviewed through Content Studio
- `/docs` — Python documentation
- `/examples` — runnable examples
- `/roadmap`, `/changelog`, `/analytics` — project evidence and status

## Private Content Studio

The existing `/admin/content-studio` route remains the secure editorial workspace for:

- Blog draft generation and review
- SEO and quality gates
- Publishing and scheduling
- Instagram post generation and publishing
- Editorial audit history

Authentication identifies the user; `CONTENT_ADMIN_EMAILS` performs server-side authorization. Draft and administrative data must never be exposed through public routes.

See `CONTENT_STUDIO_SETUP.md` for the Supabase, OpenAI, Instagram and automation configuration.

## Product principles

- Deterministic transformations before AI explanations
- No silent modification of important source values
- Preview and approval before export
- Explicit limitations instead of invented capabilities
- No invented customers, testimonials, benchmarks or time-saved claims
- Documentation remains available but is secondary to the customer product flow
- Content Studio remains private and separate from customer Data Studio

## Development

```bash
bun install
bun run dev
```

Production validation:

```bash
bun run lint
bun run build
```

This project is connected to Lovable. Preserve published Git history and keep the connected branch deployable.
