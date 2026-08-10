import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — EazyDataFix" },
      {
        name: "description",
        content: "The completed path to EazyDataFix 1.0 and the community-driven direction ahead.",
      },
      { property: "og:title", content: "Roadmap — EazyDataFix" },
      {
        property: "og:description",
        content: "From data-quality foundations to the stable EazyDataFix 1.0 production API.",
      },
    ],
  }),
  component: Page,
});

const milestones = [
  {
    version: "v0.1–0.2",
    title: "Data-quality foundations",
    status: "Shipped",
    items: [
      "Profiling, assessment and automatic cleaning",
      "CSV, Excel and pandas.DataFrame inputs",
      "Console, HTML, PDF, Excel, CSV, JSON and Markdown reports",
    ],
  },
  {
    version: "v0.3.0",
    title: "Deterministic Agentic EDA",
    status: "Shipped",
    items: [
      "Semantic dataset understanding and deterministic analysis planning",
      "Modular execution with traceable findings and actions",
      "HTML, JSON, Markdown and PNG EDA artifacts",
    ],
  },
  {
    version: "v0.4.0",
    title: "Notebook export and human approval",
    status: "Shipped",
    items: [
      "Ready-to-run deterministic notebook export",
      "Review checkpoints between planning and execution",
      "Dataset fingerprint and dependency validation",
    ],
  },
  {
    version: "v0.5.0",
    title: "Grounded AI narratives",
    status: "Shipped",
    items: [
      "Optional evidence-cited narratives after deterministic analysis",
      "Provider-neutral adapter layer",
      "Citation and workflow-integrity guardrails",
    ],
  },
  {
    version: "v0.6–0.7",
    title: "Cleaning and preparation controls",
    status: "Shipped",
    items: [
      "Dry-run cleaning, per-column rules and structured change logs",
      "Threshold-gated type and date conversions",
      "Preparation reports with warnings and before/after details",
    ],
  },
  {
    version: "v0.8–0.9",
    title: "Contracts and production workflows",
    status: "Shipped",
    items: [
      "Schema inference and reusable quality rules",
      "Explicit contract pass/fail reports",
      "Batch CLI, JSON/YAML configuration, JSONL logs and stable exit codes",
    ],
  },
  {
    version: "v1.0.0",
    title: "Stable production API",
    status: "Current",
    items: [
      "Unified edf.run() workflow",
      "Stable result/report objects and package-level errors",
      "Compatibility across every v0.5 public workflow",
      "Verified Python 3.10–3.13 release",
    ],
  },
  {
    version: "Next",
    title: "Community-driven evolution",
    status: "Open",
    items: [
      "Priorities will be published from real user feedback and GitHub issues",
      "Documentation, examples and integration quality will continue to improve",
      "Proposals and contributors are welcome before new milestones are committed",
    ],
  },
] as const;

function statusColor(status: (typeof milestones)[number]["status"]) {
  if (status === "Current") return "bg-accent text-accent-foreground";
  if (status === "Shipped") return "bg-accent/15 text-accent";
  return "bg-muted text-muted-foreground";
}

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Roadmap" }]}
        title="Roadmap"
        description="The path to v1.0.0 is complete. Future milestones will be grounded in real usage, issues and contributor feedback."
      />
      <div className="relative pl-6">
        <div className="absolute bottom-2 left-2 top-2 w-px bg-border" />
        {milestones.map((milestone) => (
          <div key={milestone.version} className="relative mb-10">
            <span className="absolute -left-[22px] top-2 h-3 w-3 rounded-full border-2 border-background bg-accent" />
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-sm font-semibold text-foreground">
                {milestone.version}
              </span>
              <span className="text-lg font-semibold">{milestone.title}</span>
              <span
                className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusColor(milestone.status)}`}
              >
                {milestone.status}
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {milestone.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
