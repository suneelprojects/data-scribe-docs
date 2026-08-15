import { createFileRoute } from "@tanstack/react-router";

async function handle({ request }: { request: Request }) {
  const { generateDrafts, verifyCronSecret } = await import("@/lib/content-studio.server");
  if (!verifyCronSecret(request)) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await generateDrafts({
      count: 2,
      actorEmail: "automation@eazydatafix.com",
      runType: "daily",
    });
    return Response.json({ success: true, ...result });
  } catch (error) {
    console.error("[content-studio-cron] generation failed", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Content generation failed",
      },
      { status: 500 },
    );
  }
}

export const Route = createFileRoute("/api/cron/generate-blog-drafts")({
  server: {
    handlers: {
      POST: handle,
    },
  },
});
