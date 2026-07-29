import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { versions } from "@/content/docs-nav";

export function VersionSwitcher() {
  const [current, setCurrent] = useState(versions[0].value);
  const active = versions.find((v) => v.value === current) ?? versions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground transition-colors hover:bg-muted">
        <span>{active.label}</span>
        {active.status === "latest" && (
          <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-sans font-medium text-accent">
            Latest Stable
          </span>
        )}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs">Version</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {versions.map((v) => (
          <DropdownMenuItem
            key={v.value}
            disabled={v.status === "planned"}
            onSelect={() => setCurrent(v.value)}
            className="flex items-center justify-between font-mono text-xs"
          >
            <span className="flex items-center gap-2">
              {v.value === current ? (
                <Check className="h-3 w-3 text-accent" />
              ) : (
                <span className="h-3 w-3" />
              )}
              {v.label}
            </span>
            <span className="text-[10px] font-sans text-muted-foreground">
              {v.status === "latest" ? "Latest Stable" : "Planned"}
            </span>
          </DropdownMenuItem>
        ))}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
