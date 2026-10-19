import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageHeader } from "@/components/DocPageHeader";

export const Route = createFileRoute("/docs/recipes")({
  head: () => ({
    meta: [
      { title: "Reusable Pipeline Recipes — EazyDataFix 2.0" },
      {
        name: "description",
        content:
          "Create versioned JSON or YAML preparation recipes, preview changes and safely replay reviewed EazyDataFix pipelines.",
      },
      { property: "og:title", content: "Reusable Pipeline Recipes — EazyDataFix 2.0" },
      {
        property: "og:description",
        content:
          "Define explicit data-preparation rules once, review the evidence and reuse them on future files.",
      },
    ],
  }),
  component: RecipesGuide,
});

const recipeCode = [
  "import eazydatafix as edf",
  "",
  "recipe = edf.PipelineRecipe(",
  '    name="monthly_sales",',
  "    columns={",
  '        "customer_id": edf.ColumnRule(dtype="string"),',
  '        "amount": edf.ColumnRule(',
  '            dtype="number",',
  '            currency_symbols=("₹",),',
  '            on_error="quarantine",',
  "        ),",
  '        "order_date": edf.ColumnRule(',
  '            dtype="datetime",',
  '            date_format="%d/%m/%Y",',
  "        ),",
  '        "city": edf.ColumnRule(',
  '            dtype="string",',
  '            category_mapping={"HYD": "Hyderabad", "BLR": "Bengaluru"},',
  "        ),",
  "    },",
  ")",
  "",
  'recipe.save("monthly_sales.json")',
].join("\n");

const reviewCode = [
  "pipeline = edf.Pipeline(",
  '    edf.PipelineRecipe.load("monthly_sales.json")',
  ")",
  "",
  'plan = pipeline.preview("sales.csv")',
  "print(plan.selected_steps)",
  "print(plan.result.report())",
  "",
  'result = pipeline.apply("sales.csv", plan)',
  "",
  "if result.is_ready:",
  '    result.save("sales_output", formats=("csv", "excel"))',
].join("\n");

const cliCode = [
  "edf sales.csv --recipe monthly_sales.json --preview --output preview.json",
  "edf sales.csv --recipe monthly_sales.json --export-dir output",
  "edf --recipe bi_recipe.json --table sales=sales.csv \\",
  "  --table customers=customers.csv --export-dir output --format csv --format excel",
].join("\n");

function RecipesGuide() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Pipeline Recipes" }]}
        title="Reusable Pipeline Recipes"
        description="EazyDataFix 2.0 lets you save explicit preparation rules, inspect a preview and replay the reviewed workflow on future files."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="install">Install v2.0.0</h2>
        <CodeBlock
          code="pip install --upgrade eazydatafix==2.0.0"
          language="bash"
          filename="terminal"
          showActions={false}
        />
        <p>
          For YAML recipes, install the optional extra with{" "}
          <code>pip install &quot;eazydatafix[yaml]==2.0.0&quot;</code>.
        </p>

        <h2 id="define">1. Define explicit rules</h2>
        <p>
          A <code>PipelineRecipe</code> records the workflow and its column rules as data—not
          executable configuration. Rule names refer to normalized headings, so{" "}
          <code>Customer ID</code> becomes <code>customer_id</code>.
        </p>
        <CodeBlock code={recipeCode} filename="create_recipe.py" showLineNumbers />

        <h2 id="review">2. Preview, review and apply</h2>
        <p>
          <code>preview()</code> produces an in-memory review plan bound to the source, recipe,
          selected stages and proposed output. <code>apply()</code> re-runs the pipeline and rejects
          a changed source or mismatched result.
        </p>
        <CodeBlock code={reviewCode} filename="run_recipe.py" showLineNumbers />

        <h2 id="types">Supported explicit types</h2>
        <div className="not-prose overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Rule</th>
                <th className="px-4 py-3 font-medium">Output</th>
                <th className="px-4 py-3 font-medium">Typical control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["string", "pandas string", "Preserve identifiers and leading zeroes"],
                ["integer", "nullable Int64", "Reject fractional values and overflow"],
                ["number", "nullable Float64", "Declare separators, currency and percentages"],
                ["boolean", "nullable boolean", "Convert true/false, yes/no, y/n and 1/0"],
                ["datetime", "pandas datetime", "Require an explicit format or ISO8601"],
                ["category", "pandas category", "Apply literal values and mappings"],
              ].map(([rule, output, control]) => (
                <tr key={rule}>
                  <td className="px-4 py-3 font-mono text-accent">{rule}</td>
                  <td className="px-4 py-3 font-mono text-xs">{output}</td>
                  <td className="px-4 py-3 text-muted-foreground">{control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="failure-policies">Choose what invalid conversions do</h2>
        <ul>
          <li>
            <code>reject</code> — preserve the column and fail the readiness/export gate.
          </li>
          <li>
            <code>preserve</code> — keep the column, report a warning and continue readiness checks.
          </li>
          <li>
            <code>quarantine</code> — exclude invalid rows from output and retain their original
            values as separate evidence.
          </li>
        </ul>

        <h2 id="evidence">Evidence and safe exports</h2>
        <p>
          Results expose status, readiness, issues, changes, before/after scores, validations,
          tables and quarantined rows. Only ready, applied and unchanged results can export clean
          data. Detailed audits can capture every changed cell, so treat them as potentially
          sensitive source data.
        </p>

        <h2 id="readiness">Use recipes with every readiness workflow</h2>
        <p>
          Set <code>workflow=&quot;ml_ready&quot;</code> for recipe-bound training and inference
          artifacts, or <code>workflow=&quot;powerbi_ready&quot;</code> for named tables, key
          checks, relationship validation and optional date dimensions. Analysis Ready is the
          default.
        </p>

        <h2 id="cli">Command line</h2>
        <CodeBlock code={cliCode} language="bash" filename="terminal" showActions={false} />

        <h2 id="scope">Current scope</h2>
        <p>
          Pipelines currently run in memory with pandas. Recipes and ML artifacts are portable;
          review plans remain process-local. Streaming, SQL connectors and browser Studio recipe
          execution remain future work.
        </p>
        <p>
          See the <Link to="/releases/v2-0-0">v2.0.0 release notes</Link> or browse the{" "}
          <a
            href="https://github.com/suneelprojects/eazydatafix/blob/main/docs/pipeline_recipes.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            complete upstream recipe guide
          </a>
          .
        </p>
      </div>
    </div>
  );
}
