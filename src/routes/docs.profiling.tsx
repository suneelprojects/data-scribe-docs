import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageHeader } from "@/components/DocPageHeader";
import { ReplBlock } from "@/components/ReplBlock";

export const Route = createFileRoute("/docs/profiling")({
  head: () => ({
    meta: [
      { title: "Profiling — EazyDataFix" },
      { name: "description", content: "Structural dataset profiling with edf.profile()." },
      { property: "og:title", content: "Profiling — EazyDataFix" },
      { property: "og:description", content: "Structural profiles for supported datasets." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[{ label: "Docs", to: "/docs" }, { label: "Profiling" }]}
        title="Profiling"
        description="edf.profile() gives you a fast structural inventory: shape, columns, data types and memory use."
      />
      <div id="doc-content" className="prose-doc">
        <h2 id="basic-usage">Basic usage</h2>
        <CodeBlock
          code={`import eazydatafix as edf

profile = edf.profile("hospital.csv")

print(profile.rows, profile.columns)
print(profile.column_names)
print(profile.data_types)
print(profile.memory_usage_bytes)`}
          filename="profile.py"
        />

        <ReplBlock
          lines={[
            { kind: "in", text: "profile.rows, profile.columns" },
            { kind: "out", text: "(15, 8)" },
            { kind: "in", text: "profile.column_names[:3]" },
            { kind: "out", text: "['patient_id', 'age', 'gender']" },
          ]}
        />

        <h2 id="fields">Available fields</h2>
        <ul>
          <li>
            <code>file_name</code> and <code>file_type</code>
          </li>
          <li>
            <code>rows</code> and <code>columns</code>
          </li>
          <li>
            <code>column_names</code> and <code>data_types</code>
          </li>
          <li>
            <code>memory_usage_bytes</code>
          </li>
        </ul>

        <h2 id="scope">Profile versus assess</h2>
        <p>
          A profile describes the dataset structure only. Use <code>edf.assess()</code> when you
          need missing-value counts, duplicates, quality dimensions, recommendations or an
          exportable report.
        </p>

        <h2 id="see-also">See also</h2>
        <p>
          Full details at{" "}
          <Link to="/docs/reference/$fn" params={{ fn: "profile" }}>
            <code>edf.profile()</code>
          </Link>
          , or continue to <Link to="/docs/assessment">assessment</Link>.
        </p>
      </div>
    </div>
  );
}
