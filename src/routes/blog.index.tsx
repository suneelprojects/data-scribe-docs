import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarDays, Search } from "lucide-react";
import { getPublishedArticles } from "@/lib/content-studio.functions";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Data Quality & Data Analysis Blog — EazyDataFix" },
      {
        name: "description",
        content:
          "Practical guides to data cleaning, data quality, analyst time sinks, reproducible preparation and auditable EazyDataFix workflows.",
      },
      { property: "og:title", content: "Data Quality & Data Analysis Blog — EazyDataFix" },
      {
        property: "og:description",
        content:
          "People-first tutorials and practical solutions for turning messy data into analysis-ready datasets.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://eazydatafix.com/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://eazydatafix.com/blog" }],
  }),
  loader: () => getPublishedArticles({ data: { limit: 100 } }),
  component: BlogIndex,
});

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function BlogIndex() {
  const articles = Route.useLoaderData();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div>
      <section className="border-b border-border bg-muted/25">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            EazyDataFix Journal
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Better analysis begins with better data.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Practical explanations of messy-data problems, repetitive analyst work, data quality and
            reproducible EazyDataFix workflows—written for people who work with real datasets.
          </p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {["Data quality", "Data cleaning", "Analyst workflows", "Python tutorials"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-background px-3 py-1.5"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {featured ? (
          <>
            <section aria-labelledby="featured-article">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Latest article
                  </div>
                  <h2 id="featured-article" className="sr-only">
                    Featured article
                  </h2>
                </div>
                <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                  <Search className="h-3.5 w-3.5" /> People-first, SEO-ready guidance
                </div>
              </div>
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="group grid overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-xl hover:shadow-accent/5 lg:grid-cols-[1.2fr_0.8fr]"
              >
                <div className="p-6 sm:p-9 lg:p-12">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent">
                      {featured.pillar}
                    </span>
                    <span>{featured.content_type.replace("_", " ")}</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {featured.excerpt}
                  </p>
                  <div className="mt-7 inline-flex items-center gap-2 text-sm font-medium">
                    Read article{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                <div className="flex min-h-64 items-end bg-gradient-to-br from-accent/25 via-muted to-background p-7 sm:p-9">
                  <div className="w-full rounded-xl border border-border/70 bg-background/85 p-5 backdrop-blur">
                    <BookOpen className="h-5 w-5 text-accent" />
                    <div className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Primary topic
                    </div>
                    <div className="mt-1 text-lg font-medium">{featured.primary_keyword}</div>
                    <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(
                        featured.published_at ?? featured.scheduled_at ?? featured.created_at,
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </section>

            <section className="mt-14" aria-labelledby="all-articles">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Explore
                  </div>
                  <h2 id="all-articles" className="mt-1 text-2xl font-semibold">
                    More practical guides
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">{articles.length} published</span>
              </div>
              {rest.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <Link
                      key={article.id}
                      to="/blog/$slug"
                      params={{ slug: article.slug }}
                      className="group flex min-h-72 flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded-full bg-muted px-2.5 py-1">{article.pillar}</span>
                        <span>
                          {formatDate(
                            article.published_at ?? article.scheduled_at ?? article.created_at,
                          )}
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-semibold leading-snug">{article.title}</h3>
                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium">
                        Read guide{" "}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  The next reviewed guide will appear here after publication.
                </p>
              )}
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-accent" />
            <h2 className="mt-4 text-xl font-semibold">
              The first practical guide is being reviewed
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              EazyDataFix articles are reviewed for technical accuracy and usefulness before they
              are published.
            </p>
            <Link
              to="/docs/quickstart"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent"
            >
              Read the quick start <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
