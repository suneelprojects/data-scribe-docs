import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";

export const Route = createFileRoute("/docs/reports")({
  head: () => ({
    meta: [
      { title: "Reports — EazyDataFix" },
      { name: "description", content: "Export EazyDataFix reports to HTML and JSON." },
      { property: "og:title", content: "Reports — EazyDataFix" },
      { property: "og:description", content: "HTML and JSON report exports." },
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
        description="Every EazyDataFix object serialises to JSON and HTML so your pipeline stays auditable."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="html">HTML reports</h2>
        <p>
          Both <code>QualityReport</code> and <code>Profile</code> expose <code>.to_html()</code>{" "}
          for standalone, styled reports.
        </p>
        <CodeBlock
          code={`report = edf.assess("employees.csv")\nreport.to_html("quality.html")\n\nprof = edf.profile("employees.csv")\nprof.to_html("profile.html")`}
          filename="reports.py"
        />

        <h2 id="json">JSON output</h2>
        <p>Use <code>.to_dict()</code> or <code>.to_json()</code> for machine-readable outputs.</p>
        <CodeBlock
          code={`import json\n\nwith open("quality.json", "w") as f:\n    json.dump(report.to_dict(), f, indent=2)`}
          filename="reports_json.py"
        />

        <h2 id="ci">Wiring into CI</h2>
        <p>
          Persist reports as build artefacts and fail the job when{" "}
          <code>report.quality_score</code> drops below a threshold.
        </p>
        <CodeBlock
          code={`report = edf.assess("nightly.csv")\nif report.quality_score < 90:\n    raise SystemExit(f"quality regressed: {report.quality_score}")`}
          filename="ci_gate.py"
        />
      </div>
    </div>
  );
}
