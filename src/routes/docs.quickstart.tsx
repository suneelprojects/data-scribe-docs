import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";

export const Route = createFileRoute("/docs/quickstart")({
  head: () => ({
    meta: [
      { title: "Quick Start — EazyDataFix" },
      { name: "description", content: "Assess and fix your first dataset in five lines of Python." },
      { property: "og:title", content: "Quick Start — EazyDataFix" },
      { property: "og:description", content: "Assess and fix your first dataset with EazyDataFix." },
    ],
  }),
  component: QuickStart,
});

function QuickStart() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Quick Start" }]}
        title="Quick Start"
        description="Load a dataset, run an assessment, apply the automatic fixer and export the result."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="a-first-dataset">A first dataset</h2>
        <p>
          The example below uses a small employees CSV. Any pandas DataFrame or Excel file will
          work too — see <Link to="/docs/reference/$fn" params={{ fn: "assess" }}>the reference</Link>.
        </p>

        <CodeBlock
          code={`import pandas as pd\nimport eazydatafix as edf\n\ndf = pd.read_csv("employees.csv")\n\nreport = edf.assess(df)\nreport.summary()\n\nresult = edf.fix(df)\ncleaned_df = result.dataframe\nresult.to_csv("clean.csv")`}
          filename="quickstart.py"
        />

        <h2 id="expected-output">Expected output</h2>
        <ReplBlock
          lines={[
            { kind: "in", text: "report = edf.assess(df)" },
            { kind: "in", text: "report.summary()" },
            { kind: "out", text: "QualityReport(<DataFrame>)" },
            { kind: "out", text: "  rows              1,204" },
            { kind: "out", text: "  columns              12" },
            { kind: "out", text: "  quality_score     94.0" },
            { kind: "out", text: "  missing_values      38  (0.3%)" },
            { kind: "out", text: "  duplicates           6  (0.5%)" },
            { kind: "blank" },
            { kind: "in", text: "result = edf.fix(df)" },
            { kind: "in", text: "result.applied_fixes" },
            { kind: "out", text: "['strip_whitespace', 'coerce_numeric', 'drop_duplicates(6)', 'impute_missing(38, median)']" },
          ]}
        />

        <h2 id="next-steps">Next steps</h2>
        <ul>
          <li><Link to="/docs/assessment">Understand the assessment report</Link></li>
          <li><Link to="/docs/fixing">Configure the cleaning pipeline</Link></li>
          <li><Link to="/docs/profiling">Deep-dive with edf.profile()</Link></li>
          <li><Link to="/examples">Browse worked examples</Link></li>
        </ul>
      </div>
    </div>
  );
}
