import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { ReplBlock } from "@/components/ReplBlock";

export const Route = createFileRoute("/docs/installation")({
  head: () => ({
    meta: [
      { title: "Installation — EazyDataFix" },
      { name: "description", content: "Install EazyDataFix with pip in Python 3.9+." },
      { property: "og:title", content: "Installation — EazyDataFix" },
      { property: "og:description", content: "Install EazyDataFix with pip." },
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
        description="EazyDataFix is available on PyPI and supports Python 3.9 and above."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="requirements">Requirements</h2>
        <ul>
          <li>Python 3.9 or newer</li>
          <li>pandas ≥ 1.5 (installed automatically)</li>
          <li>openpyxl (only required for Excel input)</li>
        </ul>

        <h2 id="install">Install with pip</h2>
        <CodeBlock code="pip install eazydatafix" language="bash" filename="terminal" showActions={false} />

        <h2 id="verify">Verify the installation</h2>
        <ReplBlock
          lines={[
            { kind: "in", text: "import eazydatafix as edf" },
            { kind: "in", text: "edf.__version__" },
            { kind: "out", text: "'0.1.0'" },
          ]}
        />

        <h2 id="upgrade">Upgrade</h2>
        <CodeBlock code="pip install --upgrade eazydatafix" language="bash" filename="terminal" showActions={false} />

        <h2 id="troubleshooting">Troubleshooting</h2>
        <p>
          If <code>pip install</code> fails with a dependency resolver error, install pandas
          separately first with <code>pip install pandas</code> and retry.
        </p>
      </div>
    </div>
  );
}
