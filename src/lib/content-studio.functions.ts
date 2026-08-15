import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ARTICLE_STATUSES, CONTENT_TYPES, SEARCH_INTENTS } from "./content-studio.types";

const faqSchema = z.object({ question: z.string(), answer: z.string() });
const sourceSchema = z.object({ title: z.string(), url: z.string(), note: z.string() });

const articleInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(160),
  slug: z.string().max(100),
  content_type: z.enum(CONTENT_TYPES),
  pillar: z.string().min(1).max(100),
  primary_keyword: z.string().min(1).max(100),
  secondary_keywords: z.array(z.string().max(100)).max(12),
  search_intent: z.enum(SEARCH_INTENTS),
  excerpt: z.string().min(1).max(500),
  content_markdown: z.string().min(1).max(100_000),
  meta_title: z.string().min(1).max(100),
  meta_description: z.string().min(1).max(300),
  canonical_url: z.string().nullable(),
  og_title: z.string().min(1).max(160),
  og_description: z.string().min(1).max(300),
  faq: z.array(faqSchema).max(10),
  internal_links: z.array(z.string()).max(20),
  image_prompt: z.string().max(2000),
  image_alt: z.string().max(300),
  cta_text: z.string().min(1).max(120),
  cta_url: z.string().min(1).max(300),
  source_items: z.array(sourceSchema).max(15),
});

export const getContentStudioDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getDashboard } = await import("./content-studio.server");
    return getDashboard(context.claims);
  });

export const generateContentDrafts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      count: z.number().int().min(1).max(2).default(2),
      topic: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { generateDrafts, readAdminEmail } = await import("./content-studio.server");
    return generateDrafts({
      count: data.count,
      topic: data.topic,
      actorEmail: readAdminEmail(context.claims),
      runType: "manual",
    });
  });

export const saveContentArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(articleInputSchema)
  .handler(async ({ data, context }) => {
    const { saveArticle } = await import("./content-studio.server");
    return saveArticle(data, context.claims);
  });

export const changeContentArticleStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(ARTICLE_STATUSES),
      scheduledAt: z.string().nullable().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { setArticleStatus } = await import("./content-studio.server");
    return setArticleStatus(data, context.claims);
  });

export const getPublishedArticles = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().int().min(1).max(250).default(100) }))
  .handler(async ({ data }) => {
    const { listPublicArticles } = await import("./content-studio.server");
    return listPublicArticles(data.limit);
  });

export const getPublishedArticle = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    const { getPublicArticle } = await import("./content-studio.server");
    return getPublicArticle(data.slug);
  });

export type { ContentArticle, ContentStudioDashboard } from "./content-studio.types";
