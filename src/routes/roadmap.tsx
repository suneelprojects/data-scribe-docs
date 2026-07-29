import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — EazyDataFix" },
      { name: "description", content: "The public roadmap for EazyDataFix." },
      { property: "og:title", content: "Roadmap — EazyDataFix" },
      { property: "og:description", content: "The public roadmap for EazyDataFix." },
    ],
  }),
  component: Page,
});

const milestones: {
  version: string;
  title: string;
  status: "Shipped" | "Planned" | "Later";
  items: string[];
}[] = [
  {
    version: "v0.1.0",
    title: "Foundations",
    status: "Shipped",
    items: [
      "edf.assess(), edf.fix(), edf.profile()",
      "CSV, Excel, pandas.DataFrame inputs",
      "HTML and JSON reports",
    ],
  },
  {
    version: "v0.2.x",
    title: "Reports and formats",
    status: "Shipped",
    items: ["PDF, Excel, CSV, Markdown reports", "Console-friendly summary"],
  },
  {
    version: "v0.3.0",
    title: "Deterministic Agentic EDA",
    status: "Shipped",
    items: [
      "edf.eda(), edf.plan_eda(), edf.execute_eda()",
      "edf.run_agentic_eda() end-to-end workflow",
      "edf.export_agentic_eda_report() — HTML, JSON, Markdown, PNG",
      "Semantic role detection & traceable findings",
      "Python 3.10–3.13 support",
    ],
  },
  {
    version: "v0.4.0",
    title: "Next",
    status: "Planned",
    items: [
      "Broader dataset connectors and readers",
      "Extended deterministic analyses",
      "Report polish and additional export targets",
    ],
  },
  {
    version: "v0.5.0+",
    title: "Later",
    status: "Later",
    items: [
      "Optional grounded AI explanations layered on top of deterministic findings",
      "Enterprise connectors, Spark backend, cloud storage, REST API",
    ],
  },
];

function statusColor(s: "Shipped" | "Planned" | "Later") {
  if (s === "Shipped") return "bg-accent/15 text-accent";
  if (s === "Planned") return "bg-muted text-foreground";
  return "bg-muted/60 text-muted-foreground";
}

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Roadmap" }]}
        title="Roadmap"
        description="A living plan for EazyDataFix. Dates deliberately absent — releases ship when they are ready."
      />
      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        {milestones.map((m) => (
          <div key={m.version} className="relative mb-10">
            <span className="absolute -left-[22px] top-2 h-3 w-3 rounded-full border-2 border-background bg-accent" />
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-sm font-semibold text-foreground">{m.version}</span>
              <span className="text-lg font-semibold">{m.title}</span>
              <span
                className={
                  "rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider " +
                  statusColor(m.status)
                }
              >
                {m.status}
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {m.items.map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground/60" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
