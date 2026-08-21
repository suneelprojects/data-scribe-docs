import type { ReplLine } from "@/components/ReplBlock";

export type Param = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type FunctionDoc = {
  name: string;
  slug: "assess" | "fix" | "profile";
  signature: string;
  oneLiner: string;
  description: string;
  parameters: Param[];
  returns: { type: string; description: string };
  raises: { name: string; when: string }[];
  examples: { title: string; code: string; repl?: ReplLine[] }[];
  notes: string[];
  bestPractices: string[];
  seeAlso: { name: string; slug: string; description: string }[];
};

export const assessDoc: FunctionDoc = {
  name: "assess",
  slug: "assess",
  signature: "edf.assess(dataset) -> AssessmentReport",
  oneLiner: "Compute a structured data-quality assessment for a dataset.",
  description:
    "Measures completeness, uniqueness and the package's quality dimensions for a supported file or pandas DataFrame. The returned AssessmentReport includes dataset information, recommendations, validations and export helpers for HTML, JSON, Markdown, CSV, Excel and PDF.",
  parameters: [
    {
      name: "dataset",
      type: "str | pathlib.Path | pandas.DataFrame",
      description: "A pandas DataFrame or path to a supported CSV or Excel dataset.",
    },
  ],
  returns: {
    type: "AssessmentReport",
    description:
      "Structured dataset information, completeness and uniqueness metrics, quality scores, recommendations and validations.",
  },
  raises: [
    { name: "FileNotFoundError", when: "the supplied path does not exist." },
    { name: "ValueError", when: "the supplied file type is not supported." },
  ],
  examples: [
    {
      title: "Assess a CSV file",
      code: `import eazydatafix as edf\n\nreport = edf.assess("employees.csv")\n\nprint(report.dataset_info.rows, report.dataset_info.columns)\nprint(report.completeness.total_missing_values)\nprint(report.uniqueness.duplicate_rows)\nprint(report.quality.score, report.quality.grade)`,
      repl: [
        { kind: "in", text: 'report = edf.assess("employees.csv")' },
        { kind: "in", text: "report.dataset_info.rows, report.dataset_info.columns" },
        { kind: "out", text: "(12, 8)" },
        { kind: "in", text: "report.completeness.total_missing_values" },
        { kind: "out", text: "5" },
        { kind: "in", text: "report.quality.score" },
        { kind: "out", text: "82.76" },
      ],
    },
    {
      title: "Export the report",
      code: `report = edf.assess("employees.csv")\nreport.to_html("quality.html")\nreport.to_json("quality.json")`,
    },
  ],
  notes: [
    "assess() never mutates its input; call fix() to obtain a cleaned copy.",
    "The quality score is available at report.quality.score, not report.quality_score.",
  ],
  bestPractices: [
    "Run assess() before and after controlled cleaning to measure the effect.",
    "Use a report export method when you need a durable CI or audit artefact.",
  ],
  seeAlso: [
    { name: "fix()", slug: "fix", description: "Apply configurable, deterministic cleaning." },
    { name: "profile()", slug: "profile", description: "Inspect the dataset's structure." },
  ],
};

export const fixDoc: FunctionDoc = {
  name: "fix",
  slug: "fix",
  signature: "edf.fix(dataset, config=None) -> FixResult",
  oneLiner: "Apply configurable, deterministic cleaning to a dataset.",
  description:
    "Runs the v1 cleaning pipeline with an optional FixConfig. Configure missing-value handling, custom missing markers, per-column overrides, duplicate and empty-row removal, whitespace trimming and column-name normalisation. Dry runs preserve the source dataset and expose a separate proposed dataset.",
  parameters: [
    {
      name: "dataset",
      type: "str | pathlib.Path | pandas.DataFrame",
      description: "A pandas DataFrame or path to a supported CSV or Excel dataset.",
    },
    {
      name: "config",
      type: "FixConfig | None",
      default: "None",
      description: "Optional deterministic cleaning configuration. None uses FixConfig defaults.",
    },
  ],
  returns: {
    type: "FixResult",
    description:
      "The resulting dataset, before/after assessments, applied fixes, structured change log and optional dry-run proposal.",
  },
  raises: [
    { name: "FileNotFoundError", when: "the supplied path does not exist." },
    { name: "ValueError", when: "a cleaning strategy or input file type is unsupported." },
  ],
  examples: [
    {
      title: "Clean and export",
      code: `import eazydatafix as edf\n\nconfig = edf.FixConfig(\n    missing_value_strategy="median",\n    missing_markers=("", "NA", "N/A", "unknown"),\n)\nresult = edf.fix("employees.csv", config)\nprint(result.applied_fixes)\nresult.save("employees-clean.csv")`,
      repl: [
        { kind: "in", text: 'result = edf.fix("employees.csv", config)' },
        { kind: "in", text: "result.applied_fixes" },
        { kind: "out", text: "['Trimmed leading/trailing whitespaces.'," },
        { kind: "out", text: " 'Removed 1 duplicate row(s).'," },
        { kind: "out", text: " \"Filled numeric column 'salary' using median.\"]" },
        { kind: "in", text: 'result.save("employees-clean.csv")' },
      ],
    },
    {
      title: "Preview with a dry run",
      code: `config = edf.FixConfig(dry_run=True)\npreview = edf.fix("employees.csv", config)\n\nprint(preview.dry_run)\nprint(preview.change_log)\nprint(preview.proposed_dataset.head())`,
    },
  ],
  notes: [
    "fix() does not mutate a caller-supplied DataFrame.",
    "In a dry run, result.dataset remains unchanged and result.proposed_dataset contains the cleaned preview.",
  ],
  bestPractices: [
    "Keep result.applied_fixes and result.change_log with the cleaned output for auditability.",
    "Use ColumnCleaningRule entries when one column needs different missing markers or imputation.",
  ],
  seeAlso: [
    { name: "assess()", slug: "assess", description: "Measure quality before and after cleaning." },
    { name: "profile()", slug: "profile", description: "Inspect rows, columns and data types." },
  ],
};

export const profileDoc: FunctionDoc = {
  name: "profile",
  slug: "profile",
  signature: "edf.profile(dataset) -> DatasetProfile",
  oneLiner: "Inspect the structural metadata of a dataset.",
  description:
    "Returns a lightweight structural profile: file name and type, row and column counts, column names, pandas data types and memory use. It intentionally does not perform quality assessment or calculate distributions and correlations.",
  parameters: [
    {
      name: "dataset",
      type: "str | pathlib.Path | pandas.DataFrame",
      description: "A pandas DataFrame or path to a supported CSV or Excel dataset.",
    },
  ],
  returns: {
    type: "DatasetProfile",
    description:
      "Structural metadata in file_name, file_type, rows, columns, column_names, data_types and memory_usage_bytes.",
  },
  raises: [
    { name: "FileNotFoundError", when: "the supplied path does not exist." },
    { name: "ValueError", when: "the supplied file type is not supported." },
  ],
  examples: [
    {
      title: "Profile a dataset",
      code: `import eazydatafix as edf\n\nprofile = edf.profile("hospital.csv")\nprint(profile.rows, profile.columns)\nprint(profile.column_names)\nprint(profile.data_types)`,
      repl: [
        { kind: "in", text: 'profile = edf.profile("hospital.csv")' },
        { kind: "in", text: "profile.rows, profile.columns" },
        { kind: "out", text: "(15, 8)" },
        { kind: "in", text: "profile.column_names[:3]" },
        { kind: "out", text: "['patient_id', 'age', 'gender']" },
      ],
    },
  ],
  notes: [
    "profile() is a structural inventory, not a data-quality report.",
    "Use assess() for missing values, duplicates, quality dimensions and report exports.",
  ],
  bestPractices: [
    "Run profile() first when you need a quick shape and schema check.",
    "Pair profile() with assess() when you also need quality metrics.",
  ],
  seeAlso: [
    { name: "assess()", slug: "assess", description: "Generate quality metrics and exports." },
    { name: "fix()", slug: "fix", description: "Apply configurable cleaning." },
  ],
};

export const allDocs: FunctionDoc[] = [assessDoc, fixDoc, profileDoc];
