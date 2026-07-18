import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { InstallChip } from "./InstallChip";

export type Crumb = { label: string; to?: string };

export function DocPageHeader({
  breadcrumbs,
  title,
  description,
  showInstall = true,
}: {
  breadcrumbs?: Crumb[];
  title: string;
  description?: string;
  showInstall?: boolean;
}) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          {breadcrumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {c.to ? (
                <Link to={c.to} className="hover:text-foreground">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      {description && (
        <p className="mt-2 max-w-3xl text-base text-muted-foreground">{description}</p>
      )}
      {showInstall && (
        <div className="mt-4">
          <InstallChip />
        </div>
      )}
    </header>
  );
}
