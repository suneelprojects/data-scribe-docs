import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";

export const Route = createFileRoute("/benchmarks")({
  head: () => ({
    meta: [
      { title: "Benchmarks — EazyDataFix" },
      { name: "description", content: "Performance benchmarks (placeholder). Numbers ship with v1.0." },
      { property: "og:title", content: "Benchmarks — EazyDataFix" },
      { property: "og:description", content: "Placeholder benchmarks for EazyDataFix." },
    ],
  }),
  component: Page,
});

type Bench = { label: string; ours: number; other?: number; otherLabel?: string; unit: string };

const cards: { title: string; note: string; benches: Bench[] }[] = [
  {
    title: "Execution time",
    note: "assess() on 1M rows × 20 cols",
    benches: [
      { label: "EazyDataFix", ours: 62, unit: "ms", other: 100 },
      { label: "pandas (manual)", ours: 100, unit: "ms", other: 100 },
    ],
  },
  {
    title: "Memory usage",
    note: "Peak RSS during fix()",
    benches: [
      { label: "EazyDataFix", ours: 78, unit: "MB", other: 100 },
      { label: "pandas (manual)", ours: 100, unit: "MB", other: 100 },
    ],
  },
  {
    title: "Dataset size",
    note: "Time scaling across 100k → 10M rows",
    benches: [
      { label: "100k rows", ours: 15, unit: "%", other: 100 },
      { label: "1M rows", ours: 42, unit: "%", other: 100 },
      { label: "10M rows", ours: 90, unit: "%", other: 100 },
    ],
  },
  {
    title: "vs Pandas",
    note: "Wall-clock speedup on the standard suite",
    benches: [
      { label: "assess()", ours: 60, unit: "%", other: 100 },
      { label: "fix()", ours: 55, unit: "%", other: 100 },
      { label: "profile()", ours: 70, unit: "%", other: 100 },
    ],
  },
  {
    title: "vs Polars",
    note: "Same suite, Polars backend",
    benches: [
      { label: "assess()", ours: 95, unit: "%", other: 100 },
      { label: "fix()", ours: 100, unit: "%", other: 100 },
      { label: "profile()", ours: 90, unit: "%", other: 100 },
    ],
  },
];

function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Benchmarks" }]}
        title="Benchmarks"
        description="Placeholder numbers to illustrate the reporting format. Real measurements will land with v1.0."
      />

      <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <span className="mr-2 rounded bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
          placeholder
        </span>
        All values below are illustrative. Do not use for comparison.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.title} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">{c.title}</h3>
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                placeholder
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{c.note}</div>
            <div className="mt-4 space-y-3">
              {c.benches.map((b) => (
                <div key={b.label}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-mono text-foreground">
                      --{" "}
                      <span className="text-muted-foreground">{b.unit}</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent/70"
                      style={{ width: `${Math.min(100, b.ours)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
