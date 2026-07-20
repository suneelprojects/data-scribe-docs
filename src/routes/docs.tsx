import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DocsSidebar } from "@/components/DocsSidebar";
import { OnThisPage } from "@/components/OnThisPage";
import { CommunityWidget } from "@/components/CommunityWidget";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

function DocsLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className="grid py-8 gap-6 lg:gap-8 lg:grid-cols-[220px_minmax(0,1fr)_220px] xl:grid-cols-[220px_minmax(0,1fr)_240px]">
        {/* Left sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            <DocsSidebar />
            <div className="mt-8 border-t border-border pt-6">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Community
              </div>
              <CommunityWidget variant="stack" />
            </div>
          </div>
        </aside>

        {/* Mobile sidebar trigger */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground"
              >
                <Menu className="h-4 w-4" />
                Documentation menu
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto p-4">
              <SheetTitle className="mb-4 text-sm">Documentation</SheetTitle>
              <DocsSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <Outlet />
        </div>

        {/* On this page (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <OnThisPage />
          </div>
        </aside>
      </div>
    </div>
  );
}
