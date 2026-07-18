import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CheckCircle2, Cpu, Github, Sparkles, Timer } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";
import { InstallChip } from "@/components/InstallChip";
import { CommunityWidget } from "@/components/CommunityWidget";
import { allDocs } from "@/content/reference";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EazyDataFix — Open-source data quality & cleaning for Python" },
      {
        name: "description",
        content:
          "Assess, fix and profile datasets with a Pythonic API. CSV, Excel and pandas.DataFrame support out of the box.",
      },
      { property: "og:title", content: "EazyDataFix" },
      {
        property: "og:description",
        content:
          "Assess, fix and profile datasets with a Pythonic API. CSV, Excel and pandas.DataFrame support out of the box.",
      },
    ],
  }),
  component: Home,
});

const supported = ["CSV", "Excel", "pandas.DataFrame"];
const comingSoon = ["JSON", "Parquet", "SQL", "Spark", "Polars"];

const features = [
  { title: "Automatic quality assessment", body: "Missing values, duplicates, dtype consistency and a composite quality score.", icon: BadgeCheck },
  { title: "Missing value detection", body: "Per-column null rates surfaced against configurable thresholds.", icon: CheckCircle2 },
  { title: "Duplicate detection", body: "Exact and fuzzy duplicate detection with row-level diagnostics.", icon: CheckCircle2 },
  { title: "Data profiling", body: "Distribution summaries, cardinality and pairwise correlations.", icon: Cpu },
  { title: "Automated cleaning", body: "Deterministic, opinionated pipeline with dry-run support.", icon: Sparkles },
  { title: "Quality reports", body: "HTML and JSON export for auditable data pipelines.", icon: BadgeCheck },
  { title: "Pythonic API", body: "Three top-level functions. No configuration files. No DSL.", icon: Timer },
  { title: "Open source", body: "MIT licensed. Community-driven roadmap.", icon: Github },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:py-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              v0.1.0 · initial release
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              EazyDataFix
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Open-source Python library for data quality assessment and automated data cleaning.
              Three functions, zero configuration, and a report you can trust.
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
              <a
                href="https://github.com/eazydatafix/eazydatafix"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span>MIT License</span>
              <span>·</span>
              <span>Python 3.9+</span>
              <span>·</span>
              <span>Zero required dependencies beyond pandas</span>
            </div>
          </div>

          <CodeBlock
            code={`import eazydatafix as edf\n\nreport = edf.assess("employees.csv")\nreport.summary()\n\nresult = edf.fix("employees.csv")\nresult.applied_fixes\nresult.to_csv("clean.csv")`}
            filename="main.py"
            showLineNumbers
          />
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
              Data scientists spend a significant share of every project cleaning data before any
              analysis can begin. The work is repetitive — check for nulls, drop duplicates, coerce
              obvious dtypes, run a distribution sanity check — but it is different enough on every
              dataset that ad-hoc scripts pile up.
            </p>
            <p>
              EazyDataFix collapses this loop into three explicit calls:{" "}
              <code className="font-mono text-foreground">edf.assess()</code>,{" "}
              <code className="font-mono text-foreground">edf.fix()</code> and{" "}
              <code className="font-mono text-foreground">edf.profile()</code>. Each returns a
              structured, serialisable object so the entire cleaning pipeline stays auditable —
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
            Requires Python 3.9+. Available on PyPI.
          </p>
          <div className="mt-4">
            <CodeBlock
              code="pip install eazydatafix"
              language="bash"
              filename="terminal"
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

      {/* Core APIs */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Core APIs</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Three functions cover the entire cleaning surface.
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

      {/* Features */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Features</h2>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{f.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{f.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Preview */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Documentation preview
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every function ships with a NumPy/Pydantic-style contract.
          </p>

          <div className="mt-6 rounded-lg border border-border bg-background p-6">
            <div className="mb-2 text-[11px] font-mono text-muted-foreground">
              docs / reference / assess
            </div>
            <h3 className="text-lg font-semibold">
              <code className="font-mono">edf.assess()</code>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Compute a full data-quality assessment for a dataset.
            </p>

            <div className="mt-4 overflow-x-auto rounded-md border border-border">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Parameter</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2 font-mono">data</td>
                    <td className="px-3 py-2 font-mono text-accent">str | DataFrame</td>
                    <td className="px-3 py-2 text-muted-foreground">Source dataset</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-3 py-2 font-mono">thresholds</td>
                    <td className="px-3 py-2 font-mono text-accent">dict | None</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      Override default warning thresholds
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Link
                to="/docs/reference/$fn"
                params={{ fn: "assess" }}
                className="text-sm font-medium text-accent hover:underline"
              >
                Read full reference →
              </Link>
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
              { v: "v0.2", desc: "JSON · Parquet · SQLite" },
              { v: "v0.3", desc: "AI-assisted cleaning · smart recommendations" },
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
