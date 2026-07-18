import { createFileRoute } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { ecosystem } from "@/content/ecosystem";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "Ecosystem — EazyDataFix" },
      { name: "description", content: "The wider EazyDataFix ecosystem: CLI, REST API, VS Code extension and more." },
      { property: "og:title", content: "Ecosystem — EazyDataFix" },
      { property: "og:description", content: "The wider EazyDataFix ecosystem." },
    ],
  }),
  component: Page,
});

function statusStyles(s: "Available" | "Coming Soon" | "Planned") {
  if (s === "Available") return "bg-accent/15 text-accent";
  if (s === "Coming Soon") return "bg-muted text-foreground";
  return "bg-muted/60 text-muted-foreground";
}

function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <DocPageHeader
        breadcrumbs={[{ label: "Ecosystem" }]}
        title="Ecosystem"
        description="EazyDataFix is more than one Python package. Here is the wider surface area we&rsquo;re building toward."
      />
      <div className="space-y-10">
        {ecosystem.map((g) => (
          <section key={g.label}>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g.label}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Icon className="h-5 w-5 text-accent" />
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                          statusStyles(item.status),
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-foreground">{item.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
