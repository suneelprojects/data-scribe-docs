import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageHeader } from "@/components/DocPageHeader";

export const Route = createFileRoute("/docs/reports")({
  head: () => ({
    meta: [
      { title: "Reports — EazyDataFix" },
      { name: "description", content: "Export EazyDataFix assessment reports." },
      { property: "og:title", content: "Reports — EazyDataFix" },
      { property: "og:description", content: "Assessment report exports for audits and CI." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Reports" }]}
        title="Reports"
        description="AssessmentReport exports make quality checks easy to review, archive and use in CI."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="exports">Supported exports</h2>
        <p>
          <code>edf.assess()</code> returns an <code>AssessmentReport</code> with file-based export
          methods for HTML, JSON, Markdown, CSV, Excel and PDF.
        </p>
        <CodeBlock
          code={`import eazydatafix as edf

report = edf.assess("employees.csv")

report.to_html("quality.html")
report.to_json("quality.json")
report.to_markdown("quality.md")
report.to_csv("quality.csv")
report.to_excel("quality.xlsx")
report.to_pdf("quality.pdf")`}
          filename="reports.py"
        />

        <h2 id="structured-data">Structured report data</h2>
        <p>
          Read report fields directly in Python. The assessment report does not expose a
          <code> to_dict()</code> method; use <code>to_json()</code> when you need a JSON file.
        </p>
        <CodeBlock
          code={`score = report.quality.score
grade = report.quality.grade
missing = report.completeness.total_missing_values
duplicates = report.uniqueness.duplicate_rows`}
          filename="report_fields.py"
        />

        <h2 id="ci">Wiring into CI</h2>
        <p>Persist a report as a build artefact and gate the job on the nested quality score.</p>
        <CodeBlock
          code={`report = edf.assess("nightly.csv")
report.to_json("nightly-quality.json")

if report.quality.score < 90:
    raise SystemExit(f"quality regressed: {report.quality.score}")`}
          filename="ci_gate.py"
        />
      </div>
    </div>
  );
}
