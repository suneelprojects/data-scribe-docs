import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";

export const Route = createFileRoute("/docs/assessment")({
  head: () => ({
    meta: [
      { title: "Assessment — EazyDataFix" },
      { name: "description", content: "Understand what edf.assess() computes and how to read the QualityReport." },
      { property: "og:title", content: "Assessment — EazyDataFix" },
      { property: "og:description", content: "Understand the QualityReport." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Assessment" }]}
        title="Assessment"
        description="edf.assess() produces a QualityReport — a structured, serialisable snapshot of everything EazyDataFix knows about your dataset."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="what-is-assessed">What is assessed</h2>
        <ul>
          <li>Row and column counts</li>
          <li>Missing values (per column and overall rate)</li>
          <li>Duplicate rows (exact match)</li>
          <li>Dtype consistency (values that don&rsquo;t match the declared type)</li>
          <li>Cardinality per column</li>
          <li>Composite quality score (0–100)</li>
        </ul>

        <h2 id="running-an-assessment">Running an assessment</h2>
        <CodeBlock
          code={`import eazydatafix as edf\n\nreport = edf.assess("employees.csv")\nreport.summary()`}
          filename="assessment.py"
        />

        <ReplBlock
          lines={[
            { kind: "in", text: "report.summary()" },
            { kind: "out", text: "QualityReport(employees.csv)" },
            { kind: "out", text: "  rows           1,204" },
            { kind: "out", text: "  columns           12" },
            { kind: "out", text: "  quality_score   94.0" },
          ]}
        />

        <h2 id="custom-thresholds">Custom thresholds</h2>
        <p>Override the default warning levels for your domain:</p>
        <CodeBlock
          code={`report = edf.assess(\n    "sales.xlsx",\n    thresholds={"missing": 0.02, "duplicates": 0.01},\n    verbose=True,\n)`}
          filename="thresholds.py"
        />

        <h2 id="reading-the-report">Reading the report</h2>
        <p>
          <code>report.summary()</code> prints a REPL-friendly overview.{" "}
          <code>report.to_dict()</code> returns a nested dict suitable for JSON logging.{" "}
          <code>report.to_html()</code> writes an HTML report for CI artefacts.
        </p>

        <h2 id="next">Next</h2>
        <p>
          Once you know what&rsquo;s wrong, use <Link to="/docs/fixing">edf.fix()</Link> to apply
          the cleaning pipeline.
        </p>
      </div>
    </div>
  );
}
