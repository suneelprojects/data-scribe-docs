import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";
import { examples, findExample } from "@/content/examples";

export const Route = createFileRoute("/examples/$slug")({
  head: ({ params }) => {
    const ex = findExample(params.slug);
    const title = ex ? `${ex.title} — EazyDataFix Examples` : "Example — EazyDataFix";
    const desc = ex?.summary ?? "EazyDataFix example.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const ex = findExample(params.slug);
    if (!ex) throw notFound();
    return { ex };
  },
  component: ExamplePage,
});

function ExamplePage() {
  const { slug } = Route.useParams();
  const ex = findExample(slug);
  if (!ex) return null;
  const related = examples.filter((e) => e.slug !== ex.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Examples", to: "/examples" }, { label: ex.title }]}
        title={ex.title}
        description={ex.summary}
      />

      <div id="doc-content" className="prose-doc">
        <h2 id="overview">Overview</h2>
        <p>{ex.overview}</p>

        <h2 id="dataset">Dataset</h2>
        <div className="not-prose rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <code className="font-mono text-sm text-foreground">{ex.dataset.name}</code>
            <span className="text-xs text-muted-foreground">{ex.dataset.rows}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {ex.dataset.columns.map((c: string) => (
              <span
                key={c}
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground"
              title="Placeholder — dataset download coming soon"
            >
              <Download className="h-3 w-3" />
              Download dataset
              <span className="rounded bg-background px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider">
                placeholder
              </span>
            </button>
          </div>
        </div>

        <h2 id="python-code">Python code</h2>
        <CodeBlock code={ex.code} filename={ex.slug + ".py"} downloadName={ex.slug + ".py"} />

        <h2 id="expected-output">Expected output</h2>
        <ReplBlock lines={ex.output} />

        <h2 id="related">Related examples</h2>
        <div className="not-prose grid gap-3 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              to="/examples/$slug"
              params={{ slug: r.slug }}
              className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-accent"
            >
              <div className="text-sm font-medium text-foreground">{r.title}</div>
              <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.summary}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
