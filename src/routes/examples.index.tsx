import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { examples } from "@/content/examples";

export const Route = createFileRoute("/examples/")({
  head: () => ({
    meta: [
      { title: "Examples Gallery — EazyDataFix" },
      {
        name: "description",
        content: "Seven worked examples across CSV, Excel, healthcare, HR and more.",
      },
      { property: "og:title", content: "Examples Gallery — EazyDataFix" },
      { property: "og:description", content: "Worked examples for EazyDataFix." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Examples" }]}
        title="Examples Gallery"
        description="Every example ships with runnable v1 Python, verified output, and a real downloadable dataset."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((e) => (
          <Link
            key={e.slug}
            to="/examples/$slug"
            params={{ slug: e.slug }}
            className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
          >
            <div className="flex flex-wrap gap-1">
              {e.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 text-base font-semibold text-foreground">{e.title}</div>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{e.summary}</p>
            <pre className="mt-4 overflow-hidden rounded border border-border bg-[color:var(--color-syntax-bg)] px-3 py-2 font-mono text-[11px] text-[color:var(--color-syntax-fg)]">
              {e.code.split("\n").slice(0, 2).join("\n")}
            </pre>
            <div className="mt-4 text-xs text-muted-foreground group-hover:text-accent">
              Open example →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
