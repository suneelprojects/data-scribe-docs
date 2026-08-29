import { createFileRoute } from "@tanstack/react-router";

const staticRoutes = [
  "",
  "/studio",
  "/pricing",
  "/blog",
  "/docs",
  "/docs/installation",
  "/docs/quickstart",
  "/docs/assessment",
  "/docs/fixing",
  "/docs/profiling",
  "/docs/reference",
  "/examples",
  "/analytics",
  "/roadmap",
  "/changelog",
  "/benchmarks",
  "/ecosystem",
  "/contributing",
  "/releases/v1-0-0",
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function handle() {
  const { listPublicArticles } = await import("@/lib/content-studio.server");
  const articles = await listPublicArticles(250);
  const entries = [
    ...staticRoutes.map((route) => ({
      loc: `https://eazydatafix.com${route}`,
      lastmod: route === "" ? new Date().toISOString() : undefined,
    })),
    ...articles.map((article) => ({
      loc: `https://eazydatafix.com/blog/${article.slug}`,
      lastmod: article.updated_at,
    })),
  ];
  const body = entries
    .map(
      (entry) =>
        `  <url><loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""}</url>`,
    )
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
    {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=300, s-maxage=3600",
      },
    },
  );
}

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: handle } },
});
