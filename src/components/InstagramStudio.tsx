import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  Archive,
  CalendarClock,
  Check,
  CircleAlert,
  Clock3,
  Edit3,
  ExternalLink,
  Gauge,
  ImageIcon,
  Instagram,
  Loader2,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  changeInstagramPostStatus,
  checkInstagramConnection,
  generateInstagramPostDraft,
  getInstagramStudioDashboard,
  publishInstagramPostNow,
  regenerateInstagramPostImage,
  saveInstagramPostDraft,
} from "@/lib/instagram-studio.functions";
import type {
  InstagramDashboard,
  InstagramPost,
  InstagramPostInput,
  InstagramPostStatus,
} from "@/lib/instagram-studio.types";
import { cn } from "@/lib/utils";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function InstagramStudio() {
  const queryClient = useQueryClient();
  const getDashboard = useServerFn(getInstagramStudioDashboard);
  const generate = useServerFn(generateInstagramPostDraft);
  const changeStatus = useServerFn(changeInstagramPostStatus);
  const publish = useServerFn(publishInstagramPostNow);
  const regenerate = useServerFn(regenerateInstagramPostImage);
  const verify = useServerFn(checkInstagramConnection);
  const [topic, setTopic] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | InstagramPostStatus>("all");
  const [editing, setEditing] = useState<InstagramPost | null>(null);
  const [scheduling, setScheduling] = useState<InstagramPost | null>(null);

  const dashboard = useQuery({
    queryKey: ["instagram-studio-dashboard"],
    queryFn: () => getDashboard(),
    retry: false,
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["instagram-studio-dashboard"] });

  const generationMutation = useMutation({
    mutationFn: () => generate({ data: { topic: topic.trim() || undefined } }),
    onSuccess: () => {
      toast.success("Instagram copy and image generated as a draft.");
      setTopic("");
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: InstagramPostStatus; scheduledAt?: string | null }) =>
      changeStatus({ data: input }),
    onSuccess: (post) => {
      toast.success(`Instagram post moved to ${post.status}.`);
      setScheduling(null);
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const publishMutation = useMutation({
    mutationFn: (id: string) => publish({ data: { id } }),
    onSuccess: (post) => {
      toast.success(`Published to @${dashboard.data?.connection.username ?? "Instagram"}.`);
      if (post.instagram_permalink)
        window.open(post.instagram_permalink, "_blank", "noopener,noreferrer");
      refresh();
    },
    onError: (error) => {
      toast.error(errorMessage(error));
      refresh();
    },
  });
  const regenerateMutation = useMutation({
    mutationFn: (id: string) => regenerate({ data: { id } }),
    onSuccess: () => {
      toast.success("A new Instagram image was generated. Review it again.");
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const verifyMutation = useMutation({
    mutationFn: () => verify(),
    onSuccess: (connection) => {
      if (connection.connected) toast.success(`Connected to @${connection.username}.`);
      else toast.error(connection.lastError || "Instagram connection could not be verified.");
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const posts = useMemo(() => {
    const needle = search.toLowerCase().trim();
    return (dashboard.data?.posts ?? []).filter((post) => {
      if (status !== "all" && post.status !== status) return false;
      if (!needle) return true;
      return [post.hook, post.caption, post.pillar, ...post.hashtags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [dashboard.data?.posts, search, status]);

  if (dashboard.isPending) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Instagram Studio…
      </div>
    );
  }
  if (dashboard.isError || !dashboard.data) {
    return (
      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-7 text-center">
        <CircleAlert className="mx-auto h-7 w-7 text-amber-500" />
        <h2 className="mt-3 font-semibold">Instagram Studio is not ready</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {errorMessage(dashboard.error)}
        </p>
      </div>
    );
  }

  const data = dashboard.data;
  const busy =
    generationMutation.isPending ||
    statusMutation.isPending ||
    publishMutation.isPending ||
    regenerateMutation.isPending;
  return (
    <>
      <InstagramStats dashboard={data} />

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-pink-500" /> Generate one Instagram draft
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                AI rotates education, tips, memes, quotes, community and occasional product content,
                then creates a branded 4:5 poster. Nothing publishes without your approval.
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                data.settings.automationReady
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
              )}
            >
              {data.settings.automationReady ? "Automation ready" : "Setup incomplete"}
            </span>
          </div>
          <textarea
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Optional direction, for example: why dry-run data cleaning prevents silent mistakes…"
            className="mt-5 min-h-24 w-full resize-y rounded-xl border border-input bg-background p-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15"
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Copy: <span className="font-mono text-foreground">{data.settings.contentModel}</span>{" "}
              · Image: <span className="font-mono text-foreground">{data.settings.imageModel}</span>
            </p>
            <button
              type="button"
              disabled={generationMutation.isPending || !data.settings.automationReady}
              onClick={() => generationMutation.mutate()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-500 px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              {generationMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Instagram className="h-4 w-4" />
              )}
              {generationMutation.isPending
                ? "Creating copy and image…"
                : "Generate Instagram draft"}
            </button>
          </div>
        </div>

        <ConnectionCard
          dashboard={data}
          busy={verifyMutation.isPending}
          onVerify={() => verifyMutation.mutate()}
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Instagram className="h-5 w-5 text-pink-500" /> Instagram queue
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Edit → approve → schedule or publish. Scheduled posts are checked every 30 minutes.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Instagram posts"
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-pink-500 sm:w-60"
              />
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | InstagramPostStatus)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-pink-500"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="scheduled">Scheduled</option>
              <option value="publishing">Publishing</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
              <option value="archived">Archived</option>
            </select>
            <button
              type="button"
              onClick={() => refresh()}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm"
            >
              <RefreshCw className={cn("h-4 w-4", dashboard.isFetching && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>
        {posts.length ? (
          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <InstagramPostCard
                key={post.id}
                post={post}
                busy={busy}
                onEdit={() => setEditing(post)}
                onReview={() => statusMutation.mutate({ id: post.id, status: "review" })}
                onSchedule={() => setScheduling(post)}
                onPublish={() => publishMutation.mutate(post.id)}
                onRegenerate={() => regenerateMutation.mutate(post.id)}
                onArchive={() => statusMutation.mutate({ id: post.id, status: "archived" })}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
            <div className="mt-3 text-sm font-medium">No Instagram posts match this view</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Generate the first draft or clear the current filters.
            </p>
          </div>
        )}
      </section>

      <InstagramRecentRuns runs={data.recentRuns} />

      {editing && (
        <InstagramEditor
          post={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
      {scheduling && (
        <InstagramScheduleDialog
          post={scheduling}
          busy={statusMutation.isPending}
          onClose={() => setScheduling(null)}
          onSchedule={(scheduledAt) =>
            statusMutation.mutate({ id: scheduling.id, status: "scheduled", scheduledAt })
          }
        />
      )}
    </>
  );
}

function InstagramStats({ dashboard }: { dashboard: InstagramDashboard }) {
  const cards = [
    [ImageIcon, "All posts", dashboard.stats.total],
    [Edit3, "Needs review", dashboard.stats.needsReview],
    [CalendarClock, "Scheduled", dashboard.stats.scheduled],
    [Rocket, "Published", dashboard.stats.published],
    [AlertTriangle, "Failed", dashboard.stats.failed],
  ] as const;
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map(([Icon, label, value]) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <Icon className="h-4 w-4 text-pink-500" />
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
        </div>
      ))}
    </section>
  );
}

function ConnectionCard({
  dashboard,
  busy,
  onVerify,
}: {
  dashboard: InstagramDashboard;
  busy: boolean;
  onVerify: () => void;
}) {
  const { connection } = dashboard;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="h-4 w-4 text-pink-500" /> Meta connection
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium",
            connection.connected
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
          )}
        >
          {connection.connected
            ? "Connected"
            : connection.configured
              ? "Ready to verify"
              : "Missing secrets"}
        </span>
      </div>
      <div className="mt-4 rounded-xl bg-muted/60 p-4">
        <div className="text-sm font-medium">
          {connection.username ? `@${connection.username}` : "Instagram professional account"}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {connection.tokenDaysRemaining !== null
            ? `Token health: ${connection.tokenDaysRemaining} days remaining`
            : "Token refresh is maintained server-side"}
        </div>
        {connection.lastError && (
          <p className="mt-2 text-xs leading-5 text-destructive">{connection.lastError}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onVerify}
        disabled={busy || !connection.configured}
        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border text-sm font-medium disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Verify connection
      </button>
    </div>
  );
}

const postStatusStyles: Record<InstagramPostStatus, string> = {
  draft: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  review: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  publishing: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  failed: "bg-red-500/10 text-red-700 dark:text-red-400",
  archived: "bg-muted text-muted-foreground",
};

function InstagramPostCard({
  post,
  busy,
  onEdit,
  onReview,
  onSchedule,
  onPublish,
  onRegenerate,
  onArchive,
}: {
  post: InstagramPost;
  busy: boolean;
  onEdit: () => void;
  onReview: () => void;
  onSchedule: () => void;
  onPublish: () => void;
  onRegenerate: () => void;
  onArchive: () => void;
}) {
  const canApprove = post.quality_score >= 80 && Boolean(post.image_url);
  const locked =
    post.status === "publishing" || post.status === "published" || post.status === "archived";
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="relative aspect-[4/5] bg-muted">
        {post.image_url ? (
          <img src={post.image_url} alt={post.image_alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            <ImageIcon className="mr-2 h-4 w-4" /> Image unavailable
          </div>
        )}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize backdrop-blur",
            postStatusStyles[post.status],
          )}
        >
          {post.status}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
          Quality {post.quality_score}
        </span>
      </div>
      <div className="p-4">
        <div className="text-[11px] font-medium uppercase tracking-wider text-pink-600 dark:text-pink-400">
          {post.pillar}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5">{post.hook}</h3>
        <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">{post.caption}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {post.hashtags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-[10px] text-pink-600 dark:text-pink-400">
              #{tag}
            </span>
          ))}
        </div>
        {post.last_error && (
          <div className="mt-3 rounded-lg bg-red-500/10 p-2 text-[11px] leading-4 text-red-700 dark:text-red-300">
            {post.last_error}
          </div>
        )}
        {post.scheduled_at && post.status === "scheduled" && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            {new Date(post.scheduled_at).toLocaleString("en-IN")}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {!locked && (
            <button type="button" disabled={busy} onClick={onEdit} className="ig-action-button">
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
          )}
          {post.status === "draft" && (
            <button
              type="button"
              disabled={busy || !canApprove}
              onClick={onReview}
              className="ig-action-button"
            >
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
          )}
          {post.status === "review" && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onSchedule}
                className="ig-action-button"
              >
                <CalendarClock className="h-3.5 w-3.5" /> Schedule
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onPublish}
                className="ig-primary-button"
              >
                <Send className="h-3.5 w-3.5" /> Publish
              </button>
            </>
          )}
          {post.status === "scheduled" && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onSchedule}
                className="ig-action-button"
              >
                <CalendarClock className="h-3.5 w-3.5" /> Reschedule
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onPublish}
                className="ig-primary-button"
              >
                <Send className="h-3.5 w-3.5" /> Publish now
              </button>
            </>
          )}
          {post.status === "failed" && (
            <button
              type="button"
              disabled={busy || !canApprove}
              onClick={onPublish}
              className="ig-primary-button"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry publish
            </button>
          )}
          {!locked && (
            <button
              type="button"
              disabled={busy}
              onClick={onRegenerate}
              className="ig-action-button"
            >
              <ImageIcon className="h-3.5 w-3.5" /> New image
            </button>
          )}
          {post.status === "published" && post.instagram_permalink && (
            <a
              href={post.instagram_permalink}
              target="_blank"
              rel="noreferrer"
              className="ig-primary-button col-span-2"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View on Instagram
            </a>
          )}
          {!locked && (
            <button type="button" disabled={busy} onClick={onArchive} className="ig-action-button">
              <Archive className="h-3.5 w-3.5" /> Archive
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function InstagramEditor({
  post,
  onClose,
  onSaved,
}: {
  post: InstagramPost;
  onClose: () => void;
  onSaved: () => void;
}) {
  const save = useServerFn(saveInstagramPostDraft);
  const [draft, setDraft] = useState<InstagramPostInput>({
    id: post.id,
    pillar: post.pillar,
    hook: post.hook,
    caption: post.caption,
    hashtags: post.hashtags,
    image_prompt: post.image_prompt,
    image_alt: post.image_alt,
  });
  const mutation = useMutation({
    mutationFn: () => save({ data: draft }),
    onSuccess: (saved) => {
      toast.success(`Saved with quality score ${saved.quality_score}.`);
      onSaved();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const set = <K extends keyof InstagramPostInput>(key: K, value: InstagramPostInput[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  return (
    <div
      className="fixed inset-0 z-[90] bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-pink-500">
              Instagram editor
            </div>
            <h2 className="mt-1 line-clamp-1 font-semibold">{draft.hook}</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save & score
            </button>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-md border border-border"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5 p-5 sm:p-7">
            <InstagramField label="Content pillar">
              <input
                value={draft.pillar}
                onChange={(event) => set("pillar", event.target.value)}
                className="field-input"
              />
            </InstagramField>
            <InstagramField label="Hook" helper={`${draft.hook.length}/140 recommended`}>
              <textarea
                value={draft.hook}
                onChange={(event) => set("hook", event.target.value)}
                className="field-textarea min-h-20"
              />
            </InstagramField>
            <InstagramField label="Caption" helper={`${draft.caption.length}/1,800 recommended`}>
              <textarea
                value={draft.caption}
                onChange={(event) => set("caption", event.target.value)}
                className="field-textarea min-h-72"
              />
            </InstagramField>
            <InstagramField label="Hashtags" helper="Comma separated, four to eight focused tags">
              <input
                value={draft.hashtags.map((tag) => `#${tag}`).join(", ")}
                onChange={(event) =>
                  set(
                    "hashtags",
                    event.target.value
                      .split(",")
                      .map((tag) => tag.trim().replace(/^#/, ""))
                      .filter(Boolean),
                  )
                }
                className="field-input"
              />
            </InstagramField>
            <InstagramField
              label="Image prompt"
              helper="Saving the prompt does not regenerate the image automatically"
            >
              <textarea
                value={draft.image_prompt}
                onChange={(event) => set("image_prompt", event.target.value)}
                className="field-textarea min-h-36"
              />
            </InstagramField>
            <InstagramField label="Image alt text">
              <input
                value={draft.image_alt}
                onChange={(event) => set("image_alt", event.target.value)}
                className="field-input"
              />
            </InstagramField>
          </div>
          <aside className="border-t border-border bg-muted/25 p-5 lg:border-l lg:border-t-0 sm:p-7">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Preview
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={draft.image_alt}
                  className="aspect-[4/5] w-full object-cover"
                />
              )}
              <div className="p-4">
                <div className="text-sm font-semibold leading-5">{draft.hook}</div>
                <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                  {draft.caption}
                </p>
                <div className="mt-3 text-xs leading-5 text-pink-600 dark:text-pink-400">
                  {draft.hashtags.map((tag) => `#${tag}`).join(" ")}
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {post.quality_checks.map((check) => (
                <div key={check.id} className="flex items-start gap-2 text-xs">
                  {check.passed ? (
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  )}
                  <span className="text-muted-foreground">{check.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InstagramField({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium">
      <span>{label}</span>
      {helper && (
        <span className="ml-2 text-[10px] font-normal text-muted-foreground">{helper}</span>
      )}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function InstagramScheduleDialog({
  post,
  busy,
  onClose,
  onSchedule,
}: {
  post: InstagramPost;
  busy: boolean;
  onClose: () => void;
  onSchedule: (value: string) => void;
}) {
  const initial = new Date(Date.now() + 86_400_000);
  initial.setHours(10, 0, 0, 0);
  const [value, setValue] = useState(initial.toISOString().slice(0, 16));
  return (
    <div
      className="fixed inset-0 z-[95] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-pink-500">
              Schedule Instagram post
            </div>
            <h2 className="mt-2 line-clamp-2 text-lg font-semibold">{post.hook}</h2>
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
          The automation checks approved scheduled posts every 30 minutes.
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
            className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarClock className="h-4 w-4" />
            )}
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

function InstagramRecentRuns({ runs }: { runs: InstagramDashboard["recentRuns"] }) {
  if (!runs.length) return null;
  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Clock3 className="h-4 w-4 text-pink-500" /> Recent Instagram generation runs
      </h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {runs.map((run) => (
          <div
            key={run.id}
            className="flex items-center justify-between rounded-xl border border-border p-3 text-xs"
          >
            <div>
              <div className="font-medium capitalize">
                {run.run_type} · {run.status}
              </div>
              <div className="mt-1 text-muted-foreground">
                {new Date(run.created_at).toLocaleString("en-IN")} · {run.image_model}
              </div>
              {run.error_message && <div className="mt-1 text-red-600">{run.error_message}</div>}
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{run.post_count}</div>
              <div className="text-[10px] text-muted-foreground">drafts</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
