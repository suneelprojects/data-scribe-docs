import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { allDocs } from "@/content/reference";

export const Route = createFileRoute("/docs/reference/")({
  head: () => ({
    meta: [
      { title: "API Reference — EazyDataFix 1.0" },
      { name: "description", content: "Stable public Python APIs in EazyDataFix 1.0." },
      { property: "og:title", content: "API Reference — EazyDataFix 1.0" },
      {
        property: "og:description",
        content: "Profile, assess, clean, prepare, validate and explore datasets with stable APIs.",
      },
    ],
  }),
  component: ReferenceIndex,
});

const v1Apis = [
  {
    name: "edf.run",
    desc: "Compose profile, assessment, controlled cleaning and deterministic EDA.",
    hash: "unified-workflow",
    returns: "RunResult",
  },
  {
    name: "edf.prepare_with_report",
    desc: "Prepare a dataset and return deterministic changes and warnings.",
    hash: "preparation-reports",
    returns: "PreparationReport",
  },
  {
    name: "edf.infer_schema",
    desc: "Infer expected columns and data types from a trusted dataset.",
    hash: "data-contracts",
    returns: "DataContract",
  },
  {
    name: "edf.validate_contract",
    desc: "Validate schema and reusable quality rules with pass/fail output.",
    hash: "data-contracts",
    returns: "ContractValidationReport",
  },
];

const agenticApis = [
  {
    name: "edf.eda",
    desc: "Generate a structured deterministic EDA result.",
    hash: "deterministic-eda",
  },
  { name: "edf.plan_eda", desc: "Create a reproducible follow-up analysis plan.", hash: "planner" },
  {
    name: "edf.execute_eda",
    desc: "Execute selected EDA steps using deterministic handlers.",
    hash: "executor",
  },
  {
    name: "edf.run_agentic_eda",
    desc: "Run the complete deterministic Agentic EDA workflow.",
    hash: "orchestrator",
  },
  {
    name: "edf.export_agentic_eda_report",
    desc: "Export HTML, JSON, Markdown and supported PNG visualisations.",
    hash: "report-export",
  },
];

const additionalApis = [
  {
    name: "edf.assess_ai_readiness",
    desc: "Assess whether a dataset is ready for downstream AI or ML use.",
  },
  { name: "edf.prepare", desc: "Return a deterministically prepared DataFrame." },
  {
    name: "edf.analysis_ready",
    desc: "Clean and prepare a dataset for analytics and machine learning.",
  },
  {
    name: "edf.generate_agentic_eda_narrative",
    desc: "Generate an optional evidence-cited narrative from deterministic EDA.",
  },
  {
    name: "edf.export_agentic_eda_notebook",
    desc: "Export a ready-to-run deterministic Jupyter Notebook.",
  },
];

function ReferenceIndex() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "API Reference" }]}
        title="API Reference"
        description="EazyDataFix 1.0 exposes stable result objects for every stage of the data-quality and EDA lifecycle."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="v1-workflows">Production workflows (v1.0)</h2>
        <p>
          These APIs form the stable v1 workflow layer. See the{" "}
          <Link to="/releases/v1-0-0">v1.0.0 release notes</Link> for complete examples.
        </p>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {v1Apis.map((api) => (
            <a
              key={api.name}
              href={`/releases/v1-0-0#${api.hash}`}
              className="block p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <ApiName name={api.name} />
                <span className="font-mono text-[11px] text-muted-foreground">→ {api.returns}</span>
                <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                  1.0
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{api.desc}</div>
            </a>
          ))}
        </div>

        <h2 id="core-api">Core data APIs</h2>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {allDocs.map((doc) => (
            <Link
              key={doc.slug}
              to="/docs/reference/$fn"
              params={{ fn: doc.slug }}
              className="block p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="font-mono text-sm">
                  <span className="text-muted-foreground">edf.</span>
                  <span className="text-accent">{doc.name}</span>
                  <span className="text-muted-foreground">()</span>
                </code>
                <span className="font-mono text-[11px] text-muted-foreground">
                  → {doc.returns.type}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{doc.oneLiner}</div>
            </Link>
          ))}
        </div>

        <h2 id="agentic-eda">Deterministic Agentic EDA</h2>
        <p>
          The Agentic EDA foundation remains fully supported in v1.0. See the historical{" "}
          <Link to="/releases/v0-3-0">v0.3.0 release notes</Link> for the full workflow.
        </p>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {agenticApis.map((api) => (
            <a
              key={api.name}
              href={`/releases/v0-3-0#${api.hash}`}
              className="block p-4 transition-colors hover:bg-muted/40"
            >
              <ApiName name={api.name} />
              <div className="mt-1 text-sm text-muted-foreground">{api.desc}</div>
            </a>
          ))}
        </div>

        <h2 id="additional">Additional stable utilities</h2>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {additionalApis.map((api) => (
            <div key={api.name} className="p-4">
              <ApiName name={api.name} />
              <div className="mt-1 text-sm text-muted-foreground">{api.desc}</div>
            </div>
          ))}
        </div>

        <h2 id="conventions">Conventions</h2>
        <p>
          Public workflows accept a supported dataset path or <code>pandas.DataFrame</code> and do
          not mutate caller-owned DataFrames. Stable result objects keep structured data available
          for notebooks, applications, tests and CI pipelines. Catch <code>EazyDataFixError</code>
          for package-level failures.
        </p>
      </div>
    </div>
  );
}

function ApiName({ name }: { name: string }) {
  const [namespace, fn] = name.split(".");
  return (
    <code className="font-mono text-sm">
      <span className="text-muted-foreground">{namespace}.</span>
      <span className="text-accent">{fn}</span>
      <span className="text-muted-foreground">(...)</span>
    </code>
  );
}
