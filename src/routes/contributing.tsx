import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";

export const Route = createFileRoute("/contributing")({
  head: () => ({
    meta: [
      { title: "Contributing — EazyDataFix" },
      { name: "description", content: "How to contribute to EazyDataFix." },
      { property: "og:title", content: "Contributing — EazyDataFix" },
      { property: "og:description", content: "How to contribute to EazyDataFix." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Contributing" }]}
        title="Contributing"
        description="EazyDataFix is community-driven. Bug reports, docs and code contributions all welcome."
      />
      <div className="prose-doc">
        <h2 id="ways-to-help">Ways to help</h2>
        <ul>
          <li>File a bug report or feature request on GitHub</li>
          <li>Improve documentation — this site&rsquo;s source lives in the same repo</li>
          <li>Add a new example to the gallery</li>
          <li>Ship a new connector (JSON / Parquet / SQL)</li>
        </ul>

        <h2 id="dev-setup">Development setup</h2>
        <CodeBlock
          code={`git clone https://github.com/eazydatafix/eazydatafix.git\ncd eazydatafix\npython -m venv .venv\nsource .venv/bin/activate\npip install -e ".[dev]"`}
          language="bash"
          filename="terminal"
          showActions={false}
        />

        <h2 id="running-tests">Running tests</h2>
        <CodeBlock code="pytest" language="bash" filename="terminal" showActions={false} />

        <h2 id="style">Code style</h2>
        <p>
          The codebase uses <code>ruff</code> for linting and <code>black</code> for formatting.
          Both run automatically in CI.
        </p>

        <h2 id="conventional-commits">Conventional commits</h2>
        <p>
          Please prefix commits with a type — <code>feat:</code>, <code>fix:</code>,{" "}
          <code>docs:</code>, <code>chore:</code>. This keeps the changelog automation working.
        </p>

        <h2 id="code-of-conduct">Code of conduct</h2>
        <p>
          Be kind, assume good intent, and remember the person on the other side of the pull
          request is a volunteer. See <code>CODE_OF_CONDUCT.md</code> for the full text.
        </p>
      </div>
    </div>
  );
}
