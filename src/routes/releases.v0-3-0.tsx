import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Copy, Check, ExternalLink, Github, Package, Sparkles } from "lucide-react";
import { useState } from "react";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";
import poster from "@/assets/release-v0-3-0.jpg.asset.json";

const INSTALL_CMD = "pip install eazydatafix==0.3.0";
const PYPI_URL = "https://pypi.org/project/eazydatafix/0.3.0/";
const GH_RELEASE_URL = "https://github.com/suneelprojects/eazydatafix/releases/tag/v0.3.0";
const GH_REPO_URL = "https://github.com/suneelprojects/eazydatafix";

export const Route = createFileRoute("/releases/v0-3-0")({
  head: () => ({
    meta: [
      { title: "EazyDataFix 0.3.0 Release Notes — Deterministic Agentic EDA" },
      {
        name: "description",
        content:
          "EazyDataFix 0.3.0 introduces a complete deterministic Agentic EDA workflow with semantic role detection, planning, execution and HTML/JSON/Markdown/PNG report exports.",
      },
      { property: "og:title", content: "EazyDataFix 0.3.0 — Deterministic Agentic EDA for Python" },
      {
        property: "og:description",
        content:
          "Deterministic Agentic EDA for Python: understand, plan, execute, decide and report — reproducibly and without an LLM.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: ReleaseNotes,
});

const apis = [
  { name: "edf.eda(...)", desc: "Generate a structured deterministic EDA result." },
  { name: "edf.plan_eda(...)", desc: "Create a reproducible follow-up analysis plan." },
  { name: "edf.execute_eda(...)", desc: "Execute selected EDA steps using deterministic handlers." },
  { name: "edf.run_agentic_eda(...)", desc: "Run the complete deterministic Agentic EDA workflow." },
  { name: "edf.export_agentic_eda_report(...)", desc: "Export HTML, JSON, Markdown, and supported PNG visualisations." },
];

const highlights = [
  "deterministic exploratory data analysis",
  "semantic column-role detection",
  "deterministic planning and execution",
  "traceable findings and follow-up actions",
  "visualisation recommendations",
  "unresolved domain questions",
  "standalone HTML reports",
  "stable JSON reports",
  "optional Markdown reports",
  "deterministic PNG visualisations",
  "shared dataset validation",
  "DataFrame non-mutation",
  "Python 3.10–3.13 support",
];

const CODE = `import eazydatafix as edf

workflow = edf.run_agentic_eda("employees.csv")

report = edf.export_agentic_eda_report(
    workflow,
    dataset="employees.csv",
    output_dir="eda-report",
)

print(workflow.deterministic_final_summary)
print(report.generated_files)`;

const OUTPUT_TREE = `eda-report/
├── agentic-eda-report.html
├── agentic-eda-report.json
├── agentic-eda-report.md
└── visualisations/
    ├── 01-missing-value-chart-phone-salary.png
    ├── 02-bar-chart-department.png
    └── 03-time-series-line-chart-joining-date.png`;

function InstallButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Install v0.3.0"}
    </button>
  );
}

function ReleaseNotes() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Releases" }, { label: "v0.3.0" }]}
        title="EazyDataFix 0.3.0"
        description="Deterministic Agentic EDA for Python. Understand your dataset, plan the right analyses, execute them reproducibly, generate traceable recommendations, and export professional reports — without requiring an LLM."
        showInstall={false}
      />

      <div className="mb-10 overflow-hidden rounded-lg border border-border bg-card">
        <img
          src={poster.url}
          alt="EazyDataFix 0.3.0 deterministic Agentic EDA release poster"
          width={1536}
          height={1024}
          loading="lazy"
          className="w-full"
        />
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-2">
        <InstallButton />
        <a
          href={GH_RELEASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Github className="h-3.5 w-3.5" />
          View GitHub Release
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
        <a
          href={PYPI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Package className="h-3.5 w-3.5" />
          View on PyPI
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </div>

      <div id="doc-content" className="prose-doc">
        <h2 id="overview">Overview</h2>
        <p>
          EazyDataFix 0.3.0 introduces a complete deterministic Agentic EDA workflow. Every step
          is reproducible, traceable and runs entirely without an LLM.
        </p>

        <h2 id="highlights">Highlights</h2>
        <ul>
          {highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <h2 id="quick-start">Quick start</h2>
        <div className="not-prose">
          <CodeBlock code={CODE} filename="agentic_eda.py" />
        </div>

        <h3 id="output">Generated output</h3>
        <div className="not-prose">
          <CodeBlock code={OUTPUT_TREE} language="text" filename="eda-report/" showActions={false} />
        </div>

        <h2 id="deterministic-eda">Deterministic EDA</h2>
        <p>
          <code>edf.eda(...)</code> runs a deterministic exploratory data analysis with semantic
          role detection — no hidden model behaviour, no random branching.
        </p>

        <h2 id="planner">EDA Planner</h2>
        <p>
          <code>edf.plan_eda(...)</code> selects or skips relevant EDA steps with priorities,
          dependencies and clear reasons.
        </p>

        <h2 id="executor">EDA Executor</h2>
        <p>
          <code>edf.execute_eda(...)</code> runs modular deterministic analyses for missing
          values, duplicates, distributions, outliers, skewness, imbalance, correlations and
          datetime trends. Each step is isolated so a single failure does not halt the pipeline.
        </p>

        <h2 id="orchestrator">Agentic EDA Orchestrator</h2>
        <p>
          <code>edf.run_agentic_eda(...)</code> coordinates understanding, planning, execution and
          follow-up decisions in one call. Every finding includes its source step, priority,
          target columns, reason and prerequisites.
        </p>

        <h2 id="report-export">Report Export</h2>
        <p>
          <code>edf.export_agentic_eda_report(...)</code> writes standalone HTML, stable JSON,
          optional Markdown and deterministic PNG visualisations to a target directory.
        </p>

        <h2 id="public-api">Public API added in 0.3.0</h2>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {apis.map((a) => (
            <div key={a.name} className="p-4">
              <code className="font-mono text-sm text-accent">{a.name}</code>
              <div className="mt-1 text-sm text-muted-foreground">{a.desc}</div>
            </div>
          ))}
        </div>

        <h2 id="compatibility">Compatibility</h2>
        <p>Python 3.10, 3.11, 3.12 and 3.13. Caller-owned pandas DataFrames are copied and preserved.</p>

        <h2 id="links">Links</h2>
        <ul>
          <li>
            <a href={GH_RELEASE_URL} target="_blank" rel="noopener noreferrer">GitHub Release v0.3.0</a>
          </li>
          <li>
            <a href={PYPI_URL} target="_blank" rel="noopener noreferrer">PyPI · eazydatafix 0.3.0</a>
          </li>
          <li>
            <a href={GH_REPO_URL} target="_blank" rel="noopener noreferrer">Source repository</a>
          </li>
          <li>
            <Link to="/changelog">Full changelog</Link>
          </li>
        </ul>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          Ready to try it? Install v0.3.0 and run the workflow in under a minute.
        </div>
        <Link
          to="/docs/quickstart"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          Quick start <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {["MIT License", "Python 3.10–3.13", "Zero configuration", "No LLM required"].map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
