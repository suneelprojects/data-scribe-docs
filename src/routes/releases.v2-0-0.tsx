import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  FileJson2,
  GitCompareArrows,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

export const Route = createFileRoute("/releases/v2-0-0")({
  head: () => ({
    meta: [
      { title: "EazyDataFix v2.0.0 — Reusable, Reviewable Preparation" },
      {
        name: "description",
        content:
          "EazyDataFix 2.0 adds versioned recipes, explicit types, preview/apply review plans, quarantine evidence and reusable ML and Power BI preparation.",
      },
      { property: "og:title", content: "EazyDataFix v2.0.0" },
      {
        property: "og:description",
        content: "Define preparation once. Review it. Replay it safely on the next file.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eazydatafix.com/releases/v2-0-0" }],
  }),
  component: ReleasePage,
});

const features = [
  {
    icon: FileJson2,
    title: "Versioned recipes",
    text: "Save strict JSON or YAML rules for explicit strings, numbers, dates, booleans, categories, mappings and fill values.",
  },
  {
    icon: GitCompareArrows,
    title: "Review before apply",
    text: "Preview selected stages, inspect evidence and apply only when the source, recipe and proposed output still match.",
  },
  {
    icon: ShieldCheck,
    title: "Bounded failure policies",
    text: "Preserve, reject or quarantine invalid conversions with source values and row positions recorded as evidence.",
  },
  {
    icon: Workflow,
    title: "One pipeline interface",
    text: "Reuse the same recipe model across Analysis Ready, leakage-safe ML Ready and multi-table Power BI Ready workflows.",
  },
];

const pipelineCode = [
  "import eazydatafix as edf",
  "",
  "recipe = edf.PipelineRecipe(",
  '    name="monthly_sales",',
  "    columns={",
  '        "customer_id": edf.ColumnRule(dtype="string"),',
  '        "amount": edf.ColumnRule(dtype="number", currency_symbols=("₹",)),',
  '        "order_date": edf.ColumnRule(dtype="datetime", date_format="%d/%m/%Y"),',
  "    },",
  ")",
  "",
  "pipeline = edf.Pipeline(recipe)",
  'plan = pipeline.preview("sales.csv")',
  'result = pipeline.apply("sales.csv", plan)',
  "",
  "if result.is_ready:",
  '    result.save("sales_output")',
].join("\n");

function ReleasePage() {
  return (
    <div>
      <section className="border-b border-border bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 font-mono text-xs text-cyan-200">
            Released 19 October 2026
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            EazyDataFix v2.0.0
            <span className="mt-2 block text-cyan-300">Reusable, reviewable preparation.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Define explicit rules once, preview the transformation, approve the evidence and replay
            the same recipe on future datasets—without changing the familiar v1 convenience APIs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/docs/recipes"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-slate-950"
            >
              Start with recipes <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/suneelprojects/eazydatafix/releases/tag/v2.0.0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-lg border border-white/15 bg-white/[0.04] px-5 text-sm font-medium text-white"
            >
              GitHub release
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-18">
          <CodeBlock
            code="pip install --upgrade eazydatafix==2.0.0"
            language="bash"
            filename="terminal"
            showActions={false}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <Icon className="h-5 w-5 text-accent" />
                  <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/25">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-18">
          <h2 className="text-3xl font-semibold tracking-tight">A reviewed pipeline in Python</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
            Recipes are portable; review plans are deliberately process-local and bound to the exact
            source, recipe, selected operations and previewed output.
          </p>
          <div className="mt-7">
            <CodeBlock code={pipelineCode} filename="v2_pipeline.py" showLineNumbers />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-18">
          <h2 className="text-3xl font-semibold tracking-tight">Compatibility and boundaries</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Existing fix(), analysis_ready(), ml_ready(), powerbi_ready(), EDA and reporting APIs remain supported.",
              "CSV and Excel loading protects textual identifiers before explicit type conversion.",
              "Exports require a ready, applied and unchanged result; failed previews remain inspectable.",
              "Streaming, SQL connectors, persistent cross-process approvals and browser Studio execution are not included yet.",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-6"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link to="/docs/recipes" className="font-semibold text-accent">
              Complete recipe guide →
            </Link>
            <Link
              to="/changelog"
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              Full changelog →
            </Link>
            <Link
              to="/docs/reference"
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              API reference →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
