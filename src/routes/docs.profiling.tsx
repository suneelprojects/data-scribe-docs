import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";

export const Route = createFileRoute("/docs/profiling")({
  head: () => ({
    meta: [
      { title: "Profiling — EazyDataFix" },
      { name: "description", content: "Deep column-level profiling with edf.profile()." },
      { property: "og:title", content: "Profiling — EazyDataFix" },
      { property: "og:description", content: "Column-level profiling for pandas DataFrames." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Profiling" }]}
        title="Profiling"
        description="edf.profile() computes rich per-column statistics — dtype, cardinality, nulls, distribution summary and pairwise correlations."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="basic-usage">Basic usage</h2>
        <CodeBlock
          code={`import pandas as pd\nimport eazydatafix as edf\n\ndf = pd.read_csv("hospital.csv")\nprof = edf.profile(df, sample=10_000)\nprof.columns["age"]`}
          filename="profile.py"
        />

        <ReplBlock
          lines={[
            { kind: "in", text: 'prof = edf.profile(df, sample=10_000)' },
            { kind: "in", text: 'prof.columns["age"]' },
            { kind: "out", text: "ColumnProfile(age)" },
            { kind: "out", text: "  dtype       int64" },
            { kind: "out", text: "  missing     0" },
            { kind: "out", text: "  unique      87" },
            { kind: "out", text: "  min         0" },
            { kind: "out", text: "  max         104" },
            { kind: "out", text: "  mean        42.3" },
            { kind: "out", text: "  median      41" },
          ]}
        />

        <h2 id="correlations">Correlations</h2>
        <p>
          By default, <code>profile()</code> computes Pearson correlations for numeric columns.
          Disable with <code>correlations=False</code> on very wide datasets.
        </p>

        <h2 id="sampling">Sampling</h2>
        <p>
          For datasets larger than ~5M rows, pass <code>sample=</code> to keep profiling under a
          second while retaining a representative distribution.
        </p>

        <h2 id="exporting">Exporting</h2>
        <p>
          <code>prof.to_html("out.html")</code> writes a shareable HTML profile.{" "}
          <code>prof.to_dict()</code> returns a JSON-friendly dict.
        </p>

        <h2 id="see-also">See also</h2>
        <p>
          Full options at{" "}
          <Link to="/docs/reference/$fn" params={{ fn: "profile" }}>
            <code>edf.profile()</code>
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
