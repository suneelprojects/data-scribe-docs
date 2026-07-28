export type SearchEntry = {
  title: string;
  section: "Getting Started" | "Guides" | "Reference" | "Meta";
  url: string;
  description: string;
  keywords?: string[];
};

export const searchIndex: SearchEntry[] = [
  { title: "Introduction", section: "Getting Started", url: "/docs", description: "Overview of EazyDataFix" },
  { title: "Installation", section: "Getting Started", url: "/docs/installation", description: "Install with pip", keywords: ["pip", "install", "setup"] },
  { title: "Quick Start", section: "Getting Started", url: "/docs/quickstart", description: "Assess and fix your first dataset" },

  { title: "Assessment", section: "Guides", url: "/docs/assessment", description: "Understand dataset quality" },
  { title: "Fixing", section: "Guides", url: "/docs/fixing", description: "Automated cleaning pipeline" },
  { title: "Profiling", section: "Guides", url: "/docs/profiling", description: "Column-level statistics" },
  { title: "Reports", section: "Guides", url: "/docs/reports", description: "Generate quality reports" },
  { title: "Examples", section: "Guides", url: "/docs/examples", description: "Common workflows" },

  { title: "API Reference", section: "Reference", url: "/docs/reference", description: "All public functions" },
  { title: "assess()", section: "Reference", url: "/docs/reference/assess", description: "Assess dataset quality", keywords: ["quality", "score"] },
  { title: "fix()", section: "Reference", url: "/docs/reference/fix", description: "Automatically clean a dataset", keywords: ["clean", "repair"] },
  { title: "profile()", section: "Reference", url: "/docs/reference/profile", description: "Generate a full column profile", keywords: ["stats"] },
  { title: "eda()", section: "Reference", url: "/releases/v0-3-0#deterministic-eda", description: "Deterministic exploratory data analysis", keywords: ["eda", "0.3"] },
  { title: "plan_eda()", section: "Reference", url: "/releases/v0-3-0#planner", description: "Reproducible follow-up analysis plan", keywords: ["plan", "0.3"] },
  { title: "execute_eda()", section: "Reference", url: "/releases/v0-3-0#executor", description: "Execute selected EDA steps", keywords: ["execute", "0.3"] },
  { title: "run_agentic_eda()", section: "Reference", url: "/releases/v0-3-0#orchestrator", description: "Run the complete Agentic EDA workflow", keywords: ["agentic", "0.3"] },
  { title: "export_agentic_eda_report()", section: "Reference", url: "/releases/v0-3-0#report-export", description: "Export HTML, JSON, Markdown and PNG reports", keywords: ["report", "0.3"] },

  { title: "v0.3.0 Release Notes", section: "Meta", url: "/releases/v0-3-0", description: "Deterministic Agentic EDA release", keywords: ["release", "0.3", "agentic"] },
  { title: "Roadmap", section: "Meta", url: "/roadmap", description: "What's coming next" },
  { title: "Changelog", section: "Meta", url: "/changelog", description: "Release notes" },
  { title: "Benchmarks", section: "Meta", url: "/benchmarks", description: "Performance comparisons" },
  { title: "Ecosystem", section: "Meta", url: "/ecosystem", description: "The wider EazyDataFix project" },
  { title: "Contributing", section: "Meta", url: "/contributing", description: "How to contribute" },
  { title: "Examples Gallery", section: "Meta", url: "/examples", description: "Real-world worked examples" },
];

export function searchDocs(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return searchIndex.slice(0, 8);
  const scored = searchIndex
    .map((e) => {
      const hay = (e.title + " " + e.description + " " + (e.keywords ?? []).join(" ")).toLowerCase();
      let score = 0;
      if (e.title.toLowerCase().startsWith(q)) score += 10;
      if (e.title.toLowerCase().includes(q)) score += 5;
      if (hay.includes(q)) score += 1;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map((s) => s.e).slice(0, 12);
}
