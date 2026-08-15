import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Tag } from "lucide-react";
import { ArticleMarkdown } from "@/components/ArticleMarkdown";
import { getPublishedArticle, getPublishedArticles } from "@/lib/content-studio.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const [article, articles] = await Promise.all([
      getPublishedArticle({ data: { slug: params.slug } }),
      getPublishedArticles({ data: { limit: 12 } }),
    ]);
    if (!article) throw notFound();
    return { article, related: articles.filter((item) => item.id !== article.id).slice(0, 3) };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return { meta: [{ title: "Article — EazyDataFix" }] };
    const canonical = article.canonical_url || `https://eazydatafix.com/blog/${article.slug}`;
    return {
      meta: [
        { title: article.meta_title },
        { name: "description", content: article.meta_description },
        { name: "author", content: "Suneel Kumar Kola" },
        {
          name: "keywords",
          content: [article.primary_keyword, ...article.secondary_keywords].join(", "),
        },
        { property: "og:title", content: article.og_title },
        { property: "og:description", content: article.og_description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        {
          property: "article:published_time",
          content: article.published_at ?? article.scheduled_at ?? article.created_at,
        },
        { property: "article:modified_time", content: article.updated_at },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: article.og_title },
        { name: "twitter:description", content: article.og_description },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: BlogArticle,
});

function readingMinutes(markdown: string) {
  const words = markdown
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function BlogArticle() {
  const { article, related } = Route.useLoaderData();
  const publishedAt = article.published_at ?? article.scheduled_at ?? article.created_at;
  const canonical = article.canonical_url || `https://eazydatafix.com/blog/${article.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.meta_description,
    datePublished: publishedAt,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: "Suneel Kumar Kola" },
    publisher: { "@type": "Organization", name: "EazyDataFix", url: "https://eazydatafix.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    keywords: [article.primary_keyword, ...article.secondary_keywords].join(", "),
  };

  return (
    <article>
      <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
      <header className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to the journal
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">
              {article.pillar}
            </span>
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3 w-3" /> {article.primary_keyword}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {article.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Suneel Kumar Kola</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> {formatDate(publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" /> {readingMinutes(article.content_markdown)} min read
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:py-16">
        <div className="min-w-0">
          <ArticleMarkdown markdown={article.content_markdown} />

          {article.faq.length > 0 && (
            <section className="mt-12 border-t border-border pt-10" aria-labelledby="article-faq">
              <h2 id="article-faq" className="text-2xl font-semibold">
                Frequently asked questions
              </h2>
              <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-card px-5">
                {article.faq.map((item) => (
                  <details key={item.question} className="group py-4">
                    <summary className="cursor-pointer list-none pr-6 text-sm font-medium marker:hidden">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12 rounded-2xl bg-foreground p-6 text-background sm:p-8">
            <div className="font-mono text-xs uppercase tracking-wider text-background/65">
              Continue with EazyDataFix
            </div>
            <h2 className="mt-2 text-2xl font-semibold">
              Turn this idea into a reproducible workflow.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-background/70">
              Install the stable release, use the verified quick start and inspect every cleaning or
              validation result.
            </p>
            <Link
              to={article.cta_url}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground"
            >
              {article.cta_text} <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Article details
          </div>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Search intent</dt>
              <dd className="mt-1 capitalize">{article.search_intent.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Format</dt>
              <dd className="mt-1 capitalize">{article.content_type.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Related topics</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {article.secondary_keywords.slice(0, 5).map((item) => (
                  <span key={item} className="rounded bg-muted px-2 py-1 text-xs">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="text-2xl font-semibold">Continue learning</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to="/blog/$slug"
                  params={{ slug: item.slug }}
                  className="group rounded-xl border border-border bg-background p-5 hover:border-accent/60"
                >
                  <div className="text-xs text-muted-foreground">{item.pillar}</div>
                  <h3 className="mt-3 font-semibold leading-snug">{item.title}</h3>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                    Read next{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
