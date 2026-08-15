import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Archive,
  ArrowUpRight,
  Bot,
  CalendarClock,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Edit3,
  FileCheck2,
  FileText,
  Gauge,
  Loader2,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ArticleMarkdown } from "@/components/ArticleMarkdown";
import { supabase } from "@/integrations/supabase/client";
import {
  changeContentArticleStatus,
  generateContentDrafts,
  getContentStudioDashboard,
  saveContentArticle,
} from "@/lib/content-studio.functions";
import type {
  ArticleStatus,
  ContentArticle,
  ContentArticleInput,
  ContentStudioDashboard,
  ContentType,
  SearchIntent,
} from "@/lib/content-studio.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/content-studio")({
  head: () => ({
    meta: [
      { title: "Content Studio — EazyDataFix Admin" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { name: "description", content: "Private EazyDataFix editorial workspace." },
    ],
  }),
  component: ContentStudioRoute,
});

function messageFrom(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function ContentStudioRoute() {
  const [authReady, setAuthReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUserEmail(data.session?.user.email ?? null);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
      setAuthReady(true);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (!authReady) return <FullPageLoading label="Checking secure access…" />;
  if (!userEmail) return <AdminSignIn />;
  return <ContentStudioApp userEmail={userEmail} />;
}

function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin/content-studio` },
    });
    setSending(false);
    if (authError) setError(authError.message);
    else setSent(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_35%),radial-gradient(circle_at_85%_75%,color-mix(in_oklab,var(--color-accent)_10%,transparent),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-accent/5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-foreground p-8 text-background sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-1.5 font-mono text-xs text-background/75">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin only
          </div>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
            EazyDataFix Content Studio
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-background/70 sm:text-base">
            Plan, generate, review and publish practical data-analysis content from one controlled
            editorial workspace.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              [Sparkles, "Two AI drafts daily"],
              [Gauge, "Deterministic SEO checks"],
              [FileCheck2, "Human approval gate"],
              [CalendarClock, "Scheduled publishing"],
            ].map(([Icon, label]) => (
              <div
                key={label as string}
                className="flex items-center gap-3 rounded-xl border border-background/15 bg-background/5 px-4 py-3 text-sm"
              >
                <Icon className="h-4 w-4 text-background/70" /> {label as string}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center p-8 sm:p-12">
          <div className="w-full">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Secure access
            </div>
            <h2 className="mt-3 text-2xl font-semibold">Sign in with your approved email</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We’ll send a secure sign-in link. Accounts outside the server-side admin allow-list
              cannot access content.
            </p>
            {sent ? (
              <div className="mt-7 rounded-xl border border-accent/30 bg-accent/10 p-5">
                <Mail className="h-5 w-5 text-accent" />
                <div className="mt-3 font-medium">Check your inbox</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open the link sent to {email}. You can close this tab afterward.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-4 text-sm font-medium text-accent"
                >
                  Use another email
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-7">
                <label htmlFor="admin-email" className="text-sm font-medium">
                  Email address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
                <button
                  disabled={sending}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background disabled:opacity-60"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send secure sign-in link
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentStudioApp({ userEmail }: { userEmail: string }) {
  const queryClient = useQueryClient();
  const fetchDashboard = useServerFn(getContentStudioDashboard);
  const generate = useServerFn(generateContentDrafts);
  const changeStatus = useServerFn(changeContentArticleStatus);
  const [topic, setTopic] = useState("");
  const [editing, setEditing] = useState<ContentArticle | null>(null);
  const [scheduling, setScheduling] = useState<ContentArticle | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ArticleStatus>("all");

  const dashboard = useQuery({
    queryKey: ["content-studio-dashboard"],
    queryFn: () => fetchDashboard(),
    retry: false,
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["content-studio-dashboard"] });

  const generationMutation = useMutation({
    mutationFn: () => generate({ data: { count: 2, topic: topic.trim() || undefined } }),
    onSuccess: (result) => {
      toast.success(
        `${result.created} draft${result.created === 1 ? "" : "s"} generated for review.`,
      );
      setTopic("");
      refresh();
    },
    onError: (error) => toast.error(messageFrom(error)),
  });

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: ArticleStatus; scheduledAt?: string | null }) =>
      changeStatus({ data: input }),
    onSuccess: (article) => {
      toast.success(`Article moved to ${article.status}.`);
      setScheduling(null);
      refresh();
    },
    onError: (error) => toast.error(messageFrom(error)),
  });

  const articles = useMemo(() => {
    const value = dashboard.data?.articles ?? [];
    const needle = search.toLowerCase().trim();
    return value.filter((article) => {
      if (status !== "all" && article.status !== status) return false;
      if (!needle) return true;
      return [article.title, article.primary_keyword, article.pillar, article.content_type]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [dashboard.data?.articles, search, status]);

  if (dashboard.isPending) return <FullPageLoading label="Loading the editorial workspace…" />;
  if (dashboard.isError || !dashboard.data) {
    return <AccessError message={messageFrom(dashboard.error)} userEmail={userEmail} />;
  }

  const data = dashboard.data;
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <Bot className="h-4 w-4" /> Private editorial workspace
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Content Studio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate two drafts, improve them with evidence, then approve publication.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/blog"
              target="_blank"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              View blog <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => refresh()}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm hover:bg-muted"
            >
              <RefreshCw className={cn("h-4 w-4", dashboard.isFetching && "animate-spin")} />{" "}
              Refresh
            </button>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        <Stats dashboard={data} />

        <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-accent" /> Generate today’s drafts
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  One educational article and one product-led tutorial. Both remain drafts until you
                  approve them.
                </p>
              </div>
              <div
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium",
                  data.settings.automationReady
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                )}
              >
                {data.settings.automationReady ? "Automation ready" : "Secrets required"}
              </div>
            </div>
            <textarea
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Optional editorial direction, for example: mixed date formats in sales data…"
              className="mt-5 min-h-24 w-full resize-y rounded-xl border border-input bg-background p-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Model: <span className="font-mono text-foreground">{data.settings.model}</span> ·
                Prompt: {data.settings.promptVersion}
              </p>
              <button
                type="button"
                disabled={generationMutation.isPending}
                onClick={() => generationMutation.mutate()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background disabled:opacity-60"
              >
                {generationMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generationMutation.isPending ? "Writing two drafts…" : "Generate two drafts"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Settings2 className="h-4 w-4 text-accent" /> Editorial guardrails
            </div>
            <div className="mt-4 space-y-3 text-xs">
              {[
                "No unsupported speed or time claims",
                "Only verified EazyDataFix API names",
                "SEO score ≥70 before publication",
                "Quality score ≥80 before publication",
                "Human review remains mandatory",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Editorial queue</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Edit, review, schedule and publish from a single queue.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search articles"
                  className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-accent sm:w-56"
                />
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as "all" | ArticleStatus)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-accent"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          {articles.length > 0 ? (
            <div className="divide-y divide-border">
              {articles.map((article) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  busy={statusMutation.isPending}
                  onEdit={() => setEditing(article)}
                  onReview={() => statusMutation.mutate({ id: article.id, status: "review" })}
                  onPublish={() => statusMutation.mutate({ id: article.id, status: "published" })}
                  onSchedule={() => setScheduling(article)}
                  onArchive={() => statusMutation.mutate({ id: article.id, status: "archived" })}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-16 text-center">
              <FileText className="mx-auto h-7 w-7 text-muted-foreground" />
              <div className="mt-3 text-sm font-medium">No articles match this view</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Generate today’s drafts or clear the current filters.
              </p>
            </div>
          )}
        </section>

        <RecentRuns runs={data.recentRuns} />
      </div>

      {editing && (
        <ArticleEditor
          article={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
      {scheduling && (
        <ScheduleDialog
          article={scheduling}
          busy={statusMutation.isPending}
          onClose={() => setScheduling(null)}
          onSchedule={(scheduledAt) =>
            statusMutation.mutate({ id: scheduling.id, status: "scheduled", scheduledAt })
          }
        />
      )}
    </div>
  );
}

function Stats({ dashboard }: { dashboard: ContentStudioDashboard }) {
  const cards = [
    [FileText, "All content", dashboard.stats.total, "Complete library"],
    [Edit3, "Needs work", dashboard.stats.draft + dashboard.stats.review, "Drafts and review"],
    [CalendarClock, "Scheduled", dashboard.stats.scheduled, "Ready to publish"],
    [Rocket, "Published", dashboard.stats.published, "Visible on the blog"],
    [Gauge, "Average SEO", dashboard.stats.averageSeoScore || "—", "Published articles"],
  ] as const;
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map(([Icon, label, value, helper]) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <Icon className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight">
            {value}
            {label === "Average SEO" && value !== "—" ? "/100" : ""}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">{helper}</div>
        </div>
      ))}
    </section>
  );
}

const statusStyles: Record<ArticleStatus, string> = {
  draft: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  review: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  archived: "bg-muted text-muted-foreground",
};

function ArticleRow({
  article,
  busy,
  onEdit,
  onReview,
  onPublish,
  onSchedule,
  onArchive,
}: {
  article: ContentArticle;
  busy: boolean;
  onEdit: () => void;
  onReview: () => void;
  onPublish: () => void;
  onSchedule: () => void;
  onArchive: () => void;
}) {
  const canPublish = article.seo_score >= 70 && article.quality_score >= 80;
  return (
    <div className="p-5 transition-colors hover:bg-muted/20">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px_250px] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
                statusStyles[article.status],
              )}
            >
              {article.status}
            </span>
            <span className="text-[11px] capitalize text-muted-foreground">
              {article.content_type.replace("_", " ")} · {article.pillar}
            </span>
          </div>
          <h3 className="mt-3 truncate text-sm font-semibold sm:text-base">{article.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {article.excerpt}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground">
            <span>/{article.slug}</span>
            <span>{article.primary_keyword}</span>
            <span>Updated {new Date(article.updated_at).toLocaleDateString("en-IN")}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Score label="SEO" value={article.seo_score} ready={article.seo_score >= 70} />
          <Score
            label="Quality"
            value={article.quality_score}
            ready={article.quality_score >= 80}
          />
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium hover:bg-muted"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          {article.status === "draft" && (
            <button
              type="button"
              disabled={busy}
              onClick={onReview}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium hover:bg-muted"
            >
              <FileCheck2 className="h-3.5 w-3.5" /> Review
            </button>
          )}
          {article.status !== "published" && article.status !== "archived" && (
            <>
              <button
                type="button"
                disabled={busy || !canPublish}
                onClick={onSchedule}
                title={!canPublish ? "SEO 70 and Quality 80 required" : "Schedule publication"}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CalendarClock className="h-3.5 w-3.5" /> Schedule
              </button>
              <button
                type="button"
                disabled={busy || !canPublish}
                onClick={onPublish}
                title={!canPublish ? "SEO 70 and Quality 80 required" : "Publish now"}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-xs font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Rocket className="h-3.5 w-3.5" /> Publish
              </button>
            </>
          )}
          {article.status !== "archived" && (
            <button
              type="button"
              disabled={busy}
              onClick={onArchive}
              aria-label={`Archive ${article.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Score({ label, value, ready }: { label: string; value: number; ready: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-1 font-mono text-lg font-semibold",
          ready ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function RecentRuns({ runs }: { runs: ContentStudioDashboard["recentRuns"] }) {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Clock3 className="h-4 w-4 text-accent" /> Recent generation runs
      </div>
      <div className="mt-4 grid gap-2 lg:grid-cols-2">
        {runs.length > 0 ? (
          runs.map((run) => (
            <div
              key={run.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium capitalize">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      run.status === "completed"
                        ? "bg-emerald-500"
                        : run.status === "failed"
                          ? "bg-destructive"
                          : "bg-amber-500",
                    )}
                  />
                  {run.run_type} · {run.status}
                </div>
                <div className="mt-1 truncate text-[11px] text-muted-foreground">
                  {new Date(run.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} ·{" "}
                  {run.model}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-semibold">{run.article_count}</div>
                <div className="text-[10px] text-muted-foreground">drafts</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            Generation history will appear after the first run.
          </p>
        )}
      </div>
    </section>
  );
}

function ArticleEditor({
  article,
  onClose,
  onSaved,
}: {
  article: ContentArticle;
  onClose: () => void;
  onSaved: () => void;
}) {
  const save = useServerFn(saveContentArticle);
  const [tab, setTab] = useState<"content" | "seo" | "quality" | "preview">("content");
  const [draft, setDraft] = useState<ContentArticleInput>(() => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    content_type: article.content_type,
    pillar: article.pillar,
    primary_keyword: article.primary_keyword,
    secondary_keywords: article.secondary_keywords,
    search_intent: article.search_intent,
    excerpt: article.excerpt,
    content_markdown: article.content_markdown,
    meta_title: article.meta_title,
    meta_description: article.meta_description,
    canonical_url: article.canonical_url,
    og_title: article.og_title,
    og_description: article.og_description,
    faq: article.faq,
    internal_links: article.internal_links,
    image_prompt: article.image_prompt,
    image_alt: article.image_alt,
    cta_text: article.cta_text,
    cta_url: article.cta_url,
    source_items: article.source_items,
  }));
  const mutation = useMutation({
    mutationFn: () => save({ data: draft }),
    onSuccess: () => {
      toast.success("Article saved and rescored.");
      onSaved();
    },
    onError: (error) => toast.error(messageFrom(error)),
  });
  const set = <K extends keyof ContentArticleInput>(key: K, value: ContentArticleInput[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/55 p-0 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-title"
    >
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden bg-background shadow-2xl sm:h-[calc(100vh-2rem)] sm:rounded-2xl sm:border sm:border-border">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-wider text-accent">
              Article editor
            </div>
            <h2 id="editor-title" className="truncate text-sm font-semibold sm:text-base">
              {article.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background disabled:opacity-60"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}{" "}
              Save & score
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close editor"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 sm:px-6">
          {(["content", "seo", "quality", "preview"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium capitalize",
                tab === value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === "content" && <ContentFields draft={draft} set={set} />}
          {tab === "seo" && <SeoFields draft={draft} set={set} />}
          {tab === "quality" && <QualityPanel article={article} />}
          {tab === "preview" && (
            <div className="mx-auto max-w-4xl">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Preview
              </div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">{draft.title}</h1>
              <p className="mt-4 text-lg leading-7 text-muted-foreground">{draft.excerpt}</p>
              <div className="mt-10">
                <ArticleMarkdown markdown={draft.content_markdown} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FieldSetter = <K extends keyof ContentArticleInput>(
  key: K,
  value: ContentArticleInput[K],
) => void;

function ContentFields({ draft, set }: { draft: ContentArticleInput; set: FieldSetter }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <Field label="Title">
          <input
            value={draft.title}
            onChange={(event) => set("title", event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Excerpt">
          <textarea
            value={draft.excerpt}
            onChange={(event) => set("excerpt", event.target.value)}
            className="field-textarea min-h-24"
          />
        </Field>
        <Field
          label="Article body (Markdown)"
          helper="Use H2/H3 headings and verified Python code fences. The page title is already the H1."
        >
          <textarea
            value={draft.content_markdown}
            onChange={(event) => set("content_markdown", event.target.value)}
            className="field-textarea min-h-[520px] font-mono text-xs leading-6"
          />
        </Field>
      </div>
      <div className="space-y-4">
        <Field label="Content type">
          <select
            value={draft.content_type}
            onChange={(event) => set("content_type", event.target.value as ContentType)}
            className="field-input"
          >
            <option value="educational">Educational</option>
            <option value="product_tutorial">Product tutorial</option>
            <option value="case_study">Case study</option>
            <option value="checklist">Checklist</option>
          </select>
        </Field>
        <Field label="Pillar">
          <input
            value={draft.pillar}
            onChange={(event) => set("pillar", event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Search intent">
          <select
            value={draft.search_intent}
            onChange={(event) => set("search_intent", event.target.value as SearchIntent)}
            className="field-input"
          >
            <option value="informational">Informational</option>
            <option value="problem_solving">Problem solving</option>
            <option value="commercial">Commercial</option>
            <option value="navigational">Navigational</option>
          </select>
        </Field>
        <Field label="CTA text">
          <input
            value={draft.cta_text}
            onChange={(event) => set("cta_text", event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="CTA URL">
          <input
            value={draft.cta_url}
            onChange={(event) => set("cta_url", event.target.value)}
            className="field-input font-mono text-xs"
          />
        </Field>
      </div>
    </div>
  );
}

function SeoFields({ draft, set }: { draft: ContentArticleInput; set: FieldSetter }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Primary keyword">
          <input
            value={draft.primary_keyword}
            onChange={(event) => set("primary_keyword", event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Secondary keywords" helper="Comma separated">
          <input
            value={draft.secondary_keywords.join(", ")}
            onChange={(event) =>
              set(
                "secondary_keywords",
                event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            className="field-input"
          />
        </Field>
        <Field label="Slug">
          <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 font-mono text-xs">
            <span className="text-muted-foreground">/blog/</span>
            <input
              value={draft.slug}
              onChange={(event) => set("slug", event.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none"
            />
          </div>
        </Field>
        <Field label={`Meta title · ${draft.meta_title.length}/60`}>
          <input
            value={draft.meta_title}
            onChange={(event) => set("meta_title", event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label={`Meta description · ${draft.meta_description.length}/160`}>
          <textarea
            value={draft.meta_description}
            onChange={(event) => set("meta_description", event.target.value)}
            className="field-textarea min-h-24"
          />
        </Field>
        <Field label="Canonical URL">
          <input
            value={draft.canonical_url ?? ""}
            onChange={(event) => set("canonical_url", event.target.value || null)}
            className="field-input font-mono text-xs"
          />
        </Field>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">Google-style snippet preview</div>
          <div className="mt-4 text-lg text-blue-700 dark:text-blue-400">
            {draft.meta_title || draft.title}
          </div>
          <div className="mt-1 truncate text-xs text-emerald-700 dark:text-emerald-400">
            eazydatafix.com › blog › {draft.slug}
          </div>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">{draft.meta_description}</p>
        </div>
        <Field label="Open Graph title">
          <input
            value={draft.og_title}
            onChange={(event) => set("og_title", event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Open Graph description">
          <textarea
            value={draft.og_description}
            onChange={(event) => set("og_description", event.target.value)}
            className="field-textarea min-h-24"
          />
        </Field>
        <Field label="Internal links" helper="One verified path per line">
          <textarea
            value={draft.internal_links.join("\n")}
            onChange={(event) =>
              set(
                "internal_links",
                event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            className="field-textarea min-h-28 font-mono text-xs"
          />
        </Field>
        <Field label="Image alt text">
          <input
            value={draft.image_alt}
            onChange={(event) => set("image_alt", event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Hero image prompt">
          <textarea
            value={draft.image_prompt}
            onChange={(event) => set("image_prompt", event.target.value)}
            className="field-textarea min-h-28"
          />
        </Field>
      </div>
    </div>
  );
}

function QualityPanel({ article }: { article: ContentArticle }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">SEO score</div>
          <div className="mt-2 text-4xl font-semibold">
            {article.seo_score}
            <span className="text-base text-muted-foreground">/100</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-accent" style={{ width: `${article.seo_score}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">Quality score</div>
          <div className="mt-2 text-4xl font-semibold">
            {article.quality_score}
            <span className="text-base text-muted-foreground">/100</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-emerald-500" style={{ width: `${article.quality_score}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-card px-5">
        {article.quality_checks.map((check) => (
          <div key={check.id} className="flex items-start gap-3 py-4">
            {check.passed ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            )}
            <div>
              <div className="text-sm font-medium">{check.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{check.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Save the article after editing to recalculate both scores.
      </p>
    </div>
  );
}

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium">{label}</span>
      {helper && <span className="ml-2 text-[10px] text-muted-foreground">{helper}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ScheduleDialog({
  article,
  busy,
  onClose,
  onSchedule,
}: {
  article: ContentArticle;
  busy: boolean;
  onClose: () => void;
  onSchedule: (value: string) => void;
}) {
  const initial = new Date(Date.now() + 86400000);
  initial.setMinutes(0, 0, 0);
  const [value, setValue] = useState(initial.toISOString().slice(0, 16));
  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-accent">
              Schedule publication
            </div>
            <h2 className="mt-2 text-lg font-semibold">{article.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-border p-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="mt-6 block text-sm font-medium">
          Date and time <span className="text-muted-foreground">(your local timezone)</span>
          <input
            type="datetime-local"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          The article becomes publicly readable automatically when this time arrives.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-border px-3 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy || !value}
            onClick={() => onSchedule(new Date(value).toISOString())}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarClock className="h-4 w-4" />
            )}{" "}
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

function AccessError({ message, userEmail }: { message: string; userEmail: string }) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl items-center px-4">
      <div className="w-full rounded-2xl border border-border bg-card p-7 text-center">
        <CircleAlert className="mx-auto h-8 w-8 text-amber-500" />
        <h1 className="mt-4 text-xl font-semibold">Content Studio access is unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
        <div className="mt-4 rounded-lg bg-muted p-3 font-mono text-xs text-muted-foreground">
          Signed in as {userEmail}
        </div>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}

function FullPageLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" />
        <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
