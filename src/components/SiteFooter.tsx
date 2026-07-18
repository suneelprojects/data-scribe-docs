import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { InstallChip } from "./InstallChip";

const cols: { title: string; links: { label: string; to?: string; href?: string }[] }[] = [
  {
    title: "Documentation",
    links: [
      { label: "Introduction", to: "/docs" },
      { label: "Installation", to: "/docs/installation" },
      { label: "Quick Start", to: "/docs/quickstart" },
      { label: "API Reference", to: "/docs/reference" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Roadmap", to: "/roadmap" },
      { label: "Changelog", to: "/changelog" },
      { label: "Benchmarks", to: "/benchmarks" },
      { label: "Ecosystem", to: "/ecosystem" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/eazydatafix/eazydatafix" },
      { label: "PyPI", href: "https://pypi.org/project/eazydatafix/" },
      { label: "License", href: "https://opensource.org/licenses/MIT" },
      { label: "Contributing", to: "/contributing" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded bg-foreground text-background font-mono text-[11px] font-bold">
                edf
              </span>
              <span className="font-semibold">EazyDataFix</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Open-source Python library for automated data quality assessment and cleaning.
            </p>
            <div className="mt-4">
              <InstallChip variant="compact" />
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {c.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) =>
                  l.to ? (
                    <li key={l.label}>
                      <Link to={l.to} className="text-muted-foreground transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>
            Created &amp; Maintained by <span className="font-medium text-foreground">Suneel Kumar Kola</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">MIT License</span>
            <a
              href="https://github.com/eazydatafix/eazydatafix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <Github className="h-3 w-3" />
              github.com/eazydatafix
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
