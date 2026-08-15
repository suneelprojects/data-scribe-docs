import { createFileRoute } from "@tanstack/react-router";

function handle() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://eazydatafix.com/sitemap.xml\n`,
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=86400",
      },
    },
  );
}

export const Route = createFileRoute("/robots.txt")({
  server: { handlers: { GET: handle } },
});
