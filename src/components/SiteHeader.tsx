import { Link, useRouterState } from "@tanstack/react-router";
import { Github, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VersionSwitcher } from "./VersionSwitcher";
import { DocSearch } from "./DocSearch";
import { InstallChip } from "./InstallChip";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/docs", label: "Documentation" },
  { to: "/docs/reference", label: "API Reference" },
  { to: "/examples", label: "Examples" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/contributing", label: "Contributing" },
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
          <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
            v0.1.0
          </span>
        </Link>

        <div className="hidden lg:block">
          <VersionSwitcher />
        </div>

        <nav className="ml-2 hidden items-center gap-1 lg:flex">
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
          <div className="hidden xl:block">
            <InstallChip />
          </div>
          <div className="hidden md:block">
            <DocSearch />
          </div>

          <a
            href="https://github.com/eazydatafix/eazydatafix"
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

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted lg:hidden"
                aria-label="Menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="border-b border-border p-4">
                <VersionSwitcher />
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
                <InstallChip />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 px-4 py-1.5 md:hidden">
        <DocSearch />
      </div>
    </header>
  );
}
