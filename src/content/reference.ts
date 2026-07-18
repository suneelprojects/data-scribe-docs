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
  signature: "edf.assess(data, *, columns=None, thresholds=None, verbose=False) -> QualityReport",
  oneLiner: "Compute a full data-quality assessment for a dataset.",
  description:
    "Computes missing values, duplicates, dtype consistency, cardinality, outliers and a composite quality score for the supplied dataset. Accepts CSV paths, Excel workbooks and pandas DataFrames. The returned QualityReport is a serialisable object with .summary(), .to_dict() and .to_html() methods.",
  parameters: [
    { name: "data", type: "str | pathlib.Path | pandas.DataFrame", description: "Source dataset. Strings ending in .csv, .xlsx or .xls are loaded automatically." },
    { name: "columns", type: "list[str] | None", default: "None", description: "Restrict the assessment to a subset of columns. When None, every column is scanned." },
    { name: "thresholds", type: "dict | None", default: "None", description: "Override default warning thresholds, e.g. {'missing': 0.2, 'duplicates': 0.05}." },
    { name: "verbose", type: "bool", default: "False", description: "Print a per-column log while assessing." },
  ],
  returns: { type: "QualityReport", description: "Structured report with summary metrics and per-column diagnostics." },
  raises: [
    { name: "FileNotFoundError", when: "the supplied path does not exist." },
    { name: "ValueError", when: "the file extension is not supported or the DataFrame is empty." },
  ],
  examples: [
    {
      title: "Assess a CSV file",
      code: `import eazydatafix as edf\n\nreport = edf.assess("employees.csv")\nreport.summary()`,
      repl: [
        { kind: "in", text: 'import eazydatafix as edf' },
        { kind: "in", text: 'report = edf.assess("employees.csv")' },
        { kind: "in", text: 'report.summary()' },
        { kind: "out", text: "QualityReport(employees.csv)" },
        { kind: "out", text: "  rows           1,204" },
        { kind: "out", text: "  columns           12" },
        { kind: "out", text: "  missing_values    38  (0.3%)" },
        { kind: "out", text: "  duplicates         6  (0.5%)" },
        { kind: "out", text: "  quality_score   94.0" },
      ],
    },
    {
      title: "Custom thresholds",
      code: `report = edf.assess(\n    "sales.xlsx",\n    thresholds={"missing": 0.05, "duplicates": 0.01},\n    verbose=True,\n)`,
    },
  ],
  notes: [
    "assess() never mutates its input; call fix() to obtain a cleaned copy.",
    "For DataFrames larger than one million rows, use edf.profile() first to plan the assessment.",
  ],
  bestPractices: [
    "Run assess() before fix() so you can review issues and decide which fixes to allow.",
    "Persist the returned report with report.to_dict() for reproducible pipelines.",
  ],
  seeAlso: [
    { name: "fix()", slug: "fix", description: "Apply automatic cleaning based on an assessment." },
    { name: "profile()", slug: "profile", description: "Deep column-level statistics and distributions." },
  ],
};

export const fixDoc: FunctionDoc = {
  name: "fix",
  slug: "fix",
  signature: "edf.fix(data, *, strategy='auto', drop_duplicates=True, fill_missing='median', dry_run=False) -> FixResult",
  oneLiner: "Apply automated cleaning fixes to a dataset.",
  description:
    "Executes an opinionated cleaning pipeline: normalises whitespace, coerces obvious dtypes, drops exact duplicates, imputes missing values with a per-column strategy, and flags rows that could not be repaired. Returns a FixResult that exposes the cleaned DataFrame, the list of applied fixes and helpers for export.",
  parameters: [
    { name: "data", type: "str | pathlib.Path | pandas.DataFrame", description: "Source dataset. Same input types as assess()." },
    { name: "strategy", type: "Literal['auto', 'safe', 'aggressive']", default: "'auto'", description: "'safe' only applies non-destructive fixes; 'aggressive' will drop columns with >90% missing values." },
    { name: "drop_duplicates", type: "bool", default: "True", description: "Remove exact duplicate rows before imputation." },
    { name: "fill_missing", type: "Literal['mean', 'median', 'mode', 'ffill', 'drop']", default: "'median'", description: "Per-column imputation strategy for numeric fields." },
    { name: "dry_run", type: "bool", default: "False", description: "When True, computes the diff without materialising the cleaned DataFrame." },
  ],
  returns: { type: "FixResult", description: "Wraps .dataframe, .applied_fixes, .to_csv(), .to_excel() and .diff()." },
  raises: [
    { name: "ValueError", when: "an unknown strategy or fill_missing option is passed." },
  ],
  examples: [
    {
      title: "Clean and export",
      code: `import eazydatafix as edf\n\nresult = edf.fix("employees.csv")\nresult.applied_fixes\nresult.to_csv("clean.csv")`,
      repl: [
        { kind: "in", text: 'result = edf.fix("employees.csv")' },
        { kind: "in", text: 'result.applied_fixes' },
        { kind: "out", text: "['strip_whitespace', 'coerce_numeric', 'drop_duplicates(6)', 'impute_missing(38, median)']" },
        { kind: "in", text: 'result.to_csv("clean.csv")' },
        { kind: "out", text: "wrote clean.csv (1,198 rows × 12 cols)" },
      ],
    },
  ],
  notes: [
    "fix() is deterministic — the same input plus the same options produces the same output.",
    "Pass dry_run=True to preview which fixes would apply without touching the data.",
  ],
  bestPractices: [
    "Store result.applied_fixes alongside the cleaned file so pipelines stay auditable.",
    "Prefer strategy='safe' for regulated workloads; keep 'aggressive' for exploratory work.",
  ],
  seeAlso: [
    { name: "assess()", slug: "assess", description: "Understand issues before fixing." },
    { name: "profile()", slug: "profile", description: "Inspect column distributions and dtypes." },
  ],
};

export const profileDoc: FunctionDoc = {
  name: "profile",
  slug: "profile",
  signature: "edf.profile(data, *, sample=None, correlations=True) -> Profile",
  oneLiner: "Compute a rich column-level profile of a dataset.",
  description:
    "Generates per-column dtype, cardinality, null-rate, distribution summary and pairwise correlations. Designed to be readable in the REPL and exportable to HTML for review.",
  parameters: [
    { name: "data", type: "str | pathlib.Path | pandas.DataFrame", description: "Source dataset." },
    { name: "sample", type: "int | None", default: "None", description: "Randomly sample N rows before profiling for very large datasets." },
    { name: "correlations", type: "bool", default: "True", description: "Compute pairwise Pearson correlations for numeric columns." },
  ],
  returns: { type: "Profile", description: "Object with .columns, .correlations, .to_html() and .to_dict()." },
  raises: [
    { name: "ValueError", when: "sample is larger than the dataset." },
  ],
  examples: [
    {
      title: "Profile a DataFrame",
      code: `import pandas as pd\nimport eazydatafix as edf\n\ndf = pd.read_csv("hospital.csv")\nprof = edf.profile(df, sample=10_000)\nprof.columns["age"]`,
      repl: [
        { kind: "in", text: 'prof = edf.profile(df)' },
        { kind: "in", text: 'prof.columns["age"]' },
        { kind: "out", text: "ColumnProfile(age)" },
        { kind: "out", text: "  dtype       int64" },
        { kind: "out", text: "  missing     0" },
        { kind: "out", text: "  unique      87" },
        { kind: "out", text: "  min         0" },
        { kind: "out", text: "  max         104" },
        { kind: "out", text: "  mean        42.3" },
      ],
    },
  ],
  notes: [
    "Profiles are lightweight and cheap to serialise — safe to store per-run.",
    "Correlations only include columns with dtype numeric or bool.",
  ],
  bestPractices: [
    "Use sample= for datasets over ~5M rows to keep profiling under a second.",
    "Export prof.to_html() into your CI artefacts for quick data reviews.",
  ],
  seeAlso: [
    { name: "assess()", slug: "assess", description: "Composite quality report." },
    { name: "fix()", slug: "fix", description: "Apply automated fixes." },
  ],
};

export const allDocs: FunctionDoc[] = [assessDoc, fixDoc, profileDoc];
