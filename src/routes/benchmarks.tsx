import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Database, Scale } from "lucide-react";
import { DocPageHeader } from "@/components/DocPageHeader";

export const Route = createFileRoute("/benchmarks")({
  head: () => ({
    meta: [
      { title: "Benchmarks — EazyDataFix" },
      {
        name: "description",
        content: "The reproducible benchmark methodology being prepared for EazyDataFix.",
      },
      { property: "og:title", content: "Benchmarks — EazyDataFix" },
      {
        property: "og:description",
        content:
          "Transparent performance measurements will be published with datasets, code and environment details.",
      },
    ],
  }),
  component: Page,
});

const methodology = [
  {
    title: "Representative datasets",
    description:
      "Small, medium and large tabular inputs with mixed numeric, categorical, text and datetime columns.",
    icon: Database,
  },
  {
    title: "Workflow-level timing",
    description:
      "Profile, assess, fix, prepare, validate and EDA measured independently and end to end.",
    icon: Clock3,
  },
  {
    title: "Memory and scaling",
    description:
      "Peak memory, row-count scaling and the effect of optional input formats recorded separately.",
    icon: Scale,
  },
  {
    title: "Reproducible evidence",
    description:
      "Every published number will include code, dataset description, hardware and dependency versions.",
    icon: CheckCircle2,
  },
];

function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Benchmarks" }]}
        title="Benchmarks"
        description="No unverified performance claims. Reproducible measurements will be published only with the evidence needed to repeat them."
      />

      <div className="rounded-lg border border-accent/30 bg-accent/5 p-5">
        <div className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
          Methodology in preparation
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The previous illustrative counters have been removed. Until the benchmark suite and raw
          results are public, this page intentionally shows no speed, memory or competitor figures.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {methodology.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="h-4 w-4 text-accent" />
              <h2 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/20 p-5 text-sm text-muted-foreground">
        Want to contribute a reproducible benchmark? Open a focused proposal in{" "}
        <a
          href="https://github.com/suneelprojects/eazydatafix/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent hover:underline"
        >
          GitHub Issues
        </a>
        .
      </div>
    </div>
  );
}
