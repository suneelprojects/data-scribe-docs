import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Copy,
  ExternalLink,
  FileCheck2,
  FileText,
  Github,
  Layers3,
  Package,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Wand2,
  Workflow,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { InstallChip } from "@/components/InstallChip";
import { CommunityWidget } from "@/components/CommunityWidget";

const INSTALL_CMD = "pip install eazydatafix==1.0.0";
const PYPI_URL = "https://pypi.org/project/eazydatafix/1.0.0/";
const GH_RELEASE_URL = "https://github.com/suneelprojects/eazydatafix/releases/tag/v1.0.0";
const GH_REPO_URL = "https://github.com/suneelprojects/eazydatafix";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EazyDataFix 1.0 | Auditable Data Cleaning, EDA and Validation" },
      {
        name: "description",
        content:
          "EazyDataFix 1.0 is a deterministic-first Python framework for auditable cleaning, data preparation, validation contracts, Agentic EDA, reporting and production CLI workflows.",
      },
      {
        property: "og:title",
        content: "EazyDataFix 1.0 | From raw data to validated, analysis-ready datasets",
      },
      {
        property: "og:description",
        content:
          "Profile, assess, clean, prepare, validate and explore datasets through reproducible Python APIs and a production CLI.",
      },
    ],
  }),
  component: Home,
});

const supported = ["CSV", "Excel", "JSON", "Parquet", "pandas.DataFrame"];
const comingSoon = ["SQL", "Spark", "Polars"];

const v1Features = [
  {
    title: "Unified workflow",
    body: "edf.run() composes profiling, assessment, controlled cleaning and deterministic EDA.",
    icon: Workflow,
    anchor: "unified-workflow",
  },
  {
    title: "Auditable cleaning",
    body: "Use dry runs, per-column rules and structured before/after change records.",
    icon: ClipboardCheck,
    anchor: "controlled-cleaning",
  },
  {
    title: "Preparation reports",
    body: "Apply threshold-gated conversions and inspect every preparation change and warning.",
    icon: FileCheck2,
    anchor: "preparation-reports",
  },
  {
    title: "Data contracts",
    body: "Infer schemas and enforce reusable not-null, unique, minimum and maximum rules.",
    icon: ShieldCheck,
    anchor: "data-contracts",
  },
  {
    title: "Production CLI",
    body: "Process one or many files with JSON/YAML config, JSONL logs and stable exit codes.",
    icon: TerminalSquare,
    anchor: "production-cli",
  },
  {
    title: "Stable public API",
    body: "Existing v0.5 workflows remain compatible, backed by formal result objects and errors.",
    icon: BadgeCheck,
    anchor: "compatibility",
  },
];

const lifecycle = [
  { step: "Profile", desc: "Understand columns, types, shape and memory use.", icon: ScanSearch },
  { step: "Assess", desc: "Measure quality and identify actionable issues.", icon: ClipboardCheck },
  { step: "Fix", desc: "Preview or apply controlled cleaning rules.", icon: Wand2 },
  { step: "Validate", desc: "Enforce schema and quality contracts.", icon: ShieldCheck },
  { step: "Explore", desc: "Run deterministic and Agentic EDA.", icon: Layers3 },
];

const UNIFIED_CODE = `import eazydatafix as edf

config = edf.FixConfig(dry_run=True)
result = edf.run("employees.csv", config=config)

print(result.assessment.quality.score)
print(result.fix_result.change_log)
print(result.eda_result.observations)`;

const CONTRACT_CODE = `import eazydatafix as edf

contract = edf.infer_schema("employees.csv")
rules = (
    edf.QualityRule("email_required", "email", "not_null"),
    edf.QualityRule("employee_id_unique", "employee_id", "unique"),
    edf.QualityRule("salary_floor", "salary", "min", 0),
)

validation = edf.validate_contract(
    "employees.csv", contract, rules
)
if not validation.passed:
    raise SystemExit(1)`;

const CLI_CODE = `# Run the complete v1 workflow
edf employees.csv

# Batch processing from a JSON or YAML config
edf --config workflow.yaml \\
  --output results.json \\
  --log-file events.jsonl`;

function InstallV1Button() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard access may be unavailable in some browsers. */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      title={INSTALL_CMD}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Install v1.0.0"}
    </button>
  );
}

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,color-mix(in_oklab,var(--color-accent)_12%,transparent),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[11px] font-mono text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              v1.0.0
              <span className="font-sans text-muted-foreground">· Stable production release</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              From raw data to validated, analysis-ready datasets.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Profile, assess, clean, prepare, validate and explore data through deterministic,
              traceable Python workflows—without requiring an LLM.
            </p>

            <div className="mt-7">
              <InstallChip />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                to="/docs/quickstart"
                className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/releases/v1-0-0"
                className="inline-flex items-center gap-1.5 rounded-md border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/15"
              >
                <Sparkles className="h-3.5 w-3.5" />
                What&apos;s new in 1.0
              </Link>
              <a
                href={GH_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
              <a
                href={PYPI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Package className="h-3.5 w-3.5" />
                PyPI
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {["MIT License", "Python 3.10–3.13", "LLM optional", "DataFrame-safe"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <CodeBlock code={UNIFIED_CODE} filename="production_workflow.py" showLineNumbers />
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                Released 8 August 2026
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                EazyDataFix 1.0.0
              </h2>
              <p className="mt-1 text-sm font-medium text-accent">
                Stable workflows for real data pipelines
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Version 1.0 keeps every v0.5 workflow and adds controlled cleaning, deterministic
                preparation reports, reusable data contracts, a unified Python workflow and a
                pipeline-safe command-line interface.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <InstallV1Button />
                <a
                  href={GH_RELEASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Github className="h-3.5 w-3.5" />
                  View GitHub release
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {v1Features.slice(0, 4).map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.title}
                    to="/releases/v1-0-0"
                    hash={feature.anchor}
                    className="rounded-lg border border-border bg-background p-4 transition-colors hover:border-accent"
                  >
                    <Icon className="h-4 w-4 text-accent" />
                    <div className="mt-2 text-sm font-medium text-foreground">{feature.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {feature.body}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              One library across the data lifecycle
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start with a single API, then use the individual stages when your pipeline needs more
              control.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {lifecycle.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-accent/12 text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-foreground">{item.step}</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Built for inspection, not black boxes
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Every v1 workflow produces explicit results your notebook, application or CI job can
                inspect and act on.
              </p>
            </div>
            <Link to="/releases/v1-0-0" className="text-sm font-medium text-accent hover:underline">
              Read the complete release notes →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {v1Features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to="/releases/v1-0-0"
                  hash={feature.anchor}
                  className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  <div className="mt-3 text-sm font-medium text-foreground">{feature.title}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-accent">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-accent">
                <ShieldCheck className="h-4 w-4" />
                Pipeline contracts
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Turn data expectations into pass/fail checks
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Infer a contract from known-good data, add reusable quality rules, and fail your
                pipeline deterministically when incoming data breaks the agreement.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {[
                  "Expected columns and data types",
                  "Extra-column policy",
                  "Not-null and uniqueness rules",
                  "Numeric minimum and maximum rules",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <CodeBlock code={CONTRACT_CODE} filename="validate_pipeline.py" showLineNumbers />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-accent">
              <TerminalSquare className="h-4 w-4" />
              Production CLI
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              The same deterministic workflows from your terminal
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Run profile, assess, fix, prepare, EDA, Agentic EDA or the complete workflow across
              one or many files. Exit codes distinguish success, processing failures and invalid
              configuration.
            </p>
          </div>
          <CodeBlock code={CLI_CODE} language="bash" filename="terminal" showLineNumbers />
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Core APIs</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use the complete workflow or compose only the stages your project needs.
            </p>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "run",
                desc: "Profile, assess, clean and explore in one call.",
                href: "/releases/v1-0-0#unified-workflow",
                badge: "1.0",
              },
              {
                name: "fix",
                desc: "Controlled cleaning with dry-run previews.",
                href: "/docs/reference/fix",
                badge: "Auditable",
              },
              {
                name: "prepare_with_report",
                desc: "Prepare data with changes and warnings.",
                href: "/releases/v1-0-0#preparation-reports",
                badge: "1.0",
              },
              {
                name: "validate_contract",
                desc: "Enforce schema and quality rules.",
                href: "/releases/v1-0-0#data-contracts",
                badge: "1.0",
              },
              {
                name: "profile",
                desc: "Describe dataset shape, types and structure.",
                href: "/docs/reference/profile",
              },
              {
                name: "assess",
                desc: "Measure quality and surface recommendations.",
                href: "/docs/reference/assess",
              },
              {
                name: "run_agentic_eda",
                desc: "Plan and execute deterministic EDA.",
                href: "/releases/v0-3-0#orchestrator",
              },
              {
                name: "generate_agentic_eda_narrative",
                desc: "Add optional evidence-cited AI narrative.",
                href: "/changelog#v0-5-0",
              },
            ].map((api) => (
              <a
                key={api.name}
                href={api.href}
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-center justify-between gap-3">
                  <Code2 className="h-4 w-4 text-accent" />
                  {api.badge && (
                    <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                      {api.badge}
                    </span>
                  )}
                </div>
                <div className="mt-3 break-words font-mono text-sm text-foreground">
                  <span className="text-muted-foreground">edf.</span>
                  {api.name}()
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{api.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Supported inputs
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {supported.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {source}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                On the horizon
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {comingSoon.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Project snapshot
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Verified facts from the v1.0.0 release—no placeholder counters.
              </p>
            </div>
            <Link to="/analytics" className="text-sm font-medium text-accent hover:underline">
              View package analytics →
            </Link>
          </div>
          <div className="mt-6">
            <CommunityWidget />
          </div>
          <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-accent" />
                Ready to use EazyDataFix 1.0?
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Install from PyPI, follow the quick start, or review the source on GitHub.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
              <InstallV1Button />
              <Link
                to="/docs"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Read the docs <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
