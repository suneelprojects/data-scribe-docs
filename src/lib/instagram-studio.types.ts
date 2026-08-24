import type { Json } from "@/integrations/supabase/types";

export const INSTAGRAM_POST_STATUSES = [
  "draft",
  "review",
  "scheduled",
  "publishing",
  "published",
  "failed",
  "archived",
] as const;

export type InstagramPostStatus = (typeof INSTAGRAM_POST_STATUSES)[number];

export type InstagramQualityCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type InstagramPost = {
  id: string;
  media_type: "post";
  status: InstagramPostStatus;
  source_article_id: string | null;
  pillar: string;
  hook: string;
  caption: string;
  hashtags: string[];
  image_prompt: string;
  image_alt: string;
  image_path: string | null;
  image_url: string | null;
  quality_score: number;
  quality_checks: InstagramQualityCheck[];
  model: string | null;
  image_model: string | null;
  prompt_version: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  meta_creation_id: string | null;
  instagram_media_id: string | null;
  instagram_permalink: string | null;
  last_error: string | null;
  created_by_email: string;
  updated_by_email: string;
  created_at: string;
  updated_at: string;
};

export type InstagramPostInput = Pick<
  InstagramPost,
  "id" | "pillar" | "hook" | "caption" | "hashtags" | "image_prompt" | "image_alt"
>;

export type InstagramGenerationRun = {
  id: string;
  run_type: string;
  status: string;
  post_count: number;
  model: string;
  image_model: string;
  requested_by_email: string;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export type InstagramConnection = {
  configured: boolean;
  connected: boolean;
  username: string | null;
  userId: string | null;
  tokenExpiresAt: string | null;
  tokenDaysRemaining: number | null;
  lastVerifiedAt: string | null;
  lastError: string | null;
};

export type InstagramDashboard = {
  posts: InstagramPost[];
  recentRuns: InstagramGenerationRun[];
  stats: {
    total: number;
    needsReview: number;
    scheduled: number;
    published: number;
    failed: number;
    posts: number;
  };
  settings: {
    dailyDraftCount: number;
    defaultPublishTime: string;
    timezone: string;
    promptVersion: string;
    contentModel: string;
    imageModel: string;
    automationReady: boolean;
  };
  connection: InstagramConnection;
};

export function asInstagramQualityChecks(
  value: Json | InstagramQualityCheck[] | null | undefined,
): InstagramQualityCheck[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const { id, label, passed, detail } = item;
    return typeof id === "string" &&
      typeof label === "string" &&
      typeof passed === "boolean" &&
      typeof detail === "string"
      ? [{ id, label, passed, detail }]
      : [];
  });
}
