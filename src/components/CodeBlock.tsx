import { useState, type ReactNode } from "react";
import { Check, Copy, Download, ExternalLink, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightPython, highlightBash } from "@/lib/highlight";

export type CodeBlockProps = {
  code: string;
  language?: "python" | "bash" | "text";
  filename?: string;
  showChrome?: boolean;
  showActions?: boolean;
  showLineNumbers?: boolean;
  className?: string;
  colabUrl?: string;
  githubUrl?: string;
  downloadName?: string;
  header?: ReactNode;
};

export function CodeBlock({
  code,
  language = "python",
  filename,
  showChrome = true,
  showActions = true,
  showLineNumbers = false,
  className,
  colabUrl = "https://colab.research.google.com/#create=true",
  githubUrl = "https://github.com/suneelprojects/eazydatafix",
  downloadName,
  header,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const html =
    language === "python"
      ? highlightPython(code)
      : language === "bash"
        ? highlightBash(code)
        : code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleDownload = () => {
    const ext = language === "python" ? "py" : language === "bash" ? "sh" : "txt";
    const name = downloadName ?? `snippet.${ext}`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "not-prose overflow-hidden rounded-lg border border-border shadow-sm",
        "bg-[color:var(--color-syntax-bg)] text-[color:var(--color-syntax-fg)]",
        className,
      )}
    >
      {showChrome && (
        <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </div>
            {filename && (
              <div className="ml-2 flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/70 truncate">
                <FileCode className="h-3 w-3 shrink-0" />
                <span className="font-mono truncate">{filename}</span>
              </div>
            )}
            {header}
          </div>
          <div className="flex items-center gap-1 text-xs text-white/60">
            <span className="hidden sm:inline uppercase tracking-wider">{language}</span>
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex items-center gap-1 border-b border-white/5 bg-black/10 px-2 py-1 text-xs">
          <ActionBtn
            onClick={handleCopy}
            label={copied ? "Copied" : "Copy"}
            icon={copied ? Check : Copy}
          />
          <ActionBtn onClick={handleDownload} label="Download" icon={Download} />
          <ActionLink href={colabUrl} label="Colab" icon={ExternalLink} />
          <ActionLink href={githubUrl} label="GitHub" icon={ExternalLink} />
        </div>
      )}

      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-[1.65]">
        <code className="font-mono">
          {showLineNumbers ? (
            <span className="table w-full">
              {lines.map((_, idx) => (
                <span key={idx} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-white/25">
                    {idx + 1}
                  </span>
                  <span
                    className="table-cell"
                    dangerouslySetInnerHTML={{
                      __html:
                        language === "python"
                          ? highlightPython(lines[idx])
                          : language === "bash"
                            ? highlightBash(lines[idx])
                            : lines[idx],
                    }}
                  />
                </span>
              ))}
            </span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </code>
      </pre>
    </div>
  );
}

function ActionBtn({
  onClick,
  label,
  icon: Icon,
}: {
  onClick: () => void;
  label: string;
  icon: typeof Copy;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded px-2 py-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      <Icon className="h-3 w-3" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ActionLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Copy;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded px-2 py-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      <Icon className="h-3 w-3" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
