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
    version: "v0.2.0",
    date: "Planned",
    status: "planned",
    title: "New data sources",
    added: [
      "JSON reader with schema inference",
      "Parquet reader/writer",
      "SQLite connector via SQLAlchemy",
      "assess() supports --format=json output",
    ],
  },
  {
    version: "v0.1.1",
    date: "Placeholder",
    status: "released",
    title: "Bug fixes and polish",
    fixed: [
      "assess() no longer crashes on empty CSV files",
      "fix() correctly preserves timezone-aware datetimes",
      "profile() handles all-null columns without raising",
    ],
    changed: [
      "Reduced default sample size for correlation calculation.",
      "Report.summary() now prints numbers with thousands separators.",
    ],
  },
  {
    version: "v0.1.0",
    date: "Placeholder",
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
