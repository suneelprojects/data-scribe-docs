import { Link } from "@tanstack/react-router";
import { CodeBlock } from "./CodeBlock";
import { ReplBlock } from "./ReplBlock";
import type { FunctionDoc } from "@/content/reference";

export function FunctionDocPage({ doc }: { doc: FunctionDoc }) {
  return (
    <div id="doc-content" className="prose-doc">
      <div className="not-prose mb-6 rounded-lg border border-border bg-muted/30 p-4">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Signature
        </div>
        <code className="block font-mono text-sm text-foreground break-words">
          {doc.signature}
        </code>
      </div>

      <p className="text-base text-muted-foreground">{doc.oneLiner}</p>

      <h2 id="description">Description</h2>
      <p>{doc.description}</p>

      <h2 id="parameters">Parameters</h2>
      <div className="not-prose overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Default</th>
              <th className="px-3 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {doc.parameters.map((p) => (
              <tr key={p.name} className="border-t border-border align-top">
                <td className="px-3 py-2 font-mono text-foreground">{p.name}</td>
                <td className="px-3 py-2 font-mono text-xs text-accent">{p.type}</td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  {p.default ?? "—"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="returns">Returns</h2>
      <div className="not-prose rounded-lg border border-border bg-muted/20 p-3 text-sm">
        <div>
          <span className="font-mono text-accent">{doc.returns.type}</span>
          <span className="text-muted-foreground"> — {doc.returns.description}</span>
        </div>
      </div>

      {doc.raises.length > 0 && (
        <>
          <h2 id="raises">Raises</h2>
          <ul>
            {doc.raises.map((r) => (
              <li key={r.name}>
                <code>{r.name}</code> — {r.when}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 id="examples">Examples</h2>
      {doc.examples.map((ex, i) => (
        <div key={i} className="mb-4 space-y-3">
          <h3 id={"example-" + i}>{ex.title}</h3>
          <CodeBlock code={ex.code} filename={doc.name + "_example.py"} />
          {ex.repl && <ReplBlock lines={ex.repl} title={"Expected output"} />}
        </div>
      ))}

      <h2 id="notes">Notes</h2>
      <ul>
        {doc.notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        {doc.bestPractices.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      <h2 id="see-also">See Also</h2>
      <div className="not-prose grid gap-3 sm:grid-cols-2">
        {doc.seeAlso.map((s) => (
          <Link
            key={s.slug}
            to={"/docs/reference/$fn" as const}
            params={{ fn: s.slug }}
            className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-accent"
          >
            <div className="font-mono text-sm text-accent">{s.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
