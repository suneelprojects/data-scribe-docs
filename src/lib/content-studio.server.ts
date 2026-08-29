import type { Database, Json } from "@/integrations/supabase/types";
import {
  asFaqItems,
  asQualityChecks,
  asSourceItems,
  asStringArray,
  type ArticleStatus,
  type ContentArticle,
  type ContentArticleInput,
  type ContentStudioDashboard,
  type ContentType,
  type FaqItem,
  type QualityCheck,
  type SearchIntent,
  type SourceItem,
} from "./content-studio.types";

type ArticleRow = Database["public"]["Tables"]["content_articles"]["Row"];

const SITE_URL = "https://eazydatafix.com";
const DEFAULT_MODEL = "gpt-5.6";
const PROMPT_VERSION = "blog-v2-product-v1-4";
const SAFE_INTERNAL_LINKS = [
  "/studio",
  "/pricing",
  "/docs",
  "/docs/quickstart",
  "/docs/assessment",
  "/docs/fixing",
  "/docs/profiling",
  "/docs/reference",
  "/releases/v1-0-0",
  "/examples",
  "/benchmarks",
];

const EAZYDATAFIX_FACTS = `
EazyDataFix product facts you may use:
- Current stable release: v1.4.0, released 26 August 2026, Python 3.10-3.13, MIT licensed.
- The customer-facing direction is EazyDataFix Data Studio: upload, scan, review proposed changes and export trusted data. The current public Studio is an honest browser-local CSV preview, not the full hosted engine.
- It accepts CSV, Excel, JSON, Parquet and pandas.DataFrame inputs.
- edf.analysis_ready_with_report() returns a prepared dataset with before/after scores, changes, warnings and validations.
- edf.ml_ready() prepares leakage-safe supervised-learning inputs, requires an explicit target and fits learned transformations only on training data. It does not train or evaluate a model.
- edf.powerbi_ready() prepares single-table or multi-table model inputs, validates keys and relationship cardinality, can generate a continuous date table and exports readiness evidence. It does not generate PBIX dashboards or visuals.
- edf.run() composes profiling, quality assessment, controlled cleaning and deterministic EDA. It returns a RunResult whose stages can be inspected.
- edf.fix(data, config) supports FixConfig, dry-run previews, per-column ColumnCleaningRule values, a proposed_dataset and a structured change_log.
- edf.prepare_with_report(data, config) supports threshold-gated numeric/date conversion, text normalization and outlier actions. It returns the prepared dataset, changes and warnings.
- edf.infer_schema() creates a reusable DataContract. edf.validate_contract() supports not_null, unique, min and max QualityRule checks.
- The edf CLI supports individual workflows, batch/multi-file processing, JSON/YAML configuration, JSON/JSONL output and stable exit codes.
- Agentic EDA narratives are optional. Core cleaning and validation workflows do not require an LLM.
- Never claim EazyDataFix executes faster than pandas. Explain saved developer effort through fewer repetitive steps, reusable rules, audit trails and reproducible reports.
- Never invent user counts, benchmarks, testimonials, companies, percentages, time saved or performance claims.

Verified v1.x code patterns:
\`\`\`python
import eazydatafix as edf

result = edf.run("employees.csv")
print(result.assessment.quality.score)
print(result.fix_result.change_log)
\`\`\`

\`\`\`python
preview = edf.fix("employees.csv", edf.FixConfig(dry_run=True))
print(preview.change_log)
print(preview.proposed_dataset.head())
\`\`\`

\`\`\`python
contract = edf.infer_schema("baseline.csv")
rules = (
    edf.QualityRule("id_unique", "employee_id", "unique"),
    edf.QualityRule("salary_non_negative", "salary", "min", 0),
)
validation = edf.validate_contract("incoming.csv", contract, rules)
\`\`\`
`;

type GeneratedArticle = {
  content_type: ContentType;
  pillar: string;
  title: string;
  slug: string;
  primary_keyword: string;
  secondary_keywords: string[];
  search_intent: SearchIntent;
  excerpt: string;
  content_markdown: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  faq: FaqItem[];
  internal_links: string[];
  image_prompt: string;
  image_alt: string;
  cta_text: string;
  cta_url: string;
  source_items: SourceItem[];
};

type OpenAIResponsePayload = {
  id?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
  error?: { message?: string };
};

const articleSchema = {
  type: "object",
  additionalProperties: false,
  required: ["articles"],
  properties: {
    articles: {
      type: "array",
      minItems: 1,
      maxItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "content_type",
          "pillar",
          "title",
          "slug",
          "primary_keyword",
          "secondary_keywords",
          "search_intent",
          "excerpt",
          "content_markdown",
          "meta_title",
          "meta_description",
          "og_title",
          "og_description",
          "faq",
          "internal_links",
          "image_prompt",
          "image_alt",
          "cta_text",
          "cta_url",
          "source_items",
        ],
        properties: {
          content_type: {
            type: "string",
            enum: ["educational", "product_tutorial", "case_study", "checklist"],
          },
          pillar: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          primary_keyword: { type: "string" },
          secondary_keywords: { type: "array", items: { type: "string" } },
          search_intent: {
            type: "string",
            enum: ["informational", "problem_solving", "commercial", "navigational"],
          },
          excerpt: { type: "string" },
          content_markdown: { type: "string" },
          meta_title: { type: "string" },
          meta_description: { type: "string" },
          og_title: { type: "string" },
          og_description: { type: "string" },
          faq: {
            type: "array",
            minItems: 3,
            maxItems: 5,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["question", "answer"],
              properties: {
                question: { type: "string" },
                answer: { type: "string" },
              },
            },
          },
          internal_links: { type: "array", items: { type: "string" } },
          image_prompt: { type: "string" },
          image_alt: { type: "string" },
          cta_text: { type: "string" },
          cta_url: { type: "string" },
          source_items: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["title", "url", "note"],
              properties: {
                title: { type: "string" },
                url: { type: "string" },
                note: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
} as const;

function getAdminEmail(claims: unknown): string {
  const email =
    claims && typeof claims === "object" && "email" in claims && typeof claims.email === "string"
      ? claims.email.toLowerCase().trim()
      : "";
  if (!email) throw new Error("Unauthorized: your signed-in account has no email address.");

  const configured = (process.env["CONTENT_ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((value) => value.toLowerCase().trim())
    .filter(Boolean);
  if (configured.length === 0) {
    throw new Error(
      "Content Studio is not configured yet. Add CONTENT_ADMIN_EMAILS in Lovable Cloud.",
    );
  }
  if (!configured.includes(email))
    throw new Error("Forbidden: this account is not a Content Studio admin.");
  return email;
}

function getModel() {
  return process.env["OPENAI_CONTENT_MODEL"]?.trim() || DEFAULT_MODEL;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeArticle(row: ArticleRow): ContentArticle {
  return {
    ...row,
    status: row.status as ArticleStatus,
    content_type: row.content_type as ContentType,
    search_intent: row.search_intent as SearchIntent,
    secondary_keywords: row.secondary_keywords ?? [],
    internal_links: row.internal_links ?? [],
    faq: asFaqItems(row.faq),
    source_items: asSourceItems(row.source_items),
    quality_checks: asQualityChecks(row.quality_checks),
  };
}

function cleanText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`#>*_[\]()!-]/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasKeyword(text: string, keyword: string) {
  return text.toLowerCase().includes(keyword.toLowerCase().trim());
}

function validInternalLink(value: string) {
  return SAFE_INTERNAL_LINKS.includes(value) || value.startsWith("/blog/");
}

function evaluateArticle(
  article: Pick<
    ContentArticle,
    | "title"
    | "slug"
    | "primary_keyword"
    | "content_markdown"
    | "meta_title"
    | "meta_description"
    | "internal_links"
    | "faq"
    | "image_alt"
    | "source_items"
    | "content_type"
  >,
) {
  const plain = cleanText(article.content_markdown);
  const words = plain ? plain.split(/\s+/).length : 0;
  const firstWords = plain.split(/\s+/).slice(0, 180).join(" ");
  const headingCount = (article.content_markdown.match(/^##+\s+/gm) ?? []).length;
  const keywordSlug = slugify(article.primary_keyword);
  const edfApis = [...article.content_markdown.matchAll(/\bedf\.([A-Za-z_][A-Za-z0-9_]*)/g)].map(
    (match) => match[1],
  );
  const allowedApis = new Set([
    "run",
    "fix",
    "profile",
    "assess",
    "prepare_with_report",
    "infer_schema",
    "validate_contract",
    "run_agentic_eda",
    "generate_agentic_eda_narrative",
    "FixConfig",
    "ColumnCleaningRule",
    "PrepareConfig",
    "QualityRule",
  ]);
  const unknownApis = [...new Set(edfApis.filter((name) => !allowedApis.has(name)))];
  const unsupportedClaim =
    /\b(?:\d+(?:\.\d+)?\s*(?:x|times)\s+faster|saves?\s+\d+\s*(?:hours?|minutes?)|\d+%\s+faster)\b/i.test(
      plain,
    );
  const unsafeLinks = article.internal_links.filter((link) => !validInternalLink(link));
  const invalidSources = article.source_items.filter((source) => {
    try {
      const url = new URL(source.url, SITE_URL);
      return !["eazydatafix.com", "docs.python.org", "pandas.pydata.org", "numpy.org"].includes(
        url.hostname,
      );
    } catch {
      return true;
    }
  });

  const seoRules: Array<[boolean, number, string, string]> = [
    [
      hasKeyword(article.title, article.primary_keyword),
      15,
      "keyword-title",
      "Primary keyword appears in the title",
    ],
    [
      Boolean(keywordSlug && article.slug.includes(keywordSlug)),
      10,
      "keyword-slug",
      "Primary keyword is reflected in the slug",
    ],
    [
      hasKeyword(firstWords, article.primary_keyword),
      10,
      "keyword-opening",
      "Primary keyword appears in the opening",
    ],
    [
      article.meta_title.length >= 35 && article.meta_title.length <= 60,
      10,
      "meta-title",
      "Meta title is 35-60 characters",
    ],
    [
      article.meta_description.length >= 120 && article.meta_description.length <= 160,
      10,
      "meta-description",
      "Meta description is 120-160 characters",
    ],
    [words >= 800, 15, "article-depth", "Article contains at least 800 useful words"],
    [headingCount >= 3, 10, "headings", "Article has at least three descriptive sections"],
    [
      article.internal_links.length >= 2 && unsafeLinks.length === 0,
      10,
      "internal-links",
      "Article links to verified EazyDataFix pages",
    ],
    [article.faq.length >= 3, 5, "faq", "Article includes at least three useful FAQs"],
    [article.image_alt.trim().length >= 20, 5, "image-alt", "Image alt text is descriptive"],
  ];
  const seoScore = seoRules.reduce((score, [passed, weight]) => score + (passed ? weight : 0), 0);

  const qualityRules: Array<[boolean, number, string, string, string]> = [
    [
      !unsupportedClaim,
      25,
      "evidence",
      "No unsupported speed or time-saving claims",
      "Remove numerical claims that are not backed by evidence",
    ],
    [
      unknownApis.length === 0,
      25,
      "api-accuracy",
      "EazyDataFix API names are verified",
      `Unknown API names: ${unknownApis.join(", ")}`,
    ],
    [
      invalidSources.length === 0,
      15,
      "sources",
      "Sources use the approved domain list",
      "One or more sources need manual verification",
    ],
    [
      unsafeLinks.length === 0,
      15,
      "link-safety",
      "Internal links point to known routes",
      `Unknown internal links: ${unsafeLinks.join(", ")}`,
    ],
    [
      words >= 800,
      10,
      "substance",
      "Article has enough depth to be useful",
      `Only ${words} words; expand the practical explanation`,
    ],
    [
      !/^#\s+/m.test(article.content_markdown),
      5,
      "single-h1",
      "The page title remains the only H1",
      "Remove the H1 from the article body",
    ],
    [
      article.content_type !== "product_tutorial" || article.content_markdown.includes("```python"),
      5,
      "tutorial-code",
      "Product tutorials include a Python example",
      "Add a verified Python example",
    ],
  ];
  const qualityScore = qualityRules.reduce(
    (score, [passed, weight]) => score + (passed ? weight : 0),
    0,
  );
  const qualityChecks: QualityCheck[] = [
    ...seoRules.map(([passed, , id, label]) => ({
      id,
      label,
      passed,
      detail: passed ? "Passed" : "Needs attention",
    })),
    ...qualityRules.map(([passed, , id, label, failure]) => ({
      id,
      label,
      passed,
      detail: passed ? "Passed" : failure,
    })),
  ];
  return { seoScore, qualityScore, qualityChecks };
}

async function uniqueSlug(candidate: string, excludeId?: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const base = slugify(candidate) || `data-analysis-${Date.now()}`;
  const { data } = await supabaseAdmin
    .from("content_articles")
    .select("id, slug")
    .like("slug", `${base}%`)
    .limit(100);
  const used = new Set((data ?? []).filter((row) => row.id !== excludeId).map((row) => row.slug));
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

async function audit(
  articleId: string | null,
  action: string,
  actorEmail: string,
  details: Json = {},
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("content_audit_log").insert({
    article_id: articleId,
    action,
    actor_email: actorEmail,
    details,
  });
  if (error) console.error("[content-studio] audit insert failed", error);
}

function extractOutputText(payload: OpenAIResponsePayload) {
  return (payload.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type === "output_text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

async function callOpenAI(
  count: number,
  topic: string | undefined,
  existingArticles: ArticleRow[],
) {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured in Lovable Cloud.");
  const model = getModel();
  const existing = existingArticles
    .slice(0, 120)
    .map((article) => `- ${article.title} | ${article.primary_keyword} | ${article.content_type}`)
    .join("\n");
  const requestedMix =
    count === 2
      ? "Create exactly two different articles: one educational/problem-solving article and one product-led tutorial."
      : "Create exactly one useful article using the best content type for the requested topic.";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      store: false,
      max_output_tokens: 14000,
      instructions: `You are the senior technical editor for EazyDataFix.com. Produce accurate, people-first articles for data analysts and Python users. Return only the requested structured output. ${EAZYDATAFIX_FACTS}`,
      input: `
${requestedMix}

${topic?.trim() ? `Editorial direction supplied by the admin: ${topic.trim()}` : "Choose fresh topics from the approved pillars."}

Approved pillars: messy data problems, analyst time sinks, data quality, reproducible cleaning, EazyDataFix tutorials, data contracts, preparation reports, auditing, and practical checklists.

Editorial requirements:
- Each article must be 900-1,400 words, original, useful without requiring a purchase, and written in clear English.
- Do not add an H1 in content_markdown; the title is the page H1. Start the body with a compelling paragraph.
- Use at least three H2 sections, concrete examples and an actionable conclusion.
- Product tutorials must use only a verified code pattern included in the product facts.
- Explain saved effort, not CPU speed. Never invent numerical outcomes, benchmarks, users, customers or testimonials.
- Keep the meta title at 35-60 characters and meta description at 120-160 characters.
- Use 2-4 links selected only from: ${SAFE_INTERNAL_LINKS.join(", ")}.
- CTA URLs must also come from that list.
- Source items may use only EazyDataFix pages, docs.python.org, pandas.pydata.org/docs or numpy.org/doc. Use an empty array when no external source is necessary; never invent a URL.
- Image prompts must describe a clean editorial illustration without embedded words, logos or UI screenshots.

Avoid duplicating or cannibalising these existing topics:
${existing || "- No existing articles yet."}
`,
      text: {
        format: {
          type: "json_schema",
          name: "eazydatafix_content_articles",
          strict: true,
          schema: articleSchema,
        },
      },
    }),
  });

  const payload = (await response.json()) as OpenAIResponsePayload;
  if (!response.ok) {
    throw new Error(
      payload.error?.message || `OpenAI generation failed with status ${response.status}.`,
    );
  }
  const text = extractOutputText(payload);
  if (!text) throw new Error("OpenAI returned no article content.");
  const parsed = JSON.parse(text) as { articles?: GeneratedArticle[] };
  if (!Array.isArray(parsed.articles) || parsed.articles.length !== count) {
    throw new Error(`OpenAI returned ${parsed.articles?.length ?? 0} articles; expected ${count}.`);
  }
  return {
    articles: parsed.articles,
    model,
    inputTokens: payload.usage?.input_tokens ?? null,
    outputTokens: payload.usage?.output_tokens ?? null,
  };
}

function istDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export async function generateDrafts(options: {
  count: number;
  topic?: string;
  actorEmail: string;
  runType: "manual" | "daily";
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const count = Math.max(1, Math.min(2, options.count));
  const runDate = options.runType === "daily" ? istDate() : null;
  const model = getModel();

  if (runDate) {
    const { data: existingRun } = await supabaseAdmin
      .from("content_generation_runs")
      .select("id, status, article_count")
      .eq("run_type", "daily")
      .eq("run_date", runDate)
      .maybeSingle();
    if (existingRun)
      return { skipped: true, created: existingRun.article_count, articleIds: [] as string[] };
  }

  const { data: run, error: runError } = await supabaseAdmin
    .from("content_generation_runs")
    .insert({
      run_type: options.runType,
      run_date: runDate,
      status: "running",
      model,
      prompt_version: PROMPT_VERSION,
      requested_by_email: options.actorEmail,
    })
    .select("id")
    .single();
  if (runError || !run) throw new Error(runError?.message || "Unable to start content generation.");

  try {
    const { data: existingArticles, error: existingError } = await supabaseAdmin
      .from("content_articles")
      .select("*")
      .neq("status", "archived")
      .order("created_at", { ascending: false })
      .limit(120);
    if (existingError) throw new Error(existingError.message);

    const generated = await callOpenAI(count, options.topic, existingArticles ?? []);
    const rows = [];
    for (const article of generated.articles) {
      const slug = await uniqueSlug(article.slug || article.title);
      const evaluated = evaluateArticle({ ...article, slug });
      rows.push({
        status: "draft",
        ...article,
        slug,
        canonical_url: `${SITE_URL}/blog/${slug}`,
        internal_links: article.internal_links.filter(validInternalLink),
        faq: article.faq as unknown as Json,
        source_items: article.source_items as unknown as Json,
        seo_score: evaluated.seoScore,
        quality_score: evaluated.qualityScore,
        quality_checks: evaluated.qualityChecks as unknown as Json,
        model: generated.model,
        prompt_version: PROMPT_VERSION,
        created_by_email: options.actorEmail,
        updated_by_email: options.actorEmail,
      });
    }
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("content_articles")
      .insert(rows)
      .select("*");
    if (insertError) throw new Error(insertError.message);
    const articleIds = (inserted ?? []).map((article) => article.id);
    await supabaseAdmin
      .from("content_generation_runs")
      .update({
        status: articleIds.length === count ? "completed" : "partial",
        article_count: articleIds.length,
        article_ids: articleIds,
        input_tokens: generated.inputTokens,
        output_tokens: generated.outputTokens,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
    await Promise.all(
      articleIds.map((id) => audit(id, "generated", options.actorEmail, { run_id: run.id })),
    );
    return { skipped: false, created: articleIds.length, articleIds };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    await supabaseAdmin
      .from("content_generation_runs")
      .update({ status: "failed", error_message: message, completed_at: new Date().toISOString() })
      .eq("id", run.id);
    throw error;
  }
}

export async function getDashboard(claims: unknown): Promise<ContentStudioDashboard> {
  const adminEmail = getAdminEmail(claims);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [articlesResult, runsResult, settingsResult] = await Promise.all([
    supabaseAdmin
      .from("content_articles")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(250),
    supabaseAdmin
      .from("content_generation_runs")
      .select(
        "id, run_type, status, article_count, model, requested_by_email, error_message, created_at, completed_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabaseAdmin.from("content_studio_settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  if (articlesResult.error) throw new Error(articlesResult.error.message);
  if (runsResult.error) throw new Error(runsResult.error.message);
  const articles = (articlesResult.data ?? []).map(normalizeArticle);
  const published = articles.filter((article) => article.status === "published");
  const averageSeoScore = published.length
    ? Math.round(published.reduce((sum, article) => sum + article.seo_score, 0) / published.length)
    : 0;
  return {
    adminEmail,
    articles,
    stats: {
      total: articles.length,
      draft: articles.filter((article) => article.status === "draft").length,
      review: articles.filter((article) => article.status === "review").length,
      scheduled: articles.filter((article) => article.status === "scheduled").length,
      published: published.length,
      averageSeoScore,
    },
    recentRuns: runsResult.data ?? [],
    settings: {
      dailyDraftCount: settingsResult.data?.daily_draft_count ?? 2,
      defaultAuthor: settingsResult.data?.default_author ?? "Suneel Kumar Kola",
      model: getModel(),
      promptVersion: settingsResult.data?.prompt_version ?? PROMPT_VERSION,
      automationReady: Boolean(process.env["OPENAI_API_KEY"] && process.env["CONTENT_CRON_SECRET"]),
    },
  };
}

export async function saveArticle(input: ContentArticleInput, claims: unknown) {
  const adminEmail = getAdminEmail(claims);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const slug = await uniqueSlug(input.slug || input.title, input.id);
  const evaluated = evaluateArticle({ ...input, slug });
  const update = {
    title: input.title.trim(),
    slug,
    content_type: input.content_type,
    pillar: input.pillar.trim(),
    primary_keyword: input.primary_keyword.trim(),
    secondary_keywords: input.secondary_keywords.map((item) => item.trim()).filter(Boolean),
    search_intent: input.search_intent,
    excerpt: input.excerpt.trim(),
    content_markdown: input.content_markdown.trim(),
    meta_title: input.meta_title.trim(),
    meta_description: input.meta_description.trim(),
    canonical_url: input.canonical_url?.trim() || `${SITE_URL}/blog/${slug}`,
    og_title: input.og_title.trim(),
    og_description: input.og_description.trim(),
    faq: input.faq as unknown as Json,
    internal_links: input.internal_links.filter(validInternalLink),
    image_prompt: input.image_prompt.trim(),
    image_alt: input.image_alt.trim(),
    cta_text: input.cta_text.trim(),
    cta_url: validInternalLink(input.cta_url) ? input.cta_url : "/docs/quickstart",
    source_items: input.source_items as unknown as Json,
    seo_score: evaluated.seoScore,
    quality_score: evaluated.qualityScore,
    quality_checks: evaluated.qualityChecks as unknown as Json,
    updated_by_email: adminEmail,
  };
  const { data, error } = await supabaseAdmin
    .from("content_articles")
    .update(update)
    .eq("id", input.id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Article could not be saved.");
  await audit(input.id, "updated", adminEmail, {
    seo_score: evaluated.seoScore,
    quality_score: evaluated.qualityScore,
  });
  return normalizeArticle(data);
}

export async function setArticleStatus(
  input: { id: string; status: ArticleStatus; scheduledAt?: string | null },
  claims: unknown,
) {
  const adminEmail = getAdminEmail(claims);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: current, error: currentError } = await supabaseAdmin
    .from("content_articles")
    .select("*")
    .eq("id", input.id)
    .single();
  if (currentError || !current) throw new Error(currentError?.message || "Article not found.");
  if ((input.status === "published" || input.status === "scheduled") && current.seo_score < 70) {
    throw new Error("SEO score must be at least 70 before publication.");
  }
  if (
    (input.status === "published" || input.status === "scheduled") &&
    current.quality_score < 80
  ) {
    throw new Error("Quality score must be at least 80 before publication.");
  }
  if (input.status === "scheduled") {
    if (!input.scheduledAt) throw new Error("Choose a publication date and time.");
    const scheduled = new Date(input.scheduledAt);
    if (!Number.isFinite(scheduled.getTime()) || scheduled.getTime() <= Date.now()) {
      throw new Error("Scheduled publication time must be in the future.");
    }
  }
  const patch = {
    status: input.status,
    scheduled_at: input.status === "scheduled" ? new Date(input.scheduledAt!).toISOString() : null,
    published_at:
      input.status === "published" ? (current.published_at ?? new Date().toISOString()) : null,
    updated_by_email: adminEmail,
  };
  const { data, error } = await supabaseAdmin
    .from("content_articles")
    .update(patch)
    .eq("id", input.id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Article status could not be changed.");
  await audit(input.id, input.status, adminEmail, {
    scheduled_at: patch.scheduled_at,
    published_at: patch.published_at,
  });
  return normalizeArticle(data);
}

export async function listPublicArticles(limit = 100): Promise<ContentArticle[]> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("content_articles")
      .select("*")
      .in("status", ["published", "scheduled"])
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) {
      console.error("[content-studio] public article list failed", error);
      return [];
    }
    const now = Date.now();
    return (data ?? [])
      .filter(
        (row) =>
          row.status === "published" ||
          (row.status === "scheduled" &&
            row.scheduled_at &&
            new Date(row.scheduled_at).getTime() <= now),
      )
      .map(normalizeArticle)
      .sort((a, b) => {
        const left = a.published_at ?? a.scheduled_at ?? a.created_at;
        const right = b.published_at ?? b.scheduled_at ?? b.created_at;
        return right.localeCompare(left);
      });
  } catch (error) {
    console.error("[content-studio] public article storage unavailable", error);
    return [];
  }
}

export async function getPublicArticle(slug: string): Promise<ContentArticle | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("content_articles")
      .select("*")
      .eq("slug", slug)
      .in("status", ["published", "scheduled"])
      .maybeSingle();
    if (error || !data) return null;
    if (
      data.status === "scheduled" &&
      (!data.scheduled_at || new Date(data.scheduled_at).getTime() > Date.now())
    ) {
      return null;
    }
    return normalizeArticle(data);
  } catch (error) {
    console.error("[content-studio] public article storage unavailable", error);
    return null;
  }
}

export function verifyCronSecret(request: Request) {
  const expected = process.env["CONTENT_CRON_SECRET"];
  if (!expected) return false;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let index = 0; index < provided.length; index += 1) {
    mismatch |= provided.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}

export function readAdminEmail(claims: unknown) {
  return getAdminEmail(claims);
}
