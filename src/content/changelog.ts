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
    version: "v0.3.0",
    date: "2026",
    status: "released",
    title: "Deterministic Agentic EDA",
    added: [
      "edf.eda() — deterministic exploratory data analysis",
      "edf.plan_eda() — reproducible follow-up analysis planner",
      "edf.execute_eda() — modular executor with isolated failure handling",
      "edf.run_agentic_eda() — end-to-end deterministic Agentic EDA workflow",
      "edf.export_agentic_eda_report() — HTML, JSON, Markdown and PNG exports",
      "Semantic role detection for numeric measures, categorical fields, identifiers, datetimes and booleans",
      "Traceable priority findings with source step, target columns, reason and prerequisites",
      "Visualisation recommendations and unresolved domain questions",
      "Shared dataset validation and DataFrame non-mutation guarantee",
      "Python 3.10–3.13 support",
    ],
  },
  {
    version: "v0.2.1",
    date: "Released",
    status: "released",
    title: "Reports and polish",
    added: [
      "PDF, Excel, CSV and Markdown report exports",
      "Console-friendly summary printer",
    ],
    fixed: [
      "assess() no longer crashes on empty CSV files",
      "fix() correctly preserves timezone-aware datetimes",
      "profile() handles all-null columns without raising",
    ],
  },
  {
    version: "v0.1.0",
    date: "Released",
    status: "released",
    title: "Initial release",
    added: [
      "edf.assess() — dataset quality report",
      "edf.fix() — opinionated auto-cleaning pipeline",
      "edf.profile() — column-level profiling",
      "CSV, Excel and pandas.DataFrame inputs",
      "HTML/JSON export for reports",
    ],
  },
];
