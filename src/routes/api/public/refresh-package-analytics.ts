import { createFileRoute } from "@tanstack/react-router";

// "refresh-package-analytics": scheduled/manual refresh endpoint.
// Fetches PyPIStats + PyPI + GitHub, stores daily history and caches a snapshot.
async function handle() {
  try {
    const { refreshPackageAnalytics } = await import("@/lib/package-analytics.server");
    const payload = await refreshPackageAnalytics();
    return Response.json({
      success: true,
      refreshedAt: payload.refreshedAt,
      days: payload.daily.length,
      totalDownloads: payload.totalDownloads,
    });
  } catch (error) {
    console.error("[refresh-package-analytics] failed", error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export const Route = createFileRoute("/api/public/refresh-package-analytics")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
