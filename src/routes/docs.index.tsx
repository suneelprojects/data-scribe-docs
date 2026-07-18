import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { docsNav } from "@/content/docs-nav";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: "Documentation — EazyDataFix" },
      {
        name: "description",
        content:
          "Guides, API reference, examples and roadmap for the EazyDataFix Python library.",
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
        description="EazyDataFix is a small, opinionated Python library for data quality assessment and automated cleaning. Start with the guides below or jump into the API reference."
      />

      <div id="doc-content" className="prose-doc">
        <h2 id="installation">Installation</h2>
        <p>
          EazyDataFix is on PyPI and supports Python 3.9+. Install with pip in the environment of
          your choice — a virtualenv is recommended.
        </p>
        <pre className="not-prose overflow-hidden rounded-lg border border-border bg-[color:var(--color-syntax-bg)] p-4 font-mono text-sm text-[color:var(--color-syntax-fg)]">
          <span className="tk-prompt">$</span> pip install eazydatafix
        </pre>

        <h2 id="quick-start">Quick Start</h2>
        <p>
          Run <code>edf.assess()</code> to understand your dataset, then <code>edf.fix()</code> to
          apply the cleaning pipeline. See{" "}
          <Link to="/docs/quickstart">the quick start guide</Link> for a full walkthrough.
        </p>

        <h2 id="core-apis">Core APIs</h2>
        <p>Three public functions cover the entire cleaning surface:</p>
        <ul>
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
        </ul>

        <h2 id="examples">Examples</h2>
        <p>
          The <Link to="/examples">Examples gallery</Link> walks through seven realistic datasets
          — CSV, Excel, HR, healthcare and more.
        </p>

        <h2 id="roadmap">Roadmap</h2>
        <p>
          v0.2 adds JSON, Parquet and SQLite connectors. v0.3 introduces AI-assisted cleaning.
          Read the full <Link to="/roadmap">roadmap</Link>.
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
