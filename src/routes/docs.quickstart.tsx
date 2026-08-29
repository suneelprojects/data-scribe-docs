import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageHeader } from "@/components/DocPageHeader";

export const Route = createFileRoute("/docs/quickstart")({
  head: () => ({
    meta: [
      { title: "EazyDataFix 1.4 Quick Start" },
      {
        name: "description",
        content: "Clean and prepare your first dataset with EazyDataFix 1.4.",
      },
      { property: "og:title", content: "EazyDataFix 1.4 Quick Start" },
      {
        property: "og:description",
        content: "Run a complete, auditable data workflow in a few lines of Python.",
      },
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
        description="Run the complete v1 workflow, inspect each result, then choose whether to save the cleaned dataset."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="install">1. Install</h2>
        <CodeBlock
          code="pip install eazydatafix==1.4.0"
          language="bash"
          filename="terminal"
          showActions={false}
        />

        <h2 id="run">2. Run the complete workflow</h2>
        <p>
          <code>edf.run()</code> profiles the source, measures its quality, applies controlled
          cleaning and runs deterministic EDA. The result keeps every stage available separately.
        </p>
        <CodeBlock
          code={`import eazydatafix as edf

result = edf.run("employees.csv")

print(result.profile.rows)
print(result.assessment.quality.score)
print(result.fix_result.applied_fixes)
print(result.eda_result.observations)

result.fix_result.save("employees-clean.csv")`}
          filename="quickstart.py"
          showLineNumbers
        />

        <h2 id="preview">3. Preview cleaning before applying it</h2>
        <p>
          Use a dry run when you want to inspect every proposed change first. The source dataset
          remains in <code>preview.dataset</code>; the cleaned proposal is available separately.
        </p>
        <CodeBlock
          code={`import eazydatafix as edf

preview = edf.fix(
    "employees.csv",
    edf.FixConfig(dry_run=True),
)

print(preview.change_log)
print(preview.proposed_dataset.head())`}
          filename="preview_cleaning.py"
          showLineNumbers
        />

        <h2 id="validate">4. Add a data contract</h2>
        <p>
          Infer an expected schema from trusted data and validate new inputs before your analysis or
          model pipeline continues.
        </p>
        <CodeBlock
          code={`contract = edf.infer_schema("employees.csv")

rules = (
    edf.QualityRule("employee_id_unique", "employee_id", "unique"),
    edf.QualityRule("salary_non_negative", "salary", "min", 0),
)

validation = edf.validate_contract(
    "employees-next.csv",
    contract,
    rules,
)

assert validation.passed, validation.to_dict()`}
          filename="validate_input.py"
          showLineNumbers
        />

        <h2 id="next-steps">Next steps</h2>
        <ul>
          <li>
            <Link to="/releases/v1-0-0">Explore every capability added in v1.0.0</Link>
          </li>
          <li>
            <Link to="/docs/assessment">Understand the assessment report</Link>
          </li>
          <li>
            <Link to="/docs/fixing">Configure the cleaning pipeline</Link>
          </li>
          <li>
            <Link to="/docs/profiling">Deep-dive with edf.profile()</Link>
          </li>
          <li>
            <Link to="/examples">Browse worked examples</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
