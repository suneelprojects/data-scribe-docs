import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { allDocs } from "@/content/reference";

export const Route = createFileRoute("/docs/reference/")({
  head: () => ({
    meta: [
      { title: "API Reference — EazyDataFix" },
      { name: "description", content: "Every public function in EazyDataFix." },
      { property: "og:title", content: "API Reference — EazyDataFix" },
      { property: "og:description", content: "Every public function in EazyDataFix." },
    ],
  }),
  component: ReferenceIndex,
});

function ReferenceIndex() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "API Reference" }]}
        title="API Reference"
        description="EazyDataFix exposes three top-level functions. Every function documents its parameters, return type, raises, examples and best practices."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="public-api">Public API</h2>
        <div className="not-prose divide-y divide-border rounded-lg border border-border">
          {allDocs.map((d) => (
            <Link
              key={d.slug}
              to="/docs/reference/$fn"
              params={{ fn: d.slug }}
              className="block p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="font-mono text-sm">
                  <span className="text-muted-foreground">edf.</span>
                  <span className="text-accent">{d.name}</span>
                  <span className="text-muted-foreground">()</span>
                </code>
                <span className="font-mono text-[11px] text-muted-foreground">
                  → {d.returns.type}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{d.oneLiner}</div>
            </Link>
          ))}
        </div>

        <h2 id="conventions">Conventions</h2>
        <p>
          Every function accepts a CSV/Excel path or a <code>pandas.DataFrame</code>. Keyword-only
          options follow the signature and never mutate the input. Return objects are
          serialisable via <code>.to_dict()</code>, <code>.to_json()</code> and (where relevant){" "}
          <code>.to_html()</code>.
        </p>
      </div>
    </div>
  );
}
