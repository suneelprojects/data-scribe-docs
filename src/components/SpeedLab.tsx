import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  DatabaseZap,
  FileCheck2,
  Play,
  RotateCcw,
  ScanSearch,
  Sparkles,
  Table2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CellState = "issue" | "changed" | "failed";

type LabRow = {
  id: string;
  cells: string[];
  after?: string[];
  states?: Partial<Record<number, CellState>>;
};

type LabTask = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  columns: string[];
  rows: LabRow[];
  pandasCode: string;
  eazyCode: string;
  pandasSteps: string[];
  eazySteps: string[];
  outcomes: { label: string; value: string }[];
  resultTitle: string;
  resultBody: string;
};

const TASKS: LabTask[] = [
  {
    id: "clean",
    label: "Clean messy data",
    eyebrow: "Controlled cleaning",
    title: "Turn inconsistent customer data into a traceable result",
    description:
      "Handle missing markers, whitespace, column names and duplicate rows while keeping a structured record of every cleaning stage.",
    icon: DatabaseZap,
    columns: ["customer id", "name", "salary", "city"],
    rows: [
      {
        id: "C-101",
        cells: ["C-101", "  Anika Rao  ", "72000", "Hyderabad"],
        after: ["C-101", "Anika Rao", "72000", "Hyderabad"],
        states: { 1: "changed" },
      },
      {
        id: "C-102",
        cells: ["C-102", "Rahul", "N/A", "  Pune"],
        after: ["C-102", "Rahul", "72000", "Pune"],
        states: { 2: "issue", 3: "changed" },
      },
      {
        id: "C-102-copy",
        cells: ["C-102", "Rahul", "N/A", "  Pune"],
        after: ["Duplicate removed", "—", "—", "—"],
        states: { 0: "issue", 1: "issue", 2: "issue", 3: "issue" },
      },
    ],
    pandasCode: `import pandas as pd

df = pd.read_csv("customers.csv")
before = df.copy()
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
df = df.replace(["", "N/A", "null"], pd.NA)
df["name"] = df["name"].str.strip()
df["city"] = df["city"].str.strip()
df["salary"] = pd.to_numeric(df["salary"], errors="coerce")
df["salary"] = df["salary"].fillna(df["salary"].median())
df = df.drop_duplicates()

# Build and maintain your own summary
audit = {
    "rows_removed": len(before) - len(df),
    "missing_after": int(df.isna().sum().sum()),
}`,
    eazyCode: `import eazydatafix as edf

config = edf.FixConfig(
    missing_markers=("", "N/A", "null"),
    remove_duplicates=True,
)
result = edf.fix("customers.csv", config)

clean = result.dataset
audit = result.change_log`,
    pandasSteps: [
      "Define missing markers",
      "Normalize text and headers",
      "Convert and impute salary",
      "Remove duplicate records",
      "Assemble an audit record",
    ],
    eazySteps: [
      "Read one controlled config",
      "Apply deterministic fixes",
      "Return clean data + change log",
    ],
    outcomes: [
      { label: "Issues handled", value: "5" },
      { label: "Duplicate rows", value: "1" },
      { label: "Audit output", value: "Included" },
    ],
    resultTitle: "Clean dataset and audit trail are ready",
    resultBody:
      "The demo resolves five visible issues and exposes the cleaned DataFrame plus structured change records for inspection.",
  },
  {
    id: "prepare",
    label: "Prepare columns",
    eyebrow: "Analysis preparation",
    title: "Convert dates and numeric columns with readiness evidence",
    description:
      "Use explicit conversion thresholds, normalize text and cap outliers without silently mutating the caller's original DataFrame.",
    icon: FileCheck2,
    columns: ["order_id", "order_date", "amount", "segment"],
    rows: [
      {
        id: "O-201",
        cells: ["O-201", "8 Aug 2026", "1250", "  Retail  "],
        after: ["O-201", "2026-08-08", "1250.0", "Retail"],
        states: { 1: "changed", 2: "changed", 3: "changed" },
      },
      {
        id: "O-202",
        cells: ["O-202", "9 Aug 2026", "999999", "SMB"],
        after: ["O-202", "2026-08-09", "3450.0", "SMB"],
        states: { 1: "changed", 2: "issue" },
      },
      {
        id: "O-203",
        cells: ["O-203", "10 Aug 2026", "2100", "Enterprise"],
        after: ["O-203", "2026-08-10", "2100.0", "Enterprise"],
        states: { 1: "changed", 2: "changed" },
      },
    ],
    pandasCode: `import pandas as pd

df = pd.read_csv("orders.csv")
before_types = df.dtypes.astype(str).to_dict()
df["order_date"] = pd.to_datetime(df["order_date"], dayfirst=True)
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
df["segment"] = df["segment"].str.strip()

q1, q3 = df["amount"].quantile([0.25, 0.75])
iqr = q3 - q1
lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
df["amount"] = df["amount"].clip(lower, upper)

report = {
    "shape": df.shape,
    "types_before": before_types,
    "types_after": df.dtypes.astype(str).to_dict(),
}`,
    eazyCode: `import eazydatafix as edf

config = edf.PrepareConfig(
    date_parsing_threshold=0.80,
    numeric_conversion_threshold=0.95,
    normalize_text=True,
    outlier_action="cap",
)
report = edf.prepare_with_report("orders.csv", config)

prepared = report.dataset`,
    pandasSteps: [
      "Choose and apply conversions",
      "Calculate IQR boundaries",
      "Cap outlier values",
      "Normalize text columns",
      "Build readiness metadata",
    ],
    eazySteps: [
      "Declare preparation controls",
      "Apply threshold-gated changes",
      "Return data + preparation report",
    ],
    outcomes: [
      { label: "Columns prepared", value: "3" },
      { label: "Outliers capped", value: "1" },
      { label: "Readiness report", value: "Included" },
    ],
    resultTitle: "Prepared data comes with evidence",
    resultBody:
      "The result includes shape, data types, deterministic changes and warnings alongside the prepared dataset.",
  },
  {
    id: "validate",
    label: "Validate a contract",
    eyebrow: "Pipeline validation",
    title: "Turn data expectations into one deterministic gate",
    description:
      "Infer the expected schema from known-good data, add reusable quality rules and produce an explicit pass/fail report for every incoming file.",
    icon: ClipboardCheck,
    columns: ["employee_id", "email", "salary", "department"],
    rows: [
      {
        id: "E-301",
        cells: ["E-301", "anika@example.com", "78000", "Data"],
        after: ["E-301", "anika@example.com", "78000", "Data"],
      },
      {
        id: "E-302",
        cells: ["E-302", "null", "-500", "Engineering"],
        after: ["E-302", "FAIL: required", "FAIL: below 0", "Engineering"],
        states: { 1: "failed", 2: "failed" },
      },
      {
        id: "E-301-copy",
        cells: ["E-301", "sam@example.com", "64000", "Support"],
        after: ["FAIL: duplicate", "sam@example.com", "64000", "Support"],
        states: { 0: "failed" },
      },
    ],
    pandasCode: `import pandas as pd

trusted = pd.read_csv("trusted_employees.csv")
incoming = pd.read_csv("incoming.csv")
checks = []

checks.append(set(trusted.columns) == set(incoming.columns))
checks.append(trusted.dtypes.equals(incoming.dtypes))
checks.append(incoming["email"].notna().all())
checks.append(incoming["employee_id"].is_unique)
checks.append(incoming["salary"].ge(0).all())

passed = all(checks)
if not passed:
    raise SystemExit(1)`,
    eazyCode: `import eazydatafix as edf

contract = edf.infer_schema("trusted_employees.csv")
rules = (
    edf.QualityRule("email_required", "email", "not_null"),
    edf.QualityRule("unique_id", "employee_id", "unique"),
    edf.QualityRule("salary_floor", "salary", "min", 0),
)
report = edf.validate_contract("incoming.csv", contract, rules)

if not report.passed:
    raise SystemExit(1)`,
    pandasSteps: [
      "Load trusted and incoming data",
      "Compare columns and data types",
      "Write each validation check",
      "Aggregate pass/fail state",
      "Create explainable results",
    ],
    eazySteps: [
      "Infer a reusable contract",
      "Declare explicit quality rules",
      "Return ordered pass/fail checks",
    ],
    outcomes: [
      { label: "Rules checked", value: "3" },
      { label: "Rule failures", value: "3" },
      { label: "Pipeline status", value: "Exit 1" },
    ],
    resultTitle: "Incoming data fails with exact reasons",
    resultBody:
      "The report identifies the missing email, negative salary and duplicate employee ID instead of returning only a boolean.",
  },
  {
    id: "explore",
    label: "Explore a dataset",
    eyebrow: "Deterministic EDA",
    title: "Build a reusable first-pass analysis in one workflow",
    description:
      "Profile structure, assess quality, clean known issues and generate deterministic observations using stable result objects.",
    icon: BarChart3,
    columns: ["region", "orders", "revenue", "returns"],
    rows: [
      {
        id: "South",
        cells: ["South", "842", "₹18.4L", "3.1%"],
        after: ["South", "842", "₹18.4L", "3.1%"],
        states: { 2: "changed" },
      },
      {
        id: "West",
        cells: ["West", "791", "₹16.9L", "7.8%"],
        after: ["West", "791", "₹16.9L", "7.8% · review"],
        states: { 3: "issue" },
      },
      {
        id: "North",
        cells: ["North", "674", "₹14.2L", "4.0%"],
        after: ["North", "674", "₹14.2L", "4.0%"],
      },
    ],
    pandasCode: `import pandas as pd

df = pd.read_csv("regional_sales.csv")
shape = df.shape
types = df.dtypes
missing = df.isna().sum()
duplicates = df.duplicated().sum()
numeric_summary = df.describe()
categorical_summary = df.describe(include="object")
correlations = df.select_dtypes("number").corr()

quality_notes = []
if missing.any():
    quality_notes.append("Missing values require review")
if duplicates:
    quality_notes.append("Duplicate rows require review")`,
    eazyCode: `import eazydatafix as edf

result = edf.run("regional_sales.csv")

profile = result.profile
quality = result.assessment
cleaning = result.fix_result
analysis = result.eda_result`,
    pandasSteps: [
      "Inspect shape and data types",
      "Measure missing and duplicate data",
      "Summarize numeric columns",
      "Summarize categorical columns",
      "Assemble quality observations",
    ],
    eazySteps: [
      "Run the composed workflow",
      "Inspect each typed result stage",
      "Reuse outputs in notebook or CI",
    ],
    outcomes: [
      { label: "Workflow stages", value: "4" },
      { label: "Manual checks", value: "Reduced" },
      { label: "Typed outputs", value: "Included" },
    ],
    resultTitle: "A complete first-pass analysis is ready",
    resultBody:
      "Profile, assessment, controlled cleaning and deterministic EDA stay separately inspectable inside one composed result.",
  },
];

function countLines(code: string) {
  return code.split("\n").filter((line) => line.trim() && !line.trim().startsWith("#")).length;
}

function CopyCodeButton({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copiedWithFallback = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (copiedWithFallback) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Copy ${label} code`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function MiniCodePanel({
  title,
  subtitle,
  code,
  accent,
}: {
  title: string;
  subtitle: string;
  code: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-[#15171d] shadow-sm",
        accent ? "border-accent/60 ring-1 ring-accent/15" : "border-white/10",
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn("h-2 w-2 shrink-0 rounded-full", accent ? "bg-accent" : "bg-white/35")}
            />
            <span className="truncate text-xs font-semibold text-white">{title}</span>
          </div>
          <p className="mt-0.5 truncate pl-4 text-[10px] text-white/45">{subtitle}</p>
        </div>
        <CopyCodeButton code={code} label={title} />
      </div>
      <pre className="max-h-72 overflow-auto px-4 py-4 text-[11px] leading-[1.65] text-white/75 sm:text-xs">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function DataPreview({ task, complete }: { task: LabTask; complete: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <Table2 className="h-3.5 w-3.5 text-accent" />
          {complete ? "Result preview" : "Messy input preview"}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">sample · 3 rows shown</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left font-mono text-[11px]">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              {task.columns.map((column) => (
                <th key={column} className="border-b border-border px-3 py-2 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {task.rows.map((row) => (
              <tr key={row.id} className="border-b border-border/70 last:border-b-0">
                {(complete && row.after ? row.after : row.cells).map((cell, index) => {
                  const state = row.states?.[index];
                  return (
                    <td
                      key={`${row.id}-${task.columns[index]}`}
                      className={cn(
                        "whitespace-nowrap px-3 py-2.5 text-foreground transition-colors duration-500",
                        !complete && state && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                        complete && state === "changed" && "bg-accent/10 text-accent",
                        complete && state === "issue" && "bg-accent/10 text-accent",
                        complete &&
                          state === "failed" &&
                          "bg-destructive/10 text-destructive dark:text-red-300",
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {complete && state && (
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              state === "failed" ? "bg-destructive" : "bg-accent",
                            )}
                          />
                        )}
                        {cell}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkflowProgress({
  title,
  steps,
  phase,
  accelerated,
}: {
  title: string;
  steps: string[];
  phase: number;
  accelerated?: boolean;
}) {
  const visibleSteps =
    phase === 0
      ? 0
      : accelerated
        ? Math.min(steps.length, phase + 1)
        : Math.min(steps.length, phase);

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        accelerated ? "border-accent/40 bg-accent/5" : "border-border bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {phase === 0 ? "Ready" : visibleSteps === steps.length ? "Complete" : "Working"}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {steps.map((step, index) => {
          const visible = index < visibleSteps;
          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-2 text-[11px] transition-all duration-300",
                visible
                  ? "translate-x-0 text-foreground opacity-100"
                  : "translate-x-1 text-muted-foreground opacity-45",
              )}
            >
              <span
                className={cn(
                  "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                  visible ? "border-accent bg-accent text-accent-foreground" : "border-border",
                )}
              >
                {visible ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                )}
              </span>
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SpeedLab() {
  const [activeId, setActiveId] = useState(TASKS[0].id);
  const [phase, setPhase] = useState(0);
  const task = TASKS.find((item) => item.id === activeId) ?? TASKS[0];
  const complete = phase === 5;

  useEffect(() => {
    if (phase < 1 || phase >= 5) return;
    const timer = window.setTimeout(() => setPhase((current) => current + 1), 430);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const comparison = useMemo(() => {
    const pandasLines = countLines(task.pandasCode);
    const eazyLines = countLines(task.eazyCode);
    return {
      pandasLines,
      eazyLines,
      reduction: Math.max(0, Math.round((1 - eazyLines / pandasLines) * 100)),
    };
  }, [task]);

  const chooseTask = (id: string) => {
    setActiveId(id);
    setPhase(0);
  };

  return (
    <section id="speed-lab" className="relative overflow-hidden border-b border-border bg-muted/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_5%,color-mix(in_oklab,var(--color-accent)_9%,transparent),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
            <Sparkles className="h-3 w-3" />
            Interactive Speed Lab
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            See repetitive data work collapse into one auditable workflow.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Choose a common task, inspect the same sample data and run a transparent code
            comparison. The proof is fewer manual steps—not a synthetic CPU-speed race.
          </p>
        </div>

        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center"
          role="tablist"
          aria-label="Speed Lab task"
        >
          {TASKS.map((item) => {
            const Icon = item.icon;
            const active = item.id === task.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => chooseTask(item.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_70px_-45px_color-mix(in_oklab,var(--color-accent)_55%,transparent)]">
          <div className="grid gap-6 border-b border-border p-5 sm:p-7 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {task.eyebrow}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
                {task.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {task.description}
              </p>
            </div>
            <DataPreview task={task} complete={complete} />
          </div>

          <div className="p-5 sm:p-7">
            <div className="grid gap-4 lg:grid-cols-2">
              <MiniCodePanel
                title="Traditional Pandas"
                subtitle={`${comparison.pandasLines} non-empty example lines`}
                code={task.pandasCode}
              />
              <MiniCodePanel
                title="EazyDataFix"
                subtitle={`${comparison.eazyLines} non-empty example lines · structured outputs`}
                code={task.eazyCode}
                accent
              />
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <WorkflowProgress title="Manual workflow" steps={task.pandasSteps} phase={phase} />
              <WorkflowProgress
                title="EazyDataFix workflow"
                steps={task.eazySteps}
                phase={phase}
                accelerated
              />
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                  {complete ? (
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  ) : (
                    <ScanSearch className="h-4.5 w-4.5" />
                  )}
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {complete ? task.resultTitle : "Ready to compare both approaches"}
                  </div>
                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                    {complete
                      ? task.resultBody
                      : "This deterministic walkthrough animates developer workflow steps; it does not execute Python in your browser."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhase(complete ? 0 : 1)}
                disabled={phase > 0 && !complete}
                className="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {complete ? (
                  <RotateCcw className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {complete ? "Reset comparison" : phase > 0 ? "Comparing…" : "Run comparison"}
              </button>
            </div>

            {complete && (
              <div
                className="mt-5 grid animate-in gap-3 fade-in slide-in-from-bottom-2 sm:grid-cols-2 lg:grid-cols-5"
                aria-live="polite"
              >
                <div className="rounded-xl border border-accent/35 bg-accent/8 p-4">
                  <div className="text-2xl font-semibold text-accent">{comparison.reduction}%</div>
                  <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
                    fewer non-empty lines in this example
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="text-2xl font-semibold text-foreground">
                    {task.pandasSteps.length - task.eazySteps.length}
                  </div>
                  <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
                    workflow steps removed from the demo
                  </div>
                </div>
                {task.outcomes.map((outcome) => (
                  <div
                    key={outcome.label}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="text-lg font-semibold text-foreground">{outcome.value}</div>
                    <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
                      {outcome.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-[11px] text-muted-foreground">
              <span>
                Figures describe the visible sample and code shown above—not execution time.
              </span>
              <a
                href="/docs/quickstart"
                className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
              >
                Try the real library <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
