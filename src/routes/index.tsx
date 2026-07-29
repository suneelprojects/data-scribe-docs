import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Cpu,
  ExternalLink,
  FileText,
  Github,
  Layers,
  ListChecks,
  Package,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Timer,
  Wand2,
  Workflow,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";
import { InstallChip } from "@/components/InstallChip";
import { CommunityWidget } from "@/components/CommunityWidget";
import { allDocs } from "@/content/reference";
import poster from "@/assets/release-v0-3-0.jpg.asset.json";

const INSTALL_CMD_V030 = "pip install eazydatafix==0.3.0";
const PYPI_URL = "https://pypi.org/project/eazydatafix/0.3.0/";
const GH_RELEASE_URL = "https://github.com/suneelprojects/eazydatafix/releases/tag/v0.3.0";
const GH_REPO_URL = "https://github.com/suneelprojects/eazydatafix";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EazyDataFix | Deterministic Agentic EDA for Python" },
      {
        name: "description",
        content:
          "EazyDataFix is a deterministic-first Python framework for data quality, exploratory data analysis, traceable execution, automated reporting, validation, and safe data preparation.",
      },
      { property: "og:title", content: "EazyDataFix | Deterministic Agentic EDA for Python" },
      {
        property: "og:description",
        content:
          "Agentic EDA you can inspect, reproduce, and trust. Understand your dataset, plan the right analyses, execute them deterministically, and generate traceable reports — without requiring an LLM.",
      },
    ],
  }),
  component: Home,
});

const supported = ["CSV", "Excel", "JSON", "Parquet", "pandas.DataFrame"];
const comingSoon = ["SQL", "Spark", "Polars"];

const workflow = [
  {
    step: "Understand",
    icon: ScanSearch,
    desc: "Run deterministic exploratory data analysis with semantic role detection.",
  },
  {
    step: "Plan",
    icon: ListChecks,
    desc: "Select or skip relevant EDA steps with priorities, dependencies, and clear reasons.",
  },
  {
    step: "Execute",
    icon: Cpu,
    desc: "Run modular deterministic analyses for missing values, duplicates, distributions, outliers, skewness, imbalance, correlations, and datetime trends.",
  },
  {
    step: "Decide",
    icon: Wand2,
    desc: "Generate traceable priority findings, follow-up actions, visualisation recommendations, and unresolved domain questions.",
  },
  {
    step: "Report",
    icon: FileText,
    desc: "Export standalone HTML, stable JSON, optional Markdown, and deterministic PNG visualisations.",
  },
];

const v030Features = [
  { title: "Deterministic EDA", body: "Structured analysis without hidden model behaviour.", icon: BadgeCheck },
  { title: "Semantic Role Detection", body: "Classifies numeric measures, categorical fields, identifiers, datetimes, and booleans.", icon: Layers },
  { title: "Deterministic Planner", body: "Explains which analyses should run and why.", icon: ListChecks },
  { title: "Modular Executor", body: "Runs selected analysis steps with isolated failure handling.", icon: Cpu },
  { title: "Agentic Orchestrator", body: "Coordinates understanding, planning, execution, and follow-up decisions.", icon: Workflow },
  { title: "Traceable Recommendations", body: "Every finding includes its source step, priority, target columns, reason, and prerequisites.", icon: CheckCircle2 },
  { title: "Professional Reports", body: "Exports HTML, JSON, Markdown, and PNG visualisations.", icon: FileText },
  { title: "No LLM Required", body: "The complete workflow remains reproducible and deterministic.", icon: ShieldCheck },
  { title: "Non-Mutation Guarantee", body: "Caller-owned pandas DataFrames are copied and preserved.", icon: ShieldCheck },
  { title: "Python 3.10–3.13", body: "Fully validated across supported Python versions.", icon: Timer },
];

const AGENTIC_CODE = `import eazydatafix as edf

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

function InstallV030Button() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD_V030);
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
      title={INSTALL_CMD_V030}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Install v0.3.0"}
    </button>
  );
}

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:py-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              v0.3.0
              <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-sans font-medium text-accent">
                latest
              </span>
              <span className="font-sans">· Latest Stable Release</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Agentic EDA you can inspect, reproduce, and trust.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Understand your dataset, plan the right analyses, execute them deterministically,
              and generate traceable reports — without requiring an LLM.
            </p>
            <p className="mt-3 max-w-xl text-xs text-muted-foreground/80">
              EazyDataFix v0.3.0 is released. Supports Console, HTML, PDF, Excel, CSV, JSON and Markdown reports.
            </p>

            <div className="mt-6">
              <InstallChip />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                to="/docs"
                className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/releases/v0-3-0"
                className="inline-flex items-center gap-1.5 rounded-md border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/15"
              >
                <Sparkles className="h-3.5 w-3.5" />
                What's new in 0.3.0
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

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {["MIT License", "Python 3.10–3.13", "Zero configuration", "Pandas-based"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <CodeBlock
            code={`import eazydatafix as edf\n\n# NEW in 0.3.0 — deterministic Agentic EDA\nworkflow = edf.run_agentic_eda("employees.csv")\n\nreport = edf.export_agentic_eda_report(\n    workflow,\n    dataset="employees.csv",\n    output_dir="eda-report",\n)`}
            filename="main.py"
            showLineNumbers
          />
        </div>
      </section>

      {/* Release announcement */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 rounded-xl border border-border bg-card p-5 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                Now Live
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                EazyDataFix 0.3.0
              </h2>
              <p className="mt-1 text-sm font-medium text-accent">
                Deterministic Agentic EDA for Python
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Analyse datasets, create deterministic execution plans, run reproducible EDA
                workflows, generate traceable follow-up recommendations, and export HTML, JSON,
                Markdown, and PNG reports.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <InstallV030Button />
                <a
                  href={GH_RELEASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Github className="h-3.5 w-3.5" />
                  View Release
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href={PYPI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  View on PyPI
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="mt-4 font-mono text-[11px] text-muted-foreground">
                {INSTALL_CMD_V030}
              </div>
            </div>

            <Link
              to="/releases/v0-3-0"
              className="group relative block overflow-hidden rounded-lg border border-border bg-background"
            >
              <img
                src={poster.url}
                alt="EazyDataFix 0.3.0 deterministic Agentic EDA release poster"
                width={1536}
                height={1024}
                loading="lazy"
                className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
                <span>Release poster · v0.3.0</span>
                <span className="inline-flex items-center gap-1 text-accent">
                  Read notes <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* What's new in v0.3.0 — pipeline */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                What's new in v0.3.0
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A deterministic five-stage workflow — no LLM required.
              </p>
            </div>
            <Link
              to="/releases/v0-3-0"
              className="hidden text-sm font-medium text-accent hover:underline sm:inline"
            >
              Read the release notes →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {workflow.map((w, i) => {
              const Icon = w.icon;
              return (
                <div
                  key={w.step}
                  className="relative rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <div className="mt-3 text-base font-semibold text-foreground">{w.step}</div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{w.desc}</p>
                  {i < workflow.length - 1 && (
                    <ChevronRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground/40 lg:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agentic EDA code example */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Run the full workflow
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            One call runs understanding, planning, execution and decision-making. Another exports
            a complete report.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <CodeBlock code={AGENTIC_CODE} filename="agentic_eda.py" showLineNumbers />
            <CodeBlock
              code={OUTPUT_TREE}
              language="text"
              filename="eda-report/"
              showActions={false}
            />
          </div>
        </div>
      </section>

      {/* v0.3.0 feature highlights */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            v0.3.0 highlights
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything shipped in the Deterministic Agentic EDA release.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {v030Features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  <div className="mt-3 text-sm font-medium text-foreground">{f.title}</div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core APIs (highlight) */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Core APIs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The functions that cover the full profile → assess → fix → EDA → ship workflow.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              { icon: "📊", name: "profile()", desc: "Understand your dataset structure.", href: "/docs/reference/profile" },
              { icon: "✅", name: "assess()", desc: "Measure data quality.", href: "/docs/reference/assess" },
              { icon: "🧹", name: "fix()", desc: "Automatically clean datasets.", href: "/docs/reference/fix" },
              { icon: "🧭", name: "run_agentic_eda()", desc: "End-to-end deterministic EDA.", href: "/releases/v0-3-0#orchestrator", badge: "0.3" },
              { icon: "📤", name: "export_agentic_eda_report()", desc: "HTML, JSON, Markdown, PNG.", href: "/releases/v0-3-0#report-export", badge: "0.3" },
            ].map((c) => (
              <a
                key={c.name}
                href={c.href}
                className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg leading-none">{c.icon}</div>
                  {c.badge && (
                    <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                      {c.badge}
                    </span>
                  )}
                </div>
                <div className="mt-3 font-mono text-sm">
                  <span className="text-muted-foreground">edf.</span>
                  <span className="text-accent">{c.name.replace("()", "")}</span>
                  <span className="text-muted-foreground">()</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Why EazyDataFix?
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Data scientists spend a significant share of every project cleaning and exploring
              data before any analysis can begin. The work is repetitive — check for nulls, drop
              duplicates, coerce dtypes, plot a distribution — but different enough on every
              dataset that ad-hoc scripts pile up.
            </p>
            <p>
              EazyDataFix collapses this loop into explicit calls:{" "}
              <code className="font-mono text-foreground">edf.profile()</code>,{" "}
              <code className="font-mono text-foreground">edf.assess()</code>,{" "}
              <code className="font-mono text-foreground">edf.fix()</code> and, new in 0.3.0,{" "}
              <code className="font-mono text-foreground">edf.run_agentic_eda()</code>. Each
              returns a structured, serialisable object so the entire pipeline stays auditable —
              even in notebooks.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Installation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Requires Python 3.10+. Available on PyPI.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <CodeBlock
              code="pip install eazydatafix"
              language="bash"
              filename="latest"
              showActions={false}
            />
            <CodeBlock
              code={INSTALL_CMD_V030}
              language="bash"
              filename="pinned"
              showActions={false}
            />
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Quick Start</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Assess a dataset, run the automatic fixer, and export the cleaned copy.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <CodeBlock
              code={`import pandas as pd\nimport eazydatafix as edf\n\ndf = pd.read_csv("employees.csv")\n\nreport = edf.assess(df)\nreport.summary()\n\nresult = edf.fix(df)\ncleaned_df = result.dataframe\nresult.to_csv("clean.csv")`}
              filename="quickstart.py"
            />
            <ReplBlock
              lines={[
                { kind: "in", text: "report = edf.assess(df)" },
                { kind: "in", text: "report.summary()" },
                { kind: "out", text: "QualityReport(<DataFrame>)" },
                { kind: "out", text: "  rows              1,204" },
                { kind: "out", text: "  columns              12" },
                { kind: "out", text: "  quality_score     94.0" },
                { kind: "out", text: "  missing_values      38  (0.3%)" },
                { kind: "out", text: "  duplicates           6  (0.5%)" },
                { kind: "blank" },
                { kind: "in", text: "result = edf.fix(df)" },
                { kind: "in", text: 'result.to_csv("clean.csv")' },
                { kind: "out", text: "wrote clean.csv (1,198 rows × 12 cols)" },
              ]}
              title="Expected output"
            />
          </div>
        </div>
      </section>

      {/* Core APIs — full reference cards */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Function reference
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Every function ships with a NumPy/Pydantic-style contract.
              </p>
            </div>
            <Link
              to="/docs/reference"
              className="text-sm font-medium text-accent hover:underline"
            >
              Full reference →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {allDocs.map((d) => (
              <Link
                key={d.slug}
                to={"/docs/reference/$fn" as const}
                params={{ fn: d.slug }}
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
              >
                <div className="font-mono text-sm">
                  <span className="text-muted-foreground">edf.</span>
                  <span className="text-accent">{d.name}</span>
                  <span className="text-muted-foreground">()</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{d.oneLiner}</p>
                <div className="mt-4 rounded border border-border bg-muted/40 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                  <span className="text-foreground">returns</span>{" "}
                  <span className="text-accent">{d.returns.type}</span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-accent">
                  Read reference <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Supported sources */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Supported data sources
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Supported
              </div>
              <div className="flex flex-wrap gap-2">
                {supported.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Coming soon
              </div>
              <div className="flex flex-wrap gap-2">
                {comingSoon.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Roadmap</h2>
            <Link to="/roadmap" className="text-sm font-medium text-accent hover:underline">
              Full roadmap →
            </Link>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              { v: "v0.3", desc: "Deterministic Agentic EDA · shipped" },
              { v: "v0.4", desc: "JSON · Parquet · SQLite readers" },
              { v: "v1.0", desc: "Enterprise connectors · Spark · REST API" },
            ].map((r) => (
              <li key={r.v} className="flex items-center gap-4">
                <span className="w-16 font-mono text-muted-foreground">{r.v}</span>
                <span className="text-foreground">{r.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Community */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Community</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            All values are placeholders and will update once metrics are wired up.
          </p>
          <div className="mt-6">
            <CommunityWidget />
          </div>
        </div>
      </section>
    </div>
  );
}
