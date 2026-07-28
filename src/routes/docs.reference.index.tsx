import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { allDocs } from "@/content/reference";

export const Route = createFileRoute("/docs/reference/")({
  head: () => ({
    meta: [
      { title: "API Reference — EazyDataFix" },
      { name: "description", content: "Every public function in EazyDataFix." },
      { property: "og:title", content: "API Reference — EazyDataFix" },
      { property: "og:description", content: "Every public function in EazyDataFix." },
    ],
  }),
  component: ReferenceIndex,
});

const agenticApis: { name: string; desc: string; hash: string }[] = [
  { name: "edf.eda", desc: "Generate a structured deterministic EDA result.", hash: "deterministic-eda" },
  { name: "edf.plan_eda", desc: "Create a reproducible follow-up analysis plan.", hash: "planner" },
  { name: "edf.execute_eda", desc: "Execute selected EDA steps using deterministic handlers.", hash: "executor" },
  { name: "edf.run_agentic_eda", desc: "Run the complete deterministic Agentic EDA workflow.", hash: "orchestrator" },
  { name: "edf.export_agentic_eda_report", desc: "Export HTML, JSON, Markdown and supported PNG visualisations.", hash: "report-export" },
];

const extraApis: { name: string; desc: string }[] = [
  { name: "edf.assess_ai_readiness", desc: "Check whether a dataset is ready for downstream ML workflows." },
  { name: "edf.prepare", desc: "Apply a preparation pipeline before modelling." },
  { name: "edf.analysis_ready", desc: "Prepare datasets for analytics and machine learning." },
];

function ReferenceIndex() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "API Reference" }]}
        title="API Reference"
        description="EazyDataFix exposes a focused public API. Every function documents its parameters, return type, raises, examples and best practices."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="public-api">Public API</h2>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {allDocs.map((d) => (
            <Link
              key={d.slug}
              to="/docs/reference/$fn"
              params={{ fn: d.slug }}
              className="block p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="font-mono text-sm">
                  <span className="text-muted-foreground">edf.</span>
                  <span className="text-accent">{d.name}</span>
                  <span className="text-muted-foreground">()</span>
                </code>
                <span className="font-mono text-[11px] text-muted-foreground">
                  → {d.returns.type}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{d.oneLiner}</div>
            </Link>
          ))}
        </div>

        <h2 id="agentic-eda">Agentic EDA (v0.3.0)</h2>
        <p>
          New in 0.3.0. See the{" "}
          <Link to="/releases/v0-3-0" className="text-accent hover:underline">
            v0.3.0 release notes
          </Link>{" "}
          for full detail on each function.
        </p>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {agenticApis.map((a) => (
            <a
              key={a.name}
              href={`/releases/v0-3-0#${a.hash}`}
              className="block p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="font-mono text-sm">
                  <span className="text-muted-foreground">{a.name.split(".")[0]}.</span>
                  <span className="text-accent">{a.name.split(".")[1]}</span>
                  <span className="text-muted-foreground">(...)</span>
                </code>
                <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                  0.3
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{a.desc}</div>
            </a>
          ))}
        </div>

        <h2 id="additional">Additional utilities</h2>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {extraApis.map((a) => (
            <div key={a.name} className="p-4">
              <code className="font-mono text-sm">
                <span className="text-muted-foreground">{a.name.split(".")[0]}.</span>
                <span className="text-accent">{a.name.split(".")[1]}</span>
                <span className="text-muted-foreground">(...)</span>
              </code>
              <div className="mt-1 text-sm text-muted-foreground">{a.desc}</div>
            </div>
          ))}
        </div>

        <h2 id="conventions">Conventions</h2>
        <p>
          Every function accepts a CSV/Excel path or a <code>pandas.DataFrame</code>. Keyword-only
          options follow the signature and never mutate the input. Return objects are
          serialisable via <code>.to_dict()</code>, <code>.to_json()</code> and (where relevant){" "}
          <code>.to_html()</code>.
        </p>
      </div>
    </div>
  );
}
