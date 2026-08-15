import type { Json } from "@/integrations/supabase/types";

export const ARTICLE_STATUSES = ["draft", "review", "scheduled", "published", "archived"] as const;
export const CONTENT_TYPES = [
  "educational",
  "product_tutorial",
  "case_study",
  "checklist",
] as const;
export const SEARCH_INTENTS = [
  "informational",
  "problem_solving",
  "commercial",
  "navigational",
] as const;

export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];
export type ContentType = (typeof CONTENT_TYPES)[number];
export type SearchIntent = (typeof SEARCH_INTENTS)[number];

export type FaqItem = {
  question: string;
  answer: string;
};

export type SourceItem = {
  title: string;
  url: string;
  note: string;
};

export type QualityCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type ContentArticle = {
  id: string;
  status: ArticleStatus;
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
  canonical_url: string | null;
  og_title: string;
  og_description: string;
  faq: FaqItem[];
  internal_links: string[];
  image_prompt: string;
  image_alt: string;
  cta_text: string;
  cta_url: string;
  source_items: SourceItem[];
  seo_score: number;
  quality_score: number;
  quality_checks: QualityCheck[];
  model: string | null;
  prompt_version: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  created_by_email: string;
  updated_by_email: string;
  created_at: string;
  updated_at: string;
};

export type ContentArticleInput = Pick<
  ContentArticle,
  | "id"
  | "title"
  | "slug"
  | "content_type"
  | "pillar"
  | "primary_keyword"
  | "secondary_keywords"
  | "search_intent"
  | "excerpt"
  | "content_markdown"
  | "meta_title"
  | "meta_description"
  | "canonical_url"
  | "og_title"
  | "og_description"
  | "faq"
  | "internal_links"
  | "image_prompt"
  | "image_alt"
  | "cta_text"
  | "cta_url"
  | "source_items"
>;

export type ContentStudioStats = {
  total: number;
  draft: number;
  review: number;
  scheduled: number;
  published: number;
  averageSeoScore: number;
};

export type GenerationRun = {
  id: string;
  run_type: string;
  status: string;
  article_count: number;
  model: string;
  requested_by_email: string;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export type ContentStudioDashboard = {
  adminEmail: string;
  articles: ContentArticle[];
  stats: ContentStudioStats;
  recentRuns: GenerationRun[];
  settings: {
    dailyDraftCount: number;
    defaultAuthor: string;
    model: string;
    promptVersion: string;
    automationReady: boolean;
  };
};

export function asStringArray(value: Json | string[] | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  const strings: string[] = [];
  for (const item of value) {
    if (typeof item === "string") strings.push(item);
  }
  return strings;
}

export function asFaqItems(value: Json | FaqItem[] | null | undefined): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const question = item.question;
    const answer = item.answer;
    return typeof question === "string" && typeof answer === "string" ? [{ question, answer }] : [];
  });
}

export function asSourceItems(value: Json | SourceItem[] | null | undefined): SourceItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const title = item.title;
    const url = item.url;
    const note = item.note;
    return typeof title === "string" && typeof url === "string" && typeof note === "string"
      ? [{ title, url, note }]
      : [];
  });
}

export function asQualityChecks(value: Json | QualityCheck[] | null | undefined): QualityCheck[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const id = item.id;
    const label = item.label;
    const passed = item.passed;
    const detail = item.detail;
    return typeof id === "string" &&
      typeof label === "string" &&
      typeof passed === "boolean" &&
      typeof detail === "string"
      ? [{ id, label, passed, detail }]
      : [];
  });
}
