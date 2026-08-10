import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";

export const Route = createFileRoute("/docs/installation")({
  head: () => ({
    meta: [
      { title: "Installation — EazyDataFix" },
      {
        name: "description",
        content:
          "Install EazyDataFix with pip. Requires Python 3.10 or later; tested with Python 3.10–3.13.",
      },
      { property: "og:title", content: "Installation — EazyDataFix" },
      {
        property: "og:description",
        content: "Install EazyDataFix with pip. Requires Python 3.10 or later.",
      },
    ],
  }),
  component: Installation,
});

function Installation() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Installation" }]}
        title="Installation"
        description="EazyDataFix is available on PyPI. Requires Python 3.10 or later; tested with Python 3.10–3.13."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="requirements">Requirements</h2>
        <ul>
          <li>Python 3.10 or later (tested on 3.10, 3.11, 3.12, 3.13)</li>
          <li>pandas (installed automatically)</li>
          <li>openpyxl (only required for Excel input)</li>
          <li>pyarrow (only required for Parquet input, via the optional extra)</li>
        </ul>

        <h2 id="install">Install with pip</h2>
        <CodeBlock
          code="pip install eazydatafix"
          language="bash"
          filename="terminal"
          showActions={false}
        />

        <h3 id="install-parquet">With Parquet support</h3>
        <CodeBlock
          code={`pip install "eazydatafix[parquet]"`}
          language="bash"
          filename="terminal"
          showActions={false}
        />

        <h2 id="verify">Verify the installation</h2>
        <ReplBlock
          lines={[
            { kind: "in", text: "import eazydatafix as edf" },
            { kind: "in", text: "edf.__version__" },
            { kind: "out", text: "'1.0.0'" },
          ]}
        />

        <h2 id="upgrade">Upgrade</h2>
        <CodeBlock
          code="pip install --upgrade eazydatafix"
          language="bash"
          filename="terminal"
          showActions={false}
        />

        <h2 id="troubleshooting">Troubleshooting</h2>
        <p>
          If <code>pip install</code> fails with a dependency resolver error, install pandas
          separately first with <code>pip install pandas</code> and retry.
        </p>
      </div>
    </div>
  );
}
