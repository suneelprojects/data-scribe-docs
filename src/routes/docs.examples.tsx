import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { examples } from "@/content/examples";

export const Route = createFileRoute("/docs/examples")({
  head: () => ({
    meta: [
      { title: "Examples — EazyDataFix Docs" },
      { name: "description", content: "Worked examples across common data-cleaning tasks." },
      { property: "og:title", content: "Examples — EazyDataFix Docs" },
      { property: "og:description", content: "Worked examples across common data-cleaning tasks." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Examples" }]}
        title="Examples"
        description="Realistic, self-contained examples that show how to use EazyDataFix on the datasets you actually deal with."
      />
      <div id="doc-content" className="prose-doc">
        <p>
          For the full gallery — including expected output and downloadable datasets — visit{" "}
          <Link to="/examples">the Examples gallery</Link>.
        </p>

        <h2 id="all-examples">All examples</h2>
        <div className="not-prose grid gap-3 sm:grid-cols-2">
          {examples.map((e) => (
            <Link
              key={e.slug}
              to="/examples/$slug"
              params={{ slug: e.slug }}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
            >
              <div className="text-sm font-semibold text-foreground">{e.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{e.summary}</div>
              <div className="mt-3 flex flex-wrap gap-1">
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
