import { Link, useRouterState } from "@tanstack/react-router";
import { docsNav } from "@/content/docs-nav";
import { cn } from "@/lib/utils";

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="space-y-6 text-sm">
      {docsNav.map((group) => (
        <div key={group.label}>
          <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </div>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                pathname === item.url ||
                (item.url !== "/docs" && pathname.startsWith(item.url + "/"));
              return (
                <li key={item.url}>
                  <Link
                    to={item.url}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1.5 transition-colors",
                      active
                        ? "bg-muted font-medium text-foreground border-l-2 border-accent -ml-[2px]"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-mono text-accent">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
