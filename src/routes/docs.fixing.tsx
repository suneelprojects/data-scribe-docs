import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";

export const Route = createFileRoute("/docs/fixing")({
  head: () => ({
    meta: [
      { title: "Fixing — EazyDataFix" },
      { name: "description", content: "Configure the automated cleaning pipeline." },
      { property: "og:title", content: "Fixing — EazyDataFix" },
      { property: "og:description", content: "Automated cleaning pipeline." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Fixing" }]}
        title="Fixing"
        description="edf.fix() runs an opinionated, deterministic cleaning pipeline and returns a FixResult that includes the cleaned DataFrame plus an audit trail."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="pipeline">The default pipeline</h2>
        <ol>
          <li>Normalise whitespace and Unicode</li>
          <li>Coerce obvious dtypes (dates, numbers, booleans)</li>
          <li>Drop exact duplicate rows</li>
          <li>Impute missing values per column</li>
          <li>Emit an <code>applied_fixes</code> log</li>
        </ol>

        <h2 id="strategies">Strategies</h2>
        <p>
          Pass <code>strategy="safe" | "auto" | "aggressive"</code> to trade caution for coverage:
        </p>
        <ul>
          <li><code>safe</code> — only non-destructive fixes.</li>
          <li><code>auto</code> — the balanced default.</li>
          <li><code>aggressive</code> — drops columns with &gt;90% missing values.</li>
        </ul>

        <CodeBlock
          code={`import eazydatafix as edf\n\nresult = edf.fix("employees.csv", strategy="safe")\nresult.applied_fixes\nresult.to_csv("clean.csv")`}
          filename="fixing.py"
        />

        <h2 id="dry-run">Dry run</h2>
        <p>Preview what would change without materialising a new DataFrame:</p>
        <CodeBlock
          code={`result = edf.fix("employees.csv", dry_run=True)\nresult.diff()`}
          filename="dry_run.py"
        />

        <ReplBlock
          lines={[
            { kind: "in", text: 'result = edf.fix("employees.csv", dry_run=True)' },
            { kind: "in", text: "result.diff()" },
            { kind: "out", text: "  strip_whitespace: 42 cells" },
            { kind: "out", text: "  drop_duplicates: 6 rows" },
            { kind: "out", text: "  impute_missing: 38 cells (median)" },
          ]}
        />

        <h2 id="exporting">Exporting</h2>
        <p>
          <code>result.to_csv()</code> and <code>result.to_excel()</code> write the cleaned
          dataset. See{" "}
          <Link to="/docs/reference/$fn" params={{ fn: "fix" }}>the reference</Link> for every
          option.
        </p>
      </div>
    </div>
  );
}
