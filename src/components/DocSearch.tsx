import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, FileText, Book, Package, Compass } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchDocs, type SearchEntry } from "@/content/search-index";

const sectionIcons: Record<SearchEntry["section"], typeof FileText> = {
  "Getting Started": Compass,
  Guides: Book,
  Reference: Package,
  Meta: FileText,
};

export function DocSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchDocs(q), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.key === "/" && (e.target as HTMLElement)?.tagName === "INPUT") return;
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      setQ("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  const go = (url: string) => {
    setOpen(false);
    navigate({ to: url });
  };

  const grouped = useMemo(() => {
    const groups: Record<string, SearchEntry[]> = {};
    for (const r of results) {
      (groups[r.section] ??= []).push(r);
    }
    return groups;
  }, [results]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted md:w-64"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search documentation...</span>
        <kbd className="hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] md:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl overflow-hidden p-0 gap-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Search documentation</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter" && results[active]) {
                  e.preventDefault();
                  go(results[active].url);
                }
              }}
              placeholder="Search documentation..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              Esc
            </kbd>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No results for &ldquo;{q}&rdquo;
              </div>
            ) : (
              Object.entries(grouped).map(([section, items]) => (
                <div key={section} className="mb-2">
                  <div className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section}
                  </div>
                  {items.map((r) => {
                    const Icon = sectionIcons[r.section];
                    const globalIdx = results.indexOf(r);
                    const isActive = globalIdx === active;
                    return (
                      <button
                        key={r.url}
                        type="button"
                        onMouseEnter={() => setActive(globalIdx)}
                        onClick={() => go(r.url)}
                        className={
                          "flex w-full items-start gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors " +
                          (isActive ? "bg-muted" : "hover:bg-muted/50")
                        }
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground">{r.title}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {r.description}
                          </div>
                        </div>
                        <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                          {r.url}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span><kbd className="rounded border border-border bg-background px-1 font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="rounded border border-border bg-background px-1 font-mono">↵</kbd> open</span>
            </div>
            <Link to="/docs" onClick={() => setOpen(false)} className="hover:text-foreground">
              Browse all docs →
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
