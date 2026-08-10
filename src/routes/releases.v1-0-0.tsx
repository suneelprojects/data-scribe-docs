import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  ExternalLink,
  FileCheck2,
  Github,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageHeader } from "@/components/DocPageHeader";

const INSTALL_CMD = "pip install eazydatafix==1.0.0";
const PYPI_URL = "https://pypi.org/project/eazydatafix/1.0.0/";
const GH_RELEASE_URL = "https://github.com/suneelprojects/eazydatafix/releases/tag/v1.0.0";
const MIGRATION_URL = "https://github.com/suneelprojects/eazydatafix/blob/main/MIGRATION_GUIDE.md";

export const Route = createFileRoute("/releases/v1-0-0")({
  head: () => ({
    meta: [
      { title: "EazyDataFix 1.0.0 Release Notes" },
      {
        name: "description",
        content:
          "EazyDataFix 1.0.0 adds unified workflows, controlled cleaning, preparation reports, data contracts and a production CLI while preserving v0.5 compatibility.",
      },
      { property: "og:title", content: "EazyDataFix 1.0.0 — Stable production workflows" },
      {
        property: "og:description",
        content:
          "Auditable cleaning, feature-readiness reports, pipeline contracts and deterministic CLI workflows for Python.",
      },
    ],
  }),
  component: ReleaseV1,
});

const highlights = [
  {
    title: "Unified workflow",
    body: "Profile, assess, clean and explore a dataset through one stable edf.run() call.",
    icon: Workflow,
  },
  {
    title: "Controlled cleaning",
    body: "Preview proposed fixes and apply typed rules at dataset or column level.",
    icon: ClipboardCheck,
  },
  {
    title: "Preparation reports",
    body: "Inspect transformations, warnings, shapes and data types before and after preparation.",
    icon: FileCheck2,
  },
  {
    title: "Data contracts",
    body: "Infer expected schemas and enforce explicit, reusable quality rules.",
    icon: ShieldCheck,
  },
  {
    title: "Production CLI",
    body: "Run batch workflows with configuration files, structured logs and deterministic exit codes.",
    icon: TerminalSquare,
  },
  {
    title: "Stable compatibility",
    body: "Every public v0.5 workflow remains available in v1.0.0.",
    icon: BadgeCheck,
  },
];

function InstallButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard access may be unavailable. */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Install v1.0.0"}
    </button>
  );
}

function ReleaseV1() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Releases" }, { label: "v1.0.0" }]}
        title="EazyDataFix 1.0.0"
        description="The stable production release: controlled cleaning, preparation reports, data contracts, unified Python workflows and a pipeline-safe CLI."
      />

      <div className="mb-10 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
          Released 8 August 2026
        </span>
        <span className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-xs text-muted-foreground">
          Python 3.10–3.13
        </span>
        <span className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-xs text-muted-foreground">
          MIT
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((highlight) => {
          const Icon = highlight.icon;
          return (
            <div key={highlight.title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="h-4 w-4 text-accent" />
              <h2 className="mt-3 text-sm font-semibold text-foreground">{highlight.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {highlight.body}
              </p>
            </div>
          );
        })}
      </div>

      <div id="doc-content" className="prose-doc mt-12">
        <h2 id="unified-workflow">One stable workflow</h2>
        <p>
          <code>edf.run()</code> composes the four stages most data projects repeat: profiling,
          quality assessment, controlled cleaning and deterministic EDA. The returned
          <code> RunResult</code> keeps each stage separate, so applications can inspect exactly
          what happened.
        </p>
        <CodeBlock
          code={`import eazydatafix as edf

result = edf.run("employees.csv")

print(result.profile)
print(result.assessment.quality.score)
print(result.fix_result.applied_fixes)
print(result.eda_result.observations)`}
          filename="unified_workflow.py"
          showLineNumbers
        />

        <h2 id="controlled-cleaning">Controlled, auditable cleaning</h2>
        <p>
          Cleaning is no longer an all-or-nothing operation. A dry run keeps the source dataset
          unchanged, exposes the proposed dataset separately and records structured before/after
          changes. Column rules override the dataset-wide strategy only where needed.
        </p>
        <CodeBlock
          code={`import eazydatafix as edf

config = edf.FixConfig(
    dry_run=True,
    column_rules={
        "salary": edf.ColumnCleaningRule(
            missing_value_strategy="mean"
        ),
        "notes": edf.ColumnCleaningRule(
            trim_whitespace=False
        ),
    },
)

preview = edf.fix("employees.csv", config)
print(preview.change_log)
print(preview.proposed_dataset.head())`}
          filename="cleaning_preview.py"
          showLineNumbers
        />

        <h2 id="preparation-reports">Preparation with evidence</h2>
        <p>
          <code>edf.prepare_with_report()</code> returns the prepared DataFrame together with
          applied changes, warnings, before/after shapes and data types. Thresholds control numeric
          and date conversion, while outliers can be left unchanged, capped or dropped.
        </p>
        <CodeBlock
          code={`import eazydatafix as edf

config = edf.PrepareConfig(
    numeric_conversion_threshold=0.95,
    date_parsing_threshold=0.80,
    outlier_action="cap",
    normalize_text=True,
)

report = edf.prepare_with_report("employees.csv", config)
print(report.changes)
print(report.warnings)
prepared_df = report.dataset`}
          filename="prepare_with_report.py"
          showLineNumbers
        />

        <h2 id="data-contracts">Data contracts and quality rules</h2>
        <p>
          Infer a contract from a trusted dataset, then validate future inputs against expected
          fields and types. Add explicit <code>not_null</code>, <code>unique</code>,{" "}
          <code>min</code>
          and <code>max</code> rules for pipeline decisions.
        </p>
        <CodeBlock
          code={`import eazydatafix as edf

contract = edf.infer_schema("baseline.csv")
rules = (
    edf.QualityRule("id_unique", "employee_id", "unique"),
    edf.QualityRule("salary_non_negative", "salary", "min", 0),
)

report = edf.validate_contract("incoming.csv", contract, rules)
print(report.passed)
print(report.to_dict())`}
          filename="data_contract.py"
          showLineNumbers
        />

        <h2 id="production-cli">Production command-line workflows</h2>
        <p>
          The <code>edf</code> command runs profile, assess, fix, prepare, EDA, Agentic EDA or the
          complete workflow. It accepts direct file paths or JSON/YAML configuration, writes JSON
          summaries and JSONL events, and returns exit code 0, 1 or 2 for success, processing
          failure or configuration failure.
        </p>
        <CodeBlock
          code={`edf employees.csv

edf sales.csv customers.csv \\
  --config workflow.yaml \\
  --output batch-results.json \\
  --log-file workflow-events.jsonl`}
          language="bash"
          filename="terminal"
          showLineNumbers
        />

        <h2 id="compatibility">Compatibility and migration</h2>
        <p>
          No migration is required for existing v0.5 calls. Profiling, assessment, cleaning,
          preparation, deterministic and Agentic EDA, reports, approval checkpoints, notebook export
          and grounded narratives remain available. Applications can now catch the stable
          package-level <code>EazyDataFixError</code>; the historical spelling remains available for
          compatibility.
        </p>
        <div className="not-prose rounded-lg border border-accent/30 bg-accent/5 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <div className="text-sm font-semibold text-foreground">Upgrade in place</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Install v1.0.0 and keep current v0.5 workflows. Adopt the new APIs when they add
                value to your pipeline.
              </p>
            </div>
          </div>
        </div>

        <h2 id="install">Install</h2>
        <CodeBlock code={INSTALL_CMD} language="bash" filename="terminal" showActions={false} />
      </div>

      <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
        <InstallButton />
        <a
          href={GH_RELEASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Github className="h-3.5 w-3.5" />
          GitHub release
          <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href={PYPI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          PyPI
          <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href={MIGRATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Migration guide
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <Link
          to="/docs/quickstart"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Quick start
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
