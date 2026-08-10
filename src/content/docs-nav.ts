export type NavItem = { title: string; url: string; badge?: string };
export type NavGroup = { label: string; items: NavItem[] };

export const docsNav: NavGroup[] = [
  {
    label: "Getting Started",
    items: [
      { title: "Introduction", url: "/docs" },
      { title: "Installation", url: "/docs/installation" },
      { title: "Quick Start", url: "/docs/quickstart" },
    ],
  },
  {
    label: "Guides",
    items: [
      { title: "Assessment", url: "/docs/assessment" },
      { title: "Fixing", url: "/docs/fixing" },
      { title: "Profiling", url: "/docs/profiling" },
      { title: "Reports", url: "/docs/reports" },
      { title: "Examples", url: "/docs/examples" },
    ],
  },
  {
    label: "Production v1",
    items: [
      { title: "Unified run() Workflow", url: "/releases/v1-0-0#unified-workflow", badge: "1.0" },
      { title: "Controlled Cleaning", url: "/releases/v1-0-0#controlled-cleaning", badge: "1.0" },
      { title: "Preparation Reports", url: "/releases/v1-0-0#preparation-reports", badge: "1.0" },
      { title: "Data Contracts", url: "/releases/v1-0-0#data-contracts", badge: "1.0" },
      { title: "Production CLI", url: "/releases/v1-0-0#production-cli", badge: "1.0" },
    ],
  },
  {
    label: "Agentic EDA",
    items: [
      { title: "Deterministic EDA", url: "/releases/v0-3-0#deterministic-eda" },
      { title: "EDA Planner", url: "/releases/v0-3-0#planner" },
      { title: "EDA Executor", url: "/releases/v0-3-0#executor" },
      { title: "Agentic Orchestrator", url: "/releases/v0-3-0#orchestrator" },
      { title: "Report Export", url: "/releases/v0-3-0#report-export" },
    ],
  },
  {
    label: "API Reference",
    items: [
      { title: "Overview", url: "/docs/reference" },
      { title: "assess()", url: "/docs/reference/assess" },
      { title: "fix()", url: "/docs/reference/fix" },
      { title: "profile()", url: "/docs/reference/profile" },
    ],
  },
  {
    label: "Meta",
    items: [
      { title: "v1.0.0 Release Notes", url: "/releases/v1-0-0", badge: "Latest" },
      { title: "Roadmap", url: "/roadmap" },
      { title: "Changelog", url: "/changelog" },
      { title: "Benchmarks", url: "/benchmarks", badge: "Preview" },
      { title: "Ecosystem", url: "/ecosystem" },
      { title: "Contributing", url: "/contributing" },
    ],
  },
];

export const versions = [
  { label: "v1.0.0", value: "1.0.0", status: "latest" as const },
  { label: "v0.5.0", value: "0.5.0", status: "previous" as const },
  { label: "v0.4.0", value: "0.4.0", status: "previous" as const },
  { label: "v0.3.0", value: "0.3.0", status: "previous" as const },
];
