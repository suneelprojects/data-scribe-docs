import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { docsNav } from "@/content/docs-nav";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: "Documentation — EazyDataFix" },
      {
        name: "description",
        content: "Guides, API reference, examples and roadmap for the EazyDataFix Python library.",
      },
      { property: "og:title", content: "EazyDataFix Documentation" },
      {
        property: "og:description",
        content: "Everything you need to assess, fix and profile datasets with EazyDataFix.",
      },
    ],
  }),
  component: DocsIndex,
});

function DocsIndex() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs" }]}
        title="Documentation"
        description="EazyDataFix 1.4 is a deterministic-first Python framework for auditable transformation, Analysis Ready, ML Ready and Power BI Ready workflows."
      />

      <div id="doc-content" className="prose-doc">
        <h2 id="installation">Installation</h2>
        <p>
          EazyDataFix is on PyPI and requires Python 3.10 or later (tested with Python 3.10–3.13).
          Install with pip in the environment of your choice — a virtualenv is recommended.
        </p>
        <pre className="not-prose overflow-hidden rounded-lg border border-border bg-[color:var(--color-syntax-bg)] p-4 font-mono text-sm text-[color:var(--color-syntax-fg)]">
          <span className="tk-prompt">$</span> pip install eazydatafix
        </pre>

        <h2 id="quick-start">Quick Start</h2>
        <p>
          Run <code>edf.run()</code> for the complete profile → assess → clean → EDA workflow, or
          use each stage independently when you need more control. See{" "}
          <Link to="/docs/quickstart">the quick start guide</Link> for a full walkthrough.
        </p>

        <h2 id="core-apis">Core APIs</h2>
        <p>
          The stable public API spans data quality, preparation, validation and deterministic
          Agentic EDA:
        </p>
        <ul>
          <li>
            <code>edf.run()</code> — unified profile, assessment, controlled cleaning and EDA.
          </li>
          <li>
            <Link to="/docs/reference/$fn" params={{ fn: "assess" }}>
              <code>edf.assess()</code>
            </Link>{" "}
            — dataset quality report.
          </li>
          <li>
            <Link to="/docs/reference/$fn" params={{ fn: "fix" }}>
              <code>edf.fix()</code>
            </Link>{" "}
            — opinionated auto-cleaning pipeline.
          </li>
          <li>
            <Link to="/docs/reference/$fn" params={{ fn: "profile" }}>
              <code>edf.profile()</code>
            </Link>{" "}
            — column-level profiling.
          </li>
          <li>
            <code>edf.prepare_with_report()</code> — deterministic preparation with changes and
            warnings.
          </li>
          <li>
            <code>edf.analysis_ready_with_report()</code> — analysis-ready data with before/after
            evidence.
          </li>
          <li>
            <code>edf.ml_ready()</code> — leakage-safe train/test inputs and reusable preprocessing.
          </li>
          <li>
            <code>edf.powerbi_ready()</code> — validated single-table or multi-table Power BI
            inputs.
          </li>
          <li>
            <code>edf.infer_schema()</code> and <code>edf.validate_contract()</code> — pipeline data
            contracts.
          </li>
          <li>
            <code>edf.run_agentic_eda()</code> — end-to-end deterministic Agentic EDA.
          </li>
        </ul>

        <h2 id="examples">Examples</h2>
        <p>
          The <Link to="/examples">Examples gallery</Link> walks through seven realistic datasets —
          CSV, Excel, HR, healthcare and more.
        </p>

        <h2 id="roadmap">Roadmap</h2>
        <p>
          v1.4.0 is the current stable release. It focuses the package on Analysis Ready,
          leakage-safe ML Ready and Power BI Ready outcomes while preserving the stable v1 API. Read
          the full <Link to="/roadmap">roadmap</Link>.
        </p>

        <h2 id="browse">Browse all sections</h2>
        <div className="not-prose grid gap-3 sm:grid-cols-2">
          {docsNav.map((group) => (
            <div key={group.label} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
              <ul className="space-y-1 text-sm">
                {group.items.map((it) => (
                  <li key={it.url}>
                    <Link to={it.url} className="text-accent hover:underline">
                      {it.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
