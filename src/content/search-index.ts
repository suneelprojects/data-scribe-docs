export type SearchEntry = {
  title: string;
  section: "Getting Started" | "Guides" | "Reference" | "Meta";
  url: string;
  description: string;
  keywords?: string[];
};

export const searchIndex: SearchEntry[] = [
  {
    title: "Introduction",
    section: "Getting Started",
    url: "/docs",
    description: "Overview of EazyDataFix 1.0",
  },
  {
    title: "Installation",
    section: "Getting Started",
    url: "/docs/installation",
    description: "Install v1.0.0 with pip",
    keywords: ["pip", "install", "setup", "1.0"],
  },
  {
    title: "Quick Start",
    section: "Getting Started",
    url: "/docs/quickstart",
    description: "Run a complete data workflow",
  },

  {
    title: "Assessment",
    section: "Guides",
    url: "/docs/assessment",
    description: "Understand dataset quality",
  },
  {
    title: "Fixing",
    section: "Guides",
    url: "/docs/fixing",
    description: "Controlled automated cleaning",
    keywords: ["clean", "dry run", "rules"],
  },
  {
    title: "Profiling",
    section: "Guides",
    url: "/docs/profiling",
    description: "Dataset structure and column statistics",
  },
  {
    title: "Reports",
    section: "Guides",
    url: "/docs/reports",
    description: "Generate quality and EDA reports",
  },
  { title: "Examples", section: "Guides", url: "/docs/examples", description: "Common workflows" },

  {
    title: "API Reference",
    section: "Reference",
    url: "/docs/reference",
    description: "Stable public Python API",
  },
  {
    title: "run()",
    section: "Reference",
    url: "/releases/v1-0-0#unified-workflow",
    description: "Profile, assess, clean and explore in one call",
    keywords: ["workflow", "1.0"],
  },
  {
    title: "prepare_with_report()",
    section: "Reference",
    url: "/releases/v1-0-0#preparation-reports",
    description: "Prepare data with deterministic diagnostics",
    keywords: ["prepare", "feature readiness", "1.0"],
  },
  {
    title: "infer_schema()",
    section: "Reference",
    url: "/releases/v1-0-0#data-contracts",
    description: "Infer a pipeline data contract",
    keywords: ["schema", "contract", "1.0"],
  },
  {
    title: "validate_contract()",
    section: "Reference",
    url: "/releases/v1-0-0#data-contracts",
    description: "Validate schema and quality rules",
    keywords: ["validation", "contract", "pass fail", "1.0"],
  },
  {
    title: "Production CLI",
    section: "Reference",
    url: "/releases/v1-0-0#production-cli",
    description: "Batch workflows, logs and exit codes",
    keywords: ["edf", "terminal", "yaml", "json"],
  },
  {
    title: "assess()",
    section: "Reference",
    url: "/docs/reference/assess",
    description: "Assess dataset quality",
    keywords: ["quality", "score"],
  },
  {
    title: "fix()",
    section: "Reference",
    url: "/docs/reference/fix",
    description: "Automatically clean a dataset",
    keywords: ["clean", "repair", "dry run"],
  },
  {
    title: "profile()",
    section: "Reference",
    url: "/docs/reference/profile",
    description: "Generate a dataset profile",
    keywords: ["stats", "structure"],
  },
  {
    title: "run_agentic_eda()",
    section: "Reference",
    url: "/releases/v0-3-0#orchestrator",
    description: "Run the deterministic Agentic EDA workflow",
    keywords: ["agentic", "eda"],
  },
  {
    title: "Grounded AI Narrative",
    section: "Reference",
    url: "/changelog#v0-5-0",
    description: "Optional evidence-cited narrative layer",
    keywords: ["AI", "narrative", "citations", "0.5"],
  },

  {
    title: "v1.0.0 Release Notes",
    section: "Meta",
    url: "/releases/v1-0-0",
    description: "Stable production API release",
    keywords: ["release", "1.0", "stable"],
  },
  {
    title: "v0.3.0 Release Notes",
    section: "Meta",
    url: "/releases/v0-3-0",
    description: "Deterministic Agentic EDA release",
    keywords: ["release", "0.3", "agentic"],
  },
  {
    title: "Roadmap",
    section: "Meta",
    url: "/roadmap",
    description: "Released milestones and next direction",
  },
  {
    title: "Changelog",
    section: "Meta",
    url: "/changelog",
    description: "Every EazyDataFix release",
  },
  {
    title: "Benchmarks",
    section: "Meta",
    url: "/benchmarks",
    description: "Performance comparisons",
  },
  {
    title: "Ecosystem",
    section: "Meta",
    url: "/ecosystem",
    description: "The wider EazyDataFix project",
  },
  {
    title: "Contributing",
    section: "Meta",
    url: "/contributing",
    description: "How to contribute",
  },
  {
    title: "Examples Gallery",
    section: "Meta",
    url: "/examples",
    description: "Real-world worked examples",
  },
];

export function searchDocs(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return searchIndex.slice(0, 8);
  const scored = searchIndex
    .map((entry) => {
      const haystack =
        `${entry.title} ${entry.description} ${(entry.keywords ?? []).join(" ")}`.toLowerCase();
      let score = 0;
      if (entry.title.toLowerCase().startsWith(q)) score += 10;
      if (entry.title.toLowerCase().includes(q)) score += 5;
      if (haystack.includes(q)) score += 1;
      return { entry, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((result) => result.entry).slice(0, 12);
}
