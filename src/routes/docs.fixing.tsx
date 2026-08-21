import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageHeader } from "@/components/DocPageHeader";
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
        description="edf.fix() runs a deterministic, configurable cleaning pipeline and returns the cleaned data with an audit trail."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="pipeline">The default pipeline</h2>
        <ol>
          <li>Normalise column names</li>
          <li>Trim leading and trailing whitespace</li>
          <li>Recognise configured missing-value markers</li>
          <li>Remove exact duplicate rows</li>
          <li>Remove empty rows and columns</li>
          <li>Fill missing values with the configured strategy</li>
        </ol>

        <h2 id="configuration">Configuration</h2>
        <p>
          Pass a <code>FixConfig</code> to control every cleaning stage. Use a
          <code> ColumnCleaningRule</code> when one column needs a different strategy.
        </p>
        <CodeBlock
          code={`import eazydatafix as edf

config = edf.FixConfig(
    missing_value_strategy="median",
    missing_markers=("", "NA", "N/A", "unknown"),
    column_rules={
        "department": edf.ColumnCleaningRule(
            missing_value_strategy="mode",
        ),
    },
)

result = edf.fix("employees.csv", config)
print(result.applied_fixes)
result.save("employees-clean.csv")`}
          filename="fixing.py"
        />

        <h2 id="dry-run">Dry run</h2>
        <p>
          Set <code>dry_run=True</code> to preserve the source in <code>result.dataset</code> and
          inspect the cleaned proposal separately in <code>result.proposed_dataset</code>.
        </p>
        <CodeBlock
          code={`config = edf.FixConfig(dry_run=True)
preview = edf.fix("employees.csv", config)

print(preview.dry_run)
print(preview.change_log)
print(preview.proposed_dataset.head())`}
          filename="dry_run.py"
        />

        <ReplBlock
          lines={[
            { kind: "in", text: "preview.dry_run" },
            { kind: "out", text: "True" },
            { kind: "in", text: "preview.dataset.shape, preview.proposed_dataset.shape" },
            { kind: "out", text: "((12, 8), (11, 8))" },
          ]}
        />

        <h2 id="exporting">Exporting</h2>
        <p>
          <code>result.save()</code> and the backwards-compatible <code>result.to_csv()</code>
          write CSV files. For Excel, export the cleaned DataFrame directly.
        </p>
        <CodeBlock
          code={`result.save("employees-clean.csv")
result.dataset.to_excel("employees-clean.xlsx", index=False)`}
          filename="export_cleaned.py"
        />
        <p>
          See{" "}
          <Link to="/docs/reference/$fn" params={{ fn: "fix" }}>
            the reference
          </Link>{" "}
          for the complete return value and usage notes.
        </p>
      </div>
    </div>
  );
}
