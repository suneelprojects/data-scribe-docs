import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileSpreadsheet,
  Github,
  Layers3,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TableProperties,
  WandSparkles,
} from "lucide-react";
import { InstallChip } from "@/components/InstallChip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EazyDataFix — Messy files in. Decision-ready data out." },
      {
        name: "description",
        content:
          "Clean, validate and prepare CSV or Excel data for analysis, machine learning and Power BI with transparent, reviewable changes.",
      },
      {
        property: "og:title",
        content: "EazyDataFix — Turn messy files into decision-ready data",
      },
      {
        property: "og:description",
        content:
          "Upload a file, inspect every issue, approve the fixes and export trusted data with a complete audit trail.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eazydatafix.com/" }],
  }),
  component: Home,
});

const profiles = [
  {
    icon: BarChart3,
    label: "Analysis Ready",
    title: "Stop cleaning before every analysis",
    description:
      "Standardize fields, handle missing markers, remove configured duplicates and export a typed dataset with readiness evidence.",
    items: ["Clean column names", "Safe type conversion", "Quality score + report"],
  },
  {
    icon: BrainCircuit,
    label: "ML Ready",
    title: "Prepare features without silent leakage",
    description:
      "Create train/test inputs with transformations fitted only on training data and a reusable preprocessing artifact.",
    items: ["Target-aware preparation", "Leakage safeguards", "Reusable artifact"],
  },
  {
    icon: TableProperties,
    label: "Power BI Ready",
    title: "Give Power BI cleaner model inputs",
    description:
      "Validate field types, keys and relationships, generate a date table and export documented model-ready files.",
    items: ["Key validation", "Relationship checks", "CSV/Excel export pack"],
  },
];

const steps = [
  {
    number: "01",
    icon: FileSpreadsheet,
    title: "Bring a real file",
    text: "Start with the CSV or Excel file already slowing down your reporting or analysis.",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "See what is wrong",
    text: "Review missing values, duplicate records, unsafe types, inconsistent labels and model-readiness issues.",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Approve every change",
    text: "Accept or reject proposed corrections. Important data is never silently rewritten.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Export with evidence",
    text: "Download clean data together with scores, warnings, validations and a complete change log.",
  },
];

const beforeRows = [
  ["C-101", " Anika Rao ", "₹72,000", "HYD"],
  ["C-102", "Rahul", "N/A", "Hyderabad"],
  ["C-102", "Rahul", "N/A", "hyderabad"],
];

const afterRows = [
  ["C-101", "Anika Rao", "72000", "Hyderabad"],
  ["C-102", "Rahul", "", "Hyderabad"],
];

function ProductTable({ clean = false }: { clean?: boolean }) {
  const rows = clean ? afterRows : beforeRows;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/70">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-medium text-white/80">
          <span className={`h-2 w-2 rounded-full ${clean ? "bg-emerald-400" : "bg-amber-400"}`} />
          {clean ? "Ready for analysis" : "customer_upload.csv"}
        </div>
        <span className="font-mono text-[10px] text-white/45">{rows.length} rows shown</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[470px] text-left text-xs">
          <thead className="bg-white/[0.035] text-white/45">
            <tr>
              {["customer_id", "name", "salary", "city"].map((item) => (
                <th key={item} className="px-4 py-2.5 font-mono font-medium">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-white/75">
            {rows.map((row, index) => (
              <tr key={`${row.join("-")}-${index}`}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className={`px-4 py-3 font-mono ${
                      !clean && (cell === "N/A" || cell === "hyderabad" || index === 2)
                        ? "bg-amber-400/[0.07] text-amber-200"
                        : ""
                    }`}
                  >
                    {cell || <span className="text-white/30">null</span>}
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

function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-border bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 opacity-80 [background-image:radial-gradient(circle_at_14%_16%,rgba(34,211,238,.14),transparent_31%),radial-gradient(circle_at_86%_28%,rgba(59,130,246,.16),transparent_29%),linear-gradient(rgba(255,255,255,.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.028)_1px,transparent_1px)] [background-size:auto,auto,44px_44px,44px_44px]" />
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              EazyDataFix Studio · Public product preview
            </div>
            <h1 className="mt-7 max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl lg:leading-[1.04]">
              Messy files in.
              <span className="block text-cyan-300">Decision-ready data out.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Clean, validate and prepare CSV or Excel data for analysis, machine learning and Power
              BI. Preview every proposed change before anything is applied.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/studio"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Open Data Studio <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
              >
                View launch pricing
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> Deterministic by default
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClipboardCheck className="h-3.5 w-3.5 text-cyan-300" /> Complete change log
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LockKeyhole className="h-3.5 w-3.5 text-cyan-300" /> AI does not control fixes
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
            <div className="rounded-2xl border border-white/12 bg-white/[0.055] p-3 shadow-2xl shadow-black/30 backdrop-blur sm:p-5">
              <div className="mb-4 flex items-center justify-between px-1">
                <div>
                  <div className="text-sm font-semibold">Analysis Ready workflow</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Transparent preview · no black box
                  </div>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-200">
                  90 → 100
                </div>
              </div>
              <ProductTable />
              <div className="my-3 flex items-center gap-3 px-2 text-xs text-slate-400">
                <div className="h-px flex-1 bg-white/10" />
                <WandSparkles className="h-3.5 w-3.5 text-cyan-300" />
                6 reviewable changes
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <ProductTable clean />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/25">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-6 sm:grid-cols-4 sm:px-6">
          {[
            ["v1.4.0", "Production engine"],
            ["3.10–3.13", "Python verified"],
            ["CSV · Excel", "Practical inputs"],
            ["MIT", "Open-source core"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-4 text-center">
              <div className="font-mono text-lg font-semibold">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              One engine · three outcomes
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Prepare data for the work you are actually doing.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Generic cleaning is not enough. EazyDataFix applies different readiness checks for
              analysis, supervised machine learning and Power BI models.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {profiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <article
                  key={profile.label}
                  className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-accent/55 hover:shadow-xl hover:shadow-accent/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {profile.label}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{profile.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {profile.description}
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {profile.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-accent" /> {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">
                From upload to evidence
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                A workflow people can trust, not an “auto-fix” button.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                EazyDataFix is designed around inspection. The customer sees the problem, the
                proposed action and the resulting dataset before exporting anything.
              </p>
              <Link
                to="/studio"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Try the workflow <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-cyan-300" />
                      <span className="font-mono text-xs text-white/35">{step.number}</span>
                    </div>
                    <h3 className="mt-5 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
              <ShieldCheck className="h-3.5 w-3.5" /> Trust is a product feature
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Deterministic first. AI optional and accountable.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Cleaning decisions come from reproducible rules—not a model guessing what your data
              should mean. Optional AI can explain evidence after the deterministic workflow, but it
              does not secretly rewrite source values.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Preview before applying",
                "Protect identifiers and leading zeroes",
                "Document every transformation",
                "Keep the open-source engine inspectable",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background">
                <Code2 className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold">Built on an open-source Python engine</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Use the Studio or own the code path.
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-border bg-background p-4">
              <InstallChip />
              <pre className="mt-5 overflow-x-auto text-xs leading-6 text-muted-foreground">
                <code>{`import eazydatafix as edf\n\nresult = edf.powerbi_ready({\n    "sales": "sales.csv",\n    "customers": "customers.csv",\n})\n\nresult.save("powerbi_output")`}</code>
              </pre>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/docs"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
              >
                Developer documentation <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/suneelprojects/eazydatafix"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <Layers3 className="mx-auto h-8 w-8 text-accent" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Start with the file that is wasting your time today.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            The public Studio preview runs locally in your browser and demonstrates the complete
            review workflow. Assisted team pilots add repeatable recipes and business-specific
            rules.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/studio"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background"
            >
              Try Data Studio <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-medium"
            >
              Compare launch plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
