import { Link } from "@tanstack/react-router";
import { Github, LockKeyhole } from "lucide-react";
import { InstallChip } from "./InstallChip";

const cols: { title: string; links: { label: string; to?: string; href?: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Data Studio", to: "/studio" },
      { label: "Launch pricing", to: "/pricing" },
      { label: "Analysis Ready", to: "/studio" },
      { label: "Power BI Ready", to: "/studio" },
      { label: "ML Ready", to: "/studio" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Documentation", to: "/docs" },
      { label: "API Reference", to: "/docs/reference" },
      { label: "Examples", to: "/examples" },
      { label: "Changelog", to: "/changelog" },
      { label: "Roadmap", to: "/roadmap" },
    ],
  },
  {
    title: "Open Source",
    links: [
      { label: "GitHub", href: "https://github.com/suneelprojects/eazydatafix" },
      { label: "PyPI", href: "https://pypi.org/project/eazydatafix/" },
      { label: "Package analytics", to: "/analytics" },
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
              Turn messy CSV and Excel files into trusted data for analysis, machine learning and
              Power BI.
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
                      <Link
                        to={l.to}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
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
            Created &amp; Maintained by{" "}
            <span className="font-medium text-foreground">Suneel Kumar Kola</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/content-studio"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              title="Private editorial workspace"
            >
              <LockKeyhole className="h-3 w-3" /> Content Studio
            </Link>
            <span className="font-mono">v1.4.0 · MIT</span>
            <a
              href="https://github.com/suneelprojects/eazydatafix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <Github className="h-3 w-3" />
              github.com/suneelprojects/eazydatafix
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
