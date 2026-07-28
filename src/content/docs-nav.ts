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
    label: "Agentic EDA",
    items: [
      { title: "Deterministic EDA", url: "/releases/v0-3-0#deterministic-eda", badge: "0.3" },
      { title: "EDA Planner", url: "/releases/v0-3-0#planner", badge: "0.3" },
      { title: "EDA Executor", url: "/releases/v0-3-0#executor", badge: "0.3" },
      { title: "Agentic Orchestrator", url: "/releases/v0-3-0#orchestrator", badge: "0.3" },
      { title: "Report Export", url: "/releases/v0-3-0#report-export", badge: "0.3" },
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
      { title: "v0.3.0 Release Notes", url: "/releases/v0-3-0", badge: "New" },
      { title: "Roadmap", url: "/roadmap" },
      { title: "Changelog", url: "/changelog" },
      { title: "Benchmarks", url: "/benchmarks", badge: "Preview" },
      { title: "Ecosystem", url: "/ecosystem" },
      { title: "Contributing", url: "/contributing" },
    ],
  },
];

export const versions = [
  { label: "v0.3.0", value: "0.3.0", status: "latest" as const },
  { label: "v0.2.1", value: "0.2.1", status: "previous" as const },
  { label: "v1.0.0", value: "1.0.0", status: "planned" as const },
];
