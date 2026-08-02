import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Download,
  GitFork,
  Github,
  Package,
  RefreshCw,
  Star,
  Clock,
} from "lucide-react";
import { getPackageAnalytics, type AnalyticsPayload } from "@/lib/package-analytics.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Community Analytics — EazyDataFix Adoption Metrics" },
      {
        name: "description",
        content:
          "Real EazyDataFix adoption metrics: PyPI downloads over time, Python version and operating system distribution, GitHub stars and forks, and the latest published release.",
      },
      { property: "og:title", content: "Community Analytics — EazyDataFix Adoption Metrics" },
      {
        property: "og:description",
        content:
          "Live PyPI download trends, Python and OS distribution, and GitHub growth for the EazyDataFix open-source Python library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
  errorComponent: () => <ErrorState message="The analytics page failed to load." />,
});

const RANGES = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "180 days", value: 180 },
] as const;

const DONUT_COLORS = [
  "hsl(var(--chart-1, 173 58% 39%))",
  "hsl(var(--chart-2, 197 37% 44%))",
  "hsl(var(--chart-3, 43 74% 49%))",
  "hsl(var(--chart-4, 27 87% 57%))",
  "hsl(var(--chart-5, 340 55% 55%))",
];

const nf = new Intl.NumberFormat("en-US");

function fmt(n: number | null | undefined) {
  return typeof n === "number" ? nf.format(n) : "—";
}

function AnalyticsPage() {
  const fetchAnalytics = useServerFn(getPackageAnalytics);
  const { data, isPending, isError } = useQuery({
    queryKey: ["package-analytics"],
    queryFn: () => fetchAnalytics(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Community
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Community Analytics
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Real adoption metrics for EazyDataFix, collected from PyPI, PyPIStats and GitHub, cached
          server-side and refreshed on a schedule. Nothing on this page is estimated or simulated.
        </p>
      </header>

      {isPending ? (
        <LoadingSkeleton />
      ) : isError || !data ? (
        <ErrorState message="Analytics data isn't available yet. The metrics cache is refreshed periodically — please check back shortly." />
      ) : (
        <AnalyticsContent data={data} />
      )}

      <Footnote />
    </div>
  );
}

function AnalyticsContent({ data }: { data: AnalyticsPayload }) {
  const [range, setRange] = useState<number>(30);

  const series = useMemo(() => {
    const cutoff = new Date(Date.now() - range * 86400000).toISOString().slice(0, 10);
    return data.daily
      .filter((d) => d.day >= cutoff)
      .map((d) => ({
        day: d.day,
        label: new Date(d.day + "T00:00:00Z").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        downloads: d.downloads,
      }));
  }, [data.daily, range]);

  const pythonRows = useMemo(
    () => data.pythonVersions.slice(0, 8).map((s) => ({ name: s.name, downloads: s.downloads })),
    [data.pythonVersions],
  );
  const osRows = useMemo(
    () => data.operatingSystems.slice(0, 5).map((s) => ({ name: s.name, downloads: s.downloads })),
    [data.operatingSystems],
  );

  const refreshed = data.refreshedAt
    ? new Date(data.refreshedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }) + " UTC"
    : "—";

  return (
    <>
      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={Download} label="Downloads since launch" value={fmt(data.totalDownloads)} />
        <Stat icon={Clock} label="Last 24 hours" value={fmt(data.last24h)} />
        <Stat icon={Clock} label="Last 7 days" value={fmt(data.last7d)} />
        <Stat icon={Clock} label="Last 30 days" value={fmt(data.last30d)} />
        <Stat icon={Star} label="GitHub stars" value={fmt(data.githubStars)} />
        <Stat icon={GitFork} label="GitHub forks" value={fmt(data.githubForks)} />
        <Stat
          icon={Package}
          label="Latest PyPI version"
          value={data.latestVersion ? `v${data.latestVersion}` : "—"}
        />
        <Stat icon={RefreshCw} label="Last updated" value={refreshed} small />
      </section>

      <section className="mt-10 rounded-lg border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Daily downloads</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              PyPI downloads per day, known mirrors excluded.
            </p>
          </div>
          <div
            role="group"
            aria-label="Select time range for daily downloads"
            className="inline-flex rounded-md border border-border p-0.5"
          >
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                aria-pressed={range === r.value}
                className={cn(
                  "rounded px-3 py-1.5 text-xs font-medium transition-colors",
                  range === r.value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <figure className="mt-5">
          <figcaption className="sr-only">
            Area chart of daily EazyDataFix PyPI downloads over the last {range} days
          </figcaption>
          {series.length === 0 ? (
            <EmptyChart label="No download history recorded for this range yet." />
          ) : (
            <div className="h-[260px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dlFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    minTickGap={24}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [nf.format(v), "Downloads"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    name="Downloads"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#dlFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </figure>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <h2 className="text-base font-semibold">Python version distribution</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Downloads by Python minor version, last 180 days.
          </p>
          <figure className="mt-4">
            <figcaption className="sr-only">
              Horizontal bar chart of EazyDataFix downloads by Python minor version
            </figcaption>
            {pythonRows.length === 0 ? (
              <EmptyChart label="No Python version data available." />
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={pythonRows}
                    margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={64}
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [nf.format(v), "Downloads"]}
                    />
                    <Bar
                      dataKey="downloads"
                      name="Downloads"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </figure>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <h2 className="text-base font-semibold">Operating system distribution</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Downloads by reported OS, last 180 days.
          </p>
          <figure className="mt-4">
            <figcaption className="sr-only">
              Donut chart of EazyDataFix downloads by operating system
            </figcaption>
            {osRows.length === 0 ? (
              <EmptyChart label="No operating system data available." />
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={osRows}
                      dataKey="downloads"
                      nameKey="name"
                      innerRadius="55%"
                      outerRadius="80%"
                      paddingAngle={2}
                      stroke="hsl(var(--card))"
                    >
                      {osRows.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={28}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number, n: string) => [nf.format(v), n]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </figure>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-card p-4 sm:p-6">
        <h2 className="text-base font-semibold">Project growth</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Current GitHub repository signals for {data.package}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={Star} label="Stars" value={fmt(data.githubStars)} />
          <Stat icon={GitFork} label="Forks" value={fmt(data.githubForks)} />
          <Stat icon={AlertTriangle} label="Open issues" value={fmt(data.githubOpenIssues)} />
          <Stat
            icon={Github}
            label="Repository created"
            value={
              data.githubCreatedAt
                ? new Date(data.githubCreatedAt).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })
                : "—"
            }
            small
          />
        </div>
      </section>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  small,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <div
        className={cn(
          "mt-2 font-mono font-semibold tabular-nums",
          small ? "text-sm" : "text-xl sm:text-2xl",
        )}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
      {label}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-6" aria-busy="true" aria-label="Loading analytics">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[92px] rounded-lg border border-border bg-muted/40" />
        ))}
      </div>
      <div className="h-[360px] rounded-lg border border-border bg-muted/40" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[340px] rounded-lg border border-border bg-muted/40" />
        <div className="h-[340px] rounded-lg border border-border bg-muted/40" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-8 flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-5"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <div className="text-sm font-medium">Analytics unavailable</div>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

function Footnote() {
  return (
    <footer className="mt-10 rounded-lg border border-border bg-muted/20 p-5 text-xs leading-relaxed text-muted-foreground">
      <p>
        PyPI downloads include installations, upgrades, CI activity and reinstalls. They should not
        be interpreted as unique users. Known mirror downloads are excluded.
      </p>
      <p className="mt-3">
        Sources:{" "}
        <a
          href="https://pypi.org/project/eazydatafix/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          EazyDataFix on PyPI
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/suneelprojects/eazydatafix"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          EazyDataFix on GitHub
        </a>{" "}
        ·{" "}
        <a
          href="https://pypistats.org/packages/eazydatafix"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          PyPIStats
        </a>
      </p>
    </footer>
  );
}
