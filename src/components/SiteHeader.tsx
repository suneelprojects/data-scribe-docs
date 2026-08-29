import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Github, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VersionSwitcher } from "./VersionSwitcher";
import { DocSearch } from "./DocSearch";
import { InstallChip } from "./InstallChip";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Product" },
  { to: "/studio", label: "Data Studio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Resources" },
  { to: "/docs", label: "Developers" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-6 w-6 place-items-center rounded bg-foreground text-background font-mono text-[11px] font-bold">
            edf
          </span>
          <span className="font-semibold tracking-tight">EazyDataFix</span>
          <span className="hidden rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent sm:inline">
            v1.4.0
          </span>
        </Link>

        {pathname.startsWith("/docs") && (
          <div className="hidden xl:block">
            <VersionSwitcher />
          </div>
        )}

        <nav className="ml-2 hidden items-center gap-1 xl:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                isActive(l.to)
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            {pathname.startsWith("/docs") && <DocSearch compact />}
          </div>

          <a
            href="https://github.com/suneelprojects/eazydatafix"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            to="/studio"
            className="hidden h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-xs font-semibold text-background transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Try Studio <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted xl:hidden"
                aria-label="Menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">EazyDataFix</span>
                  <span className="rounded bg-accent/10 px-2 py-1 font-mono text-[10px] text-accent">
                    v1.4.0
                  </span>
                </div>
              </div>
              <nav className="flex flex-col p-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm",
                      isActive(l.to)
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-border p-4">
                <Link
                  to="/studio"
                  onClick={() => setOpen(false)}
                  className="mb-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background"
                >
                  Try Data Studio <ArrowRight className="h-4 w-4" />
                </Link>
                <InstallChip />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {pathname.startsWith("/docs") && (
        <div className="border-t border-border bg-muted/30 px-4 py-1.5 md:hidden">
          <DocSearch />
        </div>
      )}
    </header>
  );
}
