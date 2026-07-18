import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightPython } from "@/lib/highlight";

export type ReplLine =
  | { kind: "in"; text: string }
  | { kind: "cont"; text: string }
  | { kind: "out"; text: string }
  | { kind: "blank" };

export function ReplBlock({
  lines,
  title,
  className,
}: {
  lines: ReplLine[];
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const raw = lines
    .map((l) => {
      if (l.kind === "in") return ">>> " + l.text;
      if (l.kind === "cont") return "... " + l.text;
      if (l.kind === "out") return l.text;
      return "";
    })
    .join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={cn(
        "not-prose overflow-hidden rounded-lg border border-border shadow-sm",
        "bg-[color:var(--color-syntax-bg)] text-[color:var(--color-syntax-fg)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-white/70">Python 3.11</span>
          {title && <span className="text-white/50">— {title}</span>}
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-[1.7] font-mono">
        <code>
          {lines.map((line, idx) => {
            if (line.kind === "blank") return <div key={idx}>&nbsp;</div>;
            if (line.kind === "in") {
              return (
                <div key={idx}>
                  <span className="tk-prompt select-none">&gt;&gt;&gt; </span>
                  <span dangerouslySetInnerHTML={{ __html: highlightPython(line.text) }} />
                </div>
              );
            }
            if (line.kind === "cont") {
              return (
                <div key={idx}>
                  <span className="tk-prompt select-none">... </span>
                  <span dangerouslySetInnerHTML={{ __html: highlightPython(line.text) }} />
                </div>
              );
            }
            return (
              <div key={idx} className="text-white/70">
                {line.text}
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
