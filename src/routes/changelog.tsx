import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { changelog } from "@/content/changelog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — EazyDataFix" },
      { name: "description", content: "Release notes for every EazyDataFix version." },
      { property: "og:title", content: "Changelog — EazyDataFix" },
      { property: "og:description", content: "Release notes for every EazyDataFix version." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Changelog" }]}
        title="Changelog"
        description="Every release, grouped by version. Follows Keep-a-Changelog conventions."
      />
      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        {changelog.map((entry) => (
          <div key={entry.version} className="relative mb-12">
            <span
              className={cn(
                "absolute -left-[22px] top-2 h-3 w-3 rounded-full border-2 border-background",
                entry.status === "released" ? "bg-accent" : "bg-muted-foreground/50",
              )}
            />
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-lg font-semibold text-foreground">
                {entry.version}
              </span>
              <span className="text-base text-muted-foreground">{entry.title}</span>
              <span
                className={cn(
                  "rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                  entry.status === "released"
                    ? "bg-accent/15 text-accent"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {entry.status}
              </span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">{entry.date}</span>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              {entry.added && (
                <Group label="Added" items={entry.added} tone="text-accent" />
              )}
              {entry.changed && (
                <Group label="Changed" items={entry.changed} tone="text-foreground" />
              )}
              {entry.fixed && (
                <Group label="Fixed" items={entry.fixed} tone="text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Group({ label, items, tone }: { label: string; items: string[]; tone: string }) {
  return (
    <div>
      <div className={cn("mb-1 text-[11px] font-semibold uppercase tracking-wider", tone)}>
        {label}
      </div>
      <ul className="space-y-1 text-muted-foreground">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
