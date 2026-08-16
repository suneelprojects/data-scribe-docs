import { createFileRoute } from "@tanstack/react-router";

async function handle({ request }: { request: Request }) {
  const { verifyCronSecret } = await import("@/lib/content-studio.server");
  if (!verifyCronSecret(request)) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { runInstagramTick } = await import("@/lib/instagram-studio.server");
    const result = await runInstagramTick();
    return Response.json(
      { success: result.errors.length === 0, ...result },
      { status: result.errors.length === 0 ? 200 : 500 },
    );
  } catch (error) {
    console.error("[instagram-studio-cron] tick failed", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Instagram automation failed",
      },
      { status: 500 },
    );
  }
}

export const Route = createFileRoute("/api/cron/instagram-studio-tick")({
  server: {
    handlers: {
      POST: handle,
    },
  },
});
