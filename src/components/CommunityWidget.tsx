import { GitFork, Package, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "GitHub Stars", value: "—", sub: "placeholder", icon: Star },
  { label: "Forks", value: "—", sub: "placeholder", icon: GitFork },
  { label: "Contributors", value: "—", sub: "placeholder", icon: Users },
  { label: "Latest Release", value: "v0.1.0", sub: "PyPI", icon: Package },
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
          <div
            key={s.label}
            className="relative rounded-lg border border-border bg-card p-4"
          >
            <span className="absolute right-2 top-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              {s.sub}
            </span>
            <Icon className="h-4 w-4 text-muted-foreground" />
            <div className="mt-2 font-mono text-xl font-semibold tabular-nums">
              {s.value}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}
