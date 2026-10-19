import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageHeader } from "@/components/DocPageHeader";

export const Route = createFileRoute("/docs/quickstart")({
  head: () => ({
    meta: [
      { title: "EazyDataFix 2.0 Quick Start" },
      {
        name: "description",
        content: "Create, review and replay your first preparation recipe with EazyDataFix 2.0.",
      },
      { property: "og:title", content: "EazyDataFix 2.0 Quick Start" },
      {
        property: "og:description",
        content: "Run a reusable, reviewable data-preparation workflow in a few lines of Python.",
      },
    ],
  }),
  component: QuickStart,
});

const recipeCode = [
  "import eazydatafix as edf",
  "",
  "recipe = edf.PipelineRecipe(",
  '    name="monthly_employees",',
  "    columns={",
  '        "employee_id": edf.ColumnRule(dtype="string"),',
  '        "salary": edf.ColumnRule(dtype="number", currency_symbols=("₹",)),',
  '        "joining_date": edf.ColumnRule(dtype="datetime", date_format="%d/%m/%Y"),',
  "    },",
  ")",
  "",
  'recipe.save("monthly_employees.json")',
].join("\n");

const reviewCode = [
  "import eazydatafix as edf",
  "",
  'recipe = edf.PipelineRecipe.load("monthly_employees.json")',
  "pipeline = edf.Pipeline(recipe)",
  "",
  'plan = pipeline.preview("employees.csv")',
  "print(plan.result.report())",
  "",
  'result = pipeline.apply("employees.csv", plan)',
  "",
  "if result.is_ready:",
  '    result.save("employees_output")',
].join("\n");

const contractCode = [
  'contract = edf.infer_schema("employees.csv")',
  "",
  "rules = (",
  '    edf.QualityRule("employee_id_unique", "employee_id", "unique"),',
  '    edf.QualityRule("salary_non_negative", "salary", "min", 0),',
  ")",
  "",
  "validation = edf.validate_contract(",
  '    "employees-next.csv",',
  "    contract,",
  "    rules,",
  ")",
  "",
  "assert validation.passed, validation.to_dict()",
].join("\n");

function QuickStart() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Quick Start" }]}
        title="Quick Start"
        description="Define a v2 recipe, inspect the proposed transformation and safely apply the reviewed result."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="install">1. Install</h2>
        <CodeBlock
          code="pip install eazydatafix==2.0.0"
          language="bash"
          filename="terminal"
          showActions={false}
        />

        <h2 id="recipe">2. Define a reusable recipe</h2>
        <p>
          Declare the types and mappings that should be repeated on every new file. Recipes can be
          saved as JSON or YAML and reviewed in source control.
        </p>
        <CodeBlock code={recipeCode} filename="create_recipe.py" showLineNumbers />

        <h2 id="preview">3. Preview before applying</h2>
        <p>
          The review plan is bound to this exact source, recipe, selected stages and proposed
          output. If anything changes, <code>apply()</code> requires a fresh preview.
        </p>
        <CodeBlock code={reviewCode} filename="run_recipe.py" showLineNumbers />

        <h2 id="validate">4. Add a data contract when needed</h2>
        <p>
          Infer an expected schema from trusted data and validate new inputs before your analysis or
          model pipeline continues.
        </p>
        <CodeBlock code={contractCode} filename="validate_input.py" showLineNumbers />

        <h2 id="next-steps">Next steps</h2>
        <ul>
          <li>
            <Link to="/docs/recipes">
              Learn explicit types, error policies, evidence and CLI use
            </Link>
          </li>
          <li>
            <Link to="/releases/v2-0-0">Explore everything added in v2.0.0</Link>
          </li>
          <li>
            <Link to="/docs/assessment">Understand the assessment report</Link>
          </li>
          <li>
            <Link to="/docs/fixing">Configure the v1-compatible cleaning pipeline</Link>
          </li>
          <li>
            <Link to="/examples">Browse worked examples</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
