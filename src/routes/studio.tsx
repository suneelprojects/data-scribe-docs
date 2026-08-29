import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileUp,
  LockKeyhole,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  TableProperties,
  WandSparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Data Studio Preview — EazyDataFix" },
      {
        name: "description",
        content:
          "Try the EazyDataFix customer workflow with a sample dataset or your own CSV. Scan issues, review deterministic fixes and download the cleaned preview.",
      },
      { property: "og:title", content: "EazyDataFix Data Studio Preview" },
      {
        property: "og:description",
        content: "Upload, inspect, approve and export cleaner data without writing Python.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eazydatafix.com/studio" }],
  }),
  component: DataStudio,
});

type DataProfile = "analysis" | "ml" | "powerbi";
type DataRow = Record<string, string>;
type IssueKey = "headers" | "whitespace" | "missing" | "currency" | "categories" | "duplicates";

type Issue = {
  key: IssueKey;
  title: string;
  description: string;
  count: number;
  severity: "high" | "medium" | "low";
};

const SAMPLE_CSV = `Customer ID,Customer Name,Salary,City,Join Date
C-101," Anika Rao ","₹72,000",HYD,2026-01-08
C-102,Rahul,N/A,Hyderabad,08/02/2026
C-102,Rahul,N/A,hyderabad,08/02/2026
C-103," Meera ","54,500",Bangalore,2026-03-11
C-104,John,null,BLR,2026-04-02`;

const profileOptions = [
  {
    value: "analysis" as const,
    label: "Analysis Ready",
    description: "Typed, consistent data for reporting and exploration",
    icon: BarChart3,
  },
  {
    value: "powerbi" as const,
    label: "Power BI Ready",
    description: "Field and model-input checks for BI workflows",
    icon: TableProperties,
  },
  {
    value: "ml" as const,
    label: "ML Ready",
    description: "Feature-readiness preview with leakage awareness",
    icon: BrainCircuit,
  },
];

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseCsv(source: string): { headers: string[]; rows: DataRow[] } {
  const matrix: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) matrix.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.length > 0)) matrix.push(row);
  if (matrix.length === 0) return { headers: [], rows: [] };

  const headers = matrix[0].map((header, index) => header || `column_${index + 1}`);
  const rows = matrix
    .slice(1)
    .map((cells) =>
      Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])),
    );
  return { headers, rows };
}

function analyze(headers: string[], rows: DataRow[]) {
  const missingMarkers = new Set(["", "n/a", "na", "null", "none", "-"]);
  const headerCount = headers.filter((header) => normalizeHeader(header) !== header).length;
  let whitespaceCount = 0;
  let missingCount = 0;
  let currencyCount = 0;
  let categoryCount = 0;

  for (const row of rows) {
    for (const [header, raw] of Object.entries(row)) {
      const trimmed = raw.trim();
      if (raw !== trimmed) whitespaceCount += 1;
      if (missingMarkers.has(trimmed.toLowerCase())) missingCount += 1;
      if (/[₹$€£]/.test(trimmed) || /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(trimmed)) {
        currencyCount += 1;
      }
      const normalized = normalizeHeader(header);
      if (
        ["city", "state", "region"].some((token) => normalized.includes(token)) &&
        ["hyd", "hyderabad", "blr", "bangalore", "bengaluru", "mum", "mumbai"].includes(
          trimmed.toLowerCase(),
        )
      ) {
        categoryCount += 1;
      }
    }
  }

  const seen = new Set<string>();
  let duplicateCount = 0;
  for (const row of rows) {
    const signature = headers
      .map((header) => row[header]?.trim().toLowerCase() ?? "")
      .join("\u241f");
    if (seen.has(signature)) duplicateCount += 1;
    else seen.add(signature);
  }

  const issues: Issue[] = [
    {
      key: "headers",
      title: "Inconsistent column names",
      description: "Normalize headings into collision-safe snake_case fields.",
      count: headerCount,
      severity: "medium",
    },
    {
      key: "whitespace",
      title: "Hidden text whitespace",
      description: "Trim leading and trailing spaces without altering source meaning.",
      count: whitespaceCount,
      severity: "low",
    },
    {
      key: "missing",
      title: "Mixed missing-value markers",
      description: "Standardize N/A, null, blanks and configured markers.",
      count: missingCount,
      severity: "high",
    },
    {
      key: "currency",
      title: "Numbers stored as formatted text",
      description: "Safely remove currency symbols and thousands separators.",
      count: currencyCount,
      severity: "high",
    },
    {
      key: "categories",
      title: "Inconsistent location labels",
      description: "Review common abbreviations and casing before standardization.",
      count: categoryCount,
      severity: "medium",
    },
    {
      key: "duplicates",
      title: "Duplicate records",
      description: "Remove exact duplicates after the selected normalizations.",
      count: duplicateCount,
      severity: "medium",
    },
  ];

  const penalty =
    headerCount * 2 +
    whitespaceCount +
    missingCount * 2 +
    currencyCount * 2 +
    categoryCount +
    duplicateCount * 7;
  return { issues, score: Math.max(0, Math.round(100 - Math.min(80, penalty))) };
}

function standardizeCategory(header: string, value: string) {
  const normalizedHeader = normalizeHeader(header);
  if (!["city", "state", "region"].some((token) => normalizedHeader.includes(token))) return value;
  const lookup: Record<string, string> = {
    hyd: "Hyderabad",
    hyderabad: "Hyderabad",
    blr: "Bengaluru",
    bangalore: "Bengaluru",
    bengaluru: "Bengaluru",
    mum: "Mumbai",
    mumbai: "Mumbai",
  };
  return lookup[value.trim().toLowerCase()] ?? value;
}

function applySelectedFixes(headers: string[], rows: DataRow[], selected: Set<IssueKey>) {
  const outputHeaders = headers.map((header) =>
    selected.has("headers") ? normalizeHeader(header) : header,
  );
  const missingMarkers = new Set(["", "n/a", "na", "null", "none", "-"]);
  const outputRows = rows.map((row) => {
    const next: DataRow = {};
    headers.forEach((header, index) => {
      let value = row[header] ?? "";
      if (selected.has("whitespace")) value = value.trim();
      if (selected.has("missing") && missingMarkers.has(value.trim().toLowerCase())) value = "";
      if (
        selected.has("currency") &&
        (/[₹$€£]/.test(value) || /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(value.trim()))
      ) {
        value = value.replace(/[₹$€£,\s]/g, "");
      }
      if (selected.has("categories")) value = standardizeCategory(header, value);
      next[outputHeaders[index]] = value;
    });
    return next;
  });

  if (!selected.has("duplicates")) return { headers: outputHeaders, rows: outputRows };
  const seen = new Set<string>();
  return {
    headers: outputHeaders,
    rows: outputRows.filter((row) => {
      const signature = outputHeaders
        .map((header) => row[header]?.trim().toLowerCase() ?? "")
        .join("\u241f");
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    }),
  };
}

function escapeCsv(value: string) {
  if (!/[",\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function DataPreview({ headers, rows }: { headers: string[]; rows: DataRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-xs">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-mono font-medium text-muted-foreground">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.slice(0, 6).map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td
                    key={header}
                    className="whitespace-nowrap px-4 py-3 font-mono text-foreground/80"
                  >
                    {row[header] || <span className="text-muted-foreground/50">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-14 w-14 place-items-center rounded-full p-1"
        style={{
          background: `conic-gradient(var(--color-accent) ${score * 3.6}deg, var(--color-muted) 0)`,
        }}
      >
        <div className="grid h-full w-full place-items-center rounded-full bg-background font-mono text-sm font-semibold">
          {score}
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-sm font-medium">Readiness score</div>
      </div>
    </div>
  );
}

function DataStudio() {
  const fileInput = useRef<HTMLInputElement>(null);
  const initial = useMemo(() => parseCsv(SAMPLE_CSV), []);
  const [sourceName, setSourceName] = useState("customer_sample.csv");
  const [headers, setHeaders] = useState(initial.headers);
  const [rows, setRows] = useState(initial.rows);
  const [profile, setProfile] = useState<DataProfile>("analysis");
  const [selected, setSelected] = useState<Set<IssueKey>>(
    new Set(["headers", "whitespace", "missing", "currency", "categories", "duplicates"]),
  );
  const [view, setView] = useState<"input" | "output">("input");
  const [fileError, setFileError] = useState<string | null>(null);

  const inputAnalysis = useMemo(() => analyze(headers, rows), [headers, rows]);
  const cleaned = useMemo(
    () => applySelectedFixes(headers, rows, selected),
    [headers, rows, selected],
  );
  const outputAnalysis = useMemo(
    () => analyze(cleaned.headers, cleaned.rows),
    [cleaned.headers, cleaned.rows],
  );

  const toggleIssue = (key: IssueKey) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const loadSample = () => {
    const data = parseCsv(SAMPLE_CSV);
    setSourceName("customer_sample.csv");
    setHeaders(data.headers);
    setRows(data.rows);
    setSelected(
      new Set(["headers", "whitespace", "missing", "currency", "categories", "duplicates"]),
    );
    setView("input");
    setFileError(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileError(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError(
        "The public preview currently accepts CSV files. Excel support is available in the engine and assisted pilot.",
      );
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Please use a CSV smaller than 2 MB in this browser preview.");
      return;
    }
    const parsed = parseCsv(await file.text());
    if (parsed.headers.length === 0 || parsed.rows.length === 0) {
      setFileError("This CSV does not contain a header row and at least one data row.");
      return;
    }
    setSourceName(file.name);
    setHeaders(parsed.headers);
    setRows(parsed.rows);
    setView("input");
  };

  const download = () => {
    const body = [
      cleaned.headers.map(escapeCsv).join(","),
      ...cleaned.rows.map((row) =>
        cleaned.headers.map((header) => escapeCsv(row[header] ?? "")).join(","),
      ),
    ].join("\n");
    const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = sourceName.replace(/\.csv$/i, "") + "_eazydatafix_preview.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const activeProfile = profileOptions.find((option) => option.value === profile)!;

  return (
    <div className="min-h-screen bg-muted/20">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                <WandSparkles className="h-3.5 w-3.5" /> Data Studio · Browser preview
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Inspect the workflow with real CSV data.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                This public preview processes the selected file in your browser. It demonstrates
                issue detection, change approval and clean CSV export without uploading the file.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <LockKeyhole className="h-3.5 w-3.5 text-accent" /> Browser-local preview
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" /> No AI transformation
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Step 1
                </div>
                <h2 className="mt-1 font-semibold">Choose your outcome</h2>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent">
                <activeProfile.icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {profileOptions.map((option) => {
                const Icon = option.icon;
                const active = profile === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setProfile(option.value)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left transition",
                      active
                        ? "border-accent bg-accent/10"
                        : "border-border bg-background hover:border-accent/35",
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon
                        className={cn("h-4 w-4", active ? "text-accent" : "text-muted-foreground")}
                      />
                      {option.label}
                    </div>
                    <p className="mt-1.5 pl-6 text-xs leading-5 text-muted-foreground">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Step 2
            </div>
            <h2 className="mt-1 font-semibold">Load a CSV</h2>
            <input
              ref={fileInput}
              type="file"
              accept=".csv,text/csv"
              onChange={upload}
              className="sr-only"
              id="studio-file"
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="mt-4 flex w-full flex-col items-center rounded-xl border border-dashed border-accent/40 bg-accent/[0.04] px-4 py-6 text-center transition hover:bg-accent/[0.08]"
            >
              <FileUp className="h-6 w-6 text-accent" />
              <span className="mt-3 text-sm font-medium">Choose a CSV file</span>
              <span className="mt-1 text-xs text-muted-foreground">
                Up to 2 MB · stays in browser
              </span>
            </button>
            <button
              type="button"
              onClick={loadSample}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset sample dataset
            </button>
            {fileError && (
              <div className="mt-3 flex gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {fileError}
              </div>
            )}
          </section>
        </aside>

        <main className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                  <FileSpreadsheet className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <h2 className="font-semibold">{sourceName}</h2>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {rows.length} rows · {headers.length} columns · {activeProfile.label}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <ScoreRing score={inputAnalysis.score} label="Before" />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <ScoreRing score={outputAnalysis.score} label="Preview" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Step 3
                </div>
                <h2 className="mt-1 text-xl font-semibold">Review proposed changes</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select only the transformations you want included in the export preview.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {selected.size} of {inputAnalysis.issues.length} selected
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {inputAnalysis.issues.map((issue) => {
                const checked = selected.has(issue.key);
                return (
                  <button
                    key={issue.key}
                    type="button"
                    onClick={() => toggleIssue(issue.key)}
                    className={cn(
                      "flex gap-3 rounded-xl border p-4 text-left transition",
                      checked
                        ? "border-accent/55 bg-accent/[0.055]"
                        : "border-border bg-background",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border",
                        checked
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border",
                      )}
                    >
                      {checked && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">{issue.title}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {issue.count} found
                        </span>
                      </span>
                      <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">
                        {issue.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Step 4
                </div>
                <h2 className="mt-1 text-xl font-semibold">Compare and export</h2>
              </div>
              <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
                {(["input", "output"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setView(item)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium capitalize",
                      view === item ? "bg-background shadow-sm" : "text-muted-foreground",
                    )}
                  >
                    {item === "input" ? "Original" : "Clean preview"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <DataPreview
                headers={view === "input" ? headers : cleaned.headers}
                rows={view === "input" ? rows : cleaned.rows}
              />
            </div>
            <div className="mt-5 flex flex-col justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                Preview removes {Math.max(0, rows.length - cleaned.rows.length)} duplicate row(s)
                and applies {selected.size} selected rule groups.
              </div>
              <button
                type="button"
                onClick={download}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background"
              >
                <Download className="h-4 w-4" /> Download clean CSV
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-accent/20 bg-accent/[0.055] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold">
                  Need the full v1.4.0 engine on a business workflow?
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Assisted pilots add Excel processing, Power BI relationship checks, saved recipes,
                  larger files and a documented business outcome. The browser preview is
                  deliberately limited.
                </p>
              </div>
              <Link
                to="/pricing"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent"
              >
                View pilot scope <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
