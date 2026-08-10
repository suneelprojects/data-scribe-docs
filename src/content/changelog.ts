export type ChangelogEntry = {
  version: string;
  date: string;
  status: "released" | "planned";
  title: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "v1.0.0",
    date: "8 Aug 2026",
    status: "released",
    title: "Stable Production API",
    added: [
      "edf.run() — unified profile, assessment, controlled cleaning and deterministic EDA workflow",
      "Dry-run cleaning, per-column rules and structured before/after change records",
      "edf.prepare_with_report() — deterministic preparation diagnostics",
      "edf.infer_schema() and edf.validate_contract() — pipeline data contracts",
      "Production edf CLI with JSON/YAML configuration, batch processing, JSONL logs and exit codes",
      "Stable EazyDataFixError hierarchy and 79 documented public exports",
    ],
    changed: [
      "All public v0.5 workflows remain compatible",
      "Python 3.10–3.13 support verified for the stable release",
    ],
  },
  {
    version: "v0.9.0",
    date: "2026",
    status: "released",
    title: "Production CLI",
    added: [
      "edf command-line entry point",
      "JSON and optional YAML workflow configuration",
      "Multi-file batch processing, JSON summaries and structured JSONL logs",
      "Deterministic exit codes for success, processing failure and configuration failure",
    ],
  },
  {
    version: "v0.8.0",
    date: "2026",
    status: "released",
    title: "Validation and Contracts",
    added: [
      "Schema inference with DataContract",
      "ContractValidationReport with explicit pipeline pass/fail status",
      "Reusable not-null, unique, minimum and maximum quality rules",
    ],
  },
  {
    version: "v0.7.0",
    date: "2026",
    status: "released",
    title: "Preparation and Feature Readiness",
    added: [
      "PrepareConfig controls for numeric/date conversion, duplicates, outliers, text and categories",
      "PreparationReport with changes, warnings, shapes and data types",
      "Threshold-gated conversions and IQR-based outlier capping or dropping",
    ],
  },
  {
    version: "v0.6.0",
    date: "2026",
    status: "released",
    title: "Controlled, Auditable Cleaning",
    added: [
      "Configurable missing-value markers and typed per-column cleaning rules",
      "Dry-run previews with caller DataFrame preservation",
      "Structured CleaningChange audit records",
      "Unified edf.run() workflow foundation",
    ],
  },
  {
    version: "v0.5.0",
    date: "2026",
    status: "released",
    title: "Grounded AI Narratives",
    added: [
      "Optional evidence-cited narratives for completed deterministic Agentic EDA workflows",
      "Provider-neutral narrative interface and optional OpenAI adapter",
      "Citation, numeric, causal-language and workflow-fingerprint guardrails",
    ],
  },
  {
    version: "v0.4.0",
    date: "2026",
    status: "released",
    title: "Notebook Export and Human Approval",
    added: [
      "Ready-to-run deterministic Jupyter Notebook export",
      "Human approval checkpoints between planning and execution",
      "Dataset fingerprint and dependency validation for approved workflows",
    ],
  },
  {
    version: "v0.3.0",
    date: "2026",
    status: "released",
    title: "Deterministic Agentic EDA",
    added: [
      "edf.eda(), edf.plan_eda() and edf.execute_eda()",
      "edf.run_agentic_eda() end-to-end deterministic workflow",
      "Semantic role detection and traceable priority findings",
      "HTML, JSON, Markdown and deterministic PNG report exports",
    ],
  },
  {
    version: "v0.2.1",
    date: "2026",
    status: "released",
    title: "Reports and Polish",
    added: ["PDF, Excel, CSV and Markdown report exports", "Console-friendly summary printer"],
    fixed: [
      "Assessment handling for empty CSV files",
      "Timezone-aware datetime preservation",
      "Profiling for all-null columns",
    ],
  },
  {
    version: "v0.1.0",
    date: "2026",
    status: "released",
    title: "Initial Release",
    added: [
      "edf.assess() — dataset quality report",
      "edf.fix() — opinionated auto-cleaning pipeline",
      "edf.profile() — column-level profiling",
      "CSV, Excel and pandas.DataFrame inputs",
    ],
  },
];
