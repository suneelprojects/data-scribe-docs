import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function InstallChip({
  variant = "default",
  className,
}: {
  variant?: "default" | "compact";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const cmd = "pip install eazydatafix";

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy install command"
      className={cn(
        "group inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs font-mono text-foreground transition-colors hover:bg-muted",
        variant === "compact" && "px-2 py-1 text-[11px]",
        className,
      )}
    >
      <span className="text-muted-foreground select-none">$</span>
      <span>{cmd}</span>
      {copied ? (
        <Check className="h-3 w-3 text-accent" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
      )}
    </button>
  );
}
