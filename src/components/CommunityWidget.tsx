import { BadgeCheck, Code2, Package, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Latest Release", value: "v1.0.0", sub: "PyPI", icon: Package },
  { label: "Python Support", value: "3.10–3.13", sub: "Tested", icon: BadgeCheck },
  { label: "Stable Public Exports", value: "79", sub: "v1 API", icon: Code2 },
  { label: "Open-source License", value: "MIT", sub: "License", icon: ShieldCheck },
];

export function CommunityWidget({ variant = "grid" }: { variant?: "grid" | "stack" }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        variant === "grid" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1",
      )}
    >
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="relative rounded-lg border border-border bg-card p-4">
            <span className="absolute right-2 top-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              {s.sub}
            </span>
            <Icon className="h-4 w-4 text-muted-foreground" />
            <div className="mt-2 font-mono text-xl font-semibold tabular-nums">{s.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}
