import { createFileRoute } from "@tanstack/react-router";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function handle() {
  const { listPublicArticles } = await import("@/lib/content-studio.server");
  const articles = await listPublicArticles(50);
  const items = articles
    .map((article) => {
      const url = `https://eazydatafix.com/blog/${article.slug}`;
      const date = article.published_at ?? article.scheduled_at ?? article.created_at;
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>EazyDataFix Journal</title>
    <link>https://eazydatafix.com/blog</link>
    <description>Practical data quality, data cleaning and EazyDataFix workflow guidance.</description>
    <language>en</language>${items}
  </channel>
</rss>`,
    {
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
        "cache-control": "public, max-age=300, s-maxage=3600",
      },
    },
  );
}

export const Route = createFileRoute("/rss.xml")({
  server: { handlers: { GET: handle } },
});
