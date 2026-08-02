// Server-only logic for fetching + normalizing EazyDataFix adoption metrics.
export const PACKAGE = "eazydatafix";
export const GITHUB_REPO = "suneelprojects/eazydatafix";

export type DailyPoint = { day: string; downloads: number };
export type Slice = { name: string; downloads: number };

export type AnalyticsPayload = {
  package: string;
  totalDownloads: number;
  last24h: number;
  last7d: number;
  last30d: number;
  githubStars: number | null;
  githubForks: number | null;
  githubOpenIssues: number | null;
  githubCreatedAt: string | null;
  latestVersion: string | null;
  releaseDate: string | null;
  pythonVersions: Slice[];
  operatingSystems: Slice[];
  daily: DailyPoint[];
  refreshedAt: string;
};

type PypiStatsRow = { date?: string; category?: string; downloads?: number };

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "eazydatafix-website-analytics",
      },
    });
    if (!res.ok) {
      console.error(`[analytics] ${url} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[analytics] fetch failed for ${url}`, err);
    return null;
  }
}

function sumByCategory(rows: PypiStatsRow[] | undefined, sinceDays: number): Slice[] {
  if (!rows?.length) return [];
  const cutoff = new Date(Date.now() - sinceDays * 86400000).toISOString().slice(0, 10);
  const acc = new Map<string, number>();
  for (const row of rows) {
    if (row.date && row.date < cutoff) continue;
    const name = row.category && row.category !== "null" ? row.category : "unknown";
    acc.set(name, (acc.get(name) ?? 0) + (row.downloads ?? 0));
  }
  return [...acc.entries()]
    .map(([name, downloads]) => ({ name, downloads }))
    .filter((s) => s.downloads > 0)
    .sort((a, b) => b.downloads - a.downloads);
}

/** Fetch upstream sources, persist daily history, and cache a normalized snapshot. */
export async function refreshPackageAnalytics() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [recent, overall, pythonMinor, system, github, pypi] = await Promise.all([
    getJson<{ data?: { last_day?: number; last_week?: number; last_month?: number } }>(
      `https://pypistats.org/api/packages/${PACKAGE}/recent`,
    ),
    getJson<{ data?: PypiStatsRow[] }>(
      `https://pypistats.org/api/packages/${PACKAGE}/overall?mirrors=false`,
    ),
    getJson<{ data?: PypiStatsRow[] }>(`https://pypistats.org/api/packages/${PACKAGE}/python_minor`),
    getJson<{ data?: PypiStatsRow[] }>(`https://pypistats.org/api/packages/${PACKAGE}/system`),
    getJson<{
      stargazers_count?: number;
      forks_count?: number;
      open_issues_count?: number;
      created_at?: string;
    }>(`https://api.github.com/repos/${GITHUB_REPO}`),
    getJson<{ info?: { version?: string }; urls?: { upload_time_iso_8601?: string }[] }>(
      `https://pypi.org/pypi/${PACKAGE}/json`,
    ),
  ]);

  // Persist the 180-day window permanently so history survives the API's rolling window.
  const perDay = new Map<string, number>();
  for (const row of overall?.data ?? []) {
    if (!row.date) continue;
    perDay.set(row.date, (perDay.get(row.date) ?? 0) + (row.downloads ?? 0));
  }
  if (perDay.size > 0) {
    const rows = [...perDay.entries()].map(([day, downloads]) => ({
      package: PACKAGE,
      day,
      downloads,
      recorded_at: new Date().toISOString(),
    }));
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await supabaseAdmin
        .from("package_download_daily")
        .upsert(rows.slice(i, i + 500), { onConflict: "package,day" });
      if (error) console.error("[analytics] daily upsert failed", error);
    }
  }

  // Full history (including days older than the 180-day window) from our own store.
  const { data: history, error: historyError } = await supabaseAdmin
    .from("package_download_daily")
    .select("day, downloads")
    .eq("package", PACKAGE)
    .order("day", { ascending: true })
    .limit(5000);
  if (historyError) console.error("[analytics] history read failed", historyError);

  const daily: DailyPoint[] = (history ?? []).map((r) => ({
    day: r.day as string,
    downloads: Number(r.downloads ?? 0),
  }));
  const totalDownloads = daily.reduce((sum, d) => sum + d.downloads, 0);

  const payload: AnalyticsPayload = {
    package: PACKAGE,
    totalDownloads,
    last24h: recent?.data?.last_day ?? 0,
    last7d: recent?.data?.last_week ?? 0,
    last30d: recent?.data?.last_month ?? 0,
    githubStars: github?.stargazers_count ?? null,
    githubForks: github?.forks_count ?? null,
    githubOpenIssues: github?.open_issues_count ?? null,
    githubCreatedAt: github?.created_at ?? null,
    latestVersion: pypi?.info?.version ?? null,
    releaseDate: pypi?.urls?.[0]?.upload_time_iso_8601 ?? null,
    pythonVersions: sumByCategory(pythonMinor?.data, 180),
    operatingSystems: sumByCategory(system?.data, 180),
    daily,
    refreshedAt: new Date().toISOString(),
  };

  const { error: cacheError } = await supabaseAdmin.from("package_analytics_cache").upsert(
    {
      package: PACKAGE,
      data: payload as unknown as Record<string, unknown>,
      refreshed_at: payload.refreshedAt,
    },
    { onConflict: "package" },
  );
  if (cacheError) {
    console.error("[analytics] cache upsert failed", cacheError);
    throw new Error("Failed to cache analytics");
  }

  return payload;
}

/** Read the cached snapshot only — never calls external APIs. */
export async function readCachedAnalytics(): Promise<AnalyticsPayload | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("package_analytics_cache")
    .select("data, refreshed_at")
    .eq("package", PACKAGE)
    .maybeSingle();
  if (error) {
    console.error("[analytics] cache read failed", error);
    return null;
  }
  if (!data?.data) return null;
  return data.data as unknown as AnalyticsPayload;
}
