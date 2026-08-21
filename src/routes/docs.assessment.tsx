import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageHeader } from "@/components/DocPageHeader";
import { ReplBlock } from "@/components/ReplBlock";

export const Route = createFileRoute("/docs/assessment")({
  head: () => ({
    meta: [
      { title: "Assessment — EazyDataFix" },
      {
        name: "description",
        content: "Understand what edf.assess() computes and how to read an AssessmentReport.",
      },
      { property: "og:title", content: "Assessment — EazyDataFix" },
      { property: "og:description", content: "Understand the AssessmentReport." },
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
        description="edf.assess() produces an AssessmentReport: a structured, exportable snapshot of dataset quality."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="what-is-assessed">What is assessed</h2>
        <ul>
          <li>Dataset name, row and column counts, and memory use</li>
          <li>Overall missing-value count and completeness score</li>
          <li>Exact duplicate rows and uniqueness score</li>
          <li>Completeness, uniqueness, validity, consistency, accuracy and timeliness</li>
          <li>Composite quality score and grade</li>
          <li>Recommendations and validation results</li>
        </ul>

        <h2 id="running-an-assessment">Running an assessment</h2>
        <CodeBlock
          code={`import eazydatafix as edf

report = edf.assess("employees.csv")
report.summary()`}
          filename="assessment.py"
        />

        <ReplBlock
          lines={[
            { kind: "in", text: "report.dataset_info.rows, report.dataset_info.columns" },
            { kind: "out", text: "(12, 8)" },
            { kind: "in", text: "report.completeness.total_missing_values" },
            { kind: "out", text: "5" },
            { kind: "in", text: "report.quality.score" },
            { kind: "out", text: "82.76" },
          ]}
        />

        <h2 id="reading-the-report">Reading structured metrics</h2>
        <p>Use the report fields directly when a pipeline needs to make a decision:</p>
        <CodeBlock
          code={`missing = report.completeness.total_missing_values
duplicates = report.uniqueness.duplicate_rows
score = report.quality.score

if score < 80:
    raise SystemExit(f"quality gate failed: {score}")`}
          filename="quality_gate.py"
        />

        <h2 id="exporting">Exporting</h2>
        <p>
          Export methods write directly to a file. Reports support HTML, JSON, Markdown, CSV, Excel
          and PDF.
        </p>
        <CodeBlock
          code={`report.to_html("quality.html")
report.to_json("quality.json")
report.to_markdown("quality.md")`}
          filename="export_report.py"
        />

        <h2 id="next">Next</h2>
        <p>
          Once you know what is wrong, use <Link to="/docs/fixing">edf.fix()</Link> to apply a
          controlled cleaning pipeline.
        </p>
      </div>
    </div>
  );
}
