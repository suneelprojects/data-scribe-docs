import type { Database, Json } from "@/integrations/supabase/types";
import { readAdminEmail } from "./content-studio.server";
import {
  asInstagramQualityChecks,
  type InstagramDashboard,
  type InstagramPost,
  type InstagramPostInput,
  type InstagramPostStatus,
  type InstagramQualityCheck,
} from "./instagram-studio.types";

type PostRow = Database["public"]["Tables"]["instagram_posts"]["Row"];
type CredentialRow = Database["public"]["Tables"]["instagram_credentials"]["Row"];

const GRAPH_VERSION = process.env["INSTAGRAM_GRAPH_VERSION"]?.trim() || "v26.0";
const GRAPH_URL = `https://graph.instagram.com/${GRAPH_VERSION}`;
const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;
const CONTENT_MODEL = process.env["OPENAI_CONTENT_MODEL"]?.trim() || "gpt-5.6";
const IMAGE_MODEL = process.env["OPENAI_IMAGE_MODEL"]?.trim() || "gpt-image-2";
const PROMPT_VERSION = "instagram-v2-branded-mix";
const DAILY_EDUCATION_PROMPT_VERSION = "instagram-python-daily-v1";
const STORAGE_BUCKET = "instagram-media";
const PREVIEW_URL_TTL_SECONDS = 60 * 60;
const META_FETCH_URL_TTL_SECONDS = 60 * 60;
const DAILY_EDUCATION_PILLAR = "Daily Python Learning";

const DAILY_EDUCATION_TOPICS = [
  "Python foundations and mental models",
  "lists, tuples, sets and dictionaries",
  "functions, arguments and return values",
  "comprehensions and expressive Python",
  "exceptions, debugging and common mistakes",
  "iterators, generators and memory-aware patterns",
  "files, paths, JSON and CSV handling",
  "object-oriented Python in practical projects",
  "useful standard-library modules",
  "NumPy essentials for data work",
  "pandas tips for cleaner analysis",
  "visualization with Matplotlib and Seaborn",
  "testing, type hints and maintainable Python",
  "Python automation for repetitive work",
] as const;

const EAZYDATAFIX_FACTS = `
Verified EazyDataFix facts:
- EazyDataFix v1.0.0 is an MIT-licensed Python package for auditable data quality, cleaning, validation and EDA workflows.
- It accepts CSV, Excel, JSON, Parquet and pandas.DataFrame inputs.
- edf.run() composes profiling, quality assessment, controlled cleaning and deterministic EDA.
- edf.fix() supports dry-run previews, per-column cleaning rules, a proposed dataset and a structured change log.
- edf.prepare_with_report() supports controlled conversion, normalization and outlier actions with changes and warnings.
- edf.infer_schema() and edf.validate_contract() support reusable data contracts and validation rules.
- Never claim it executes faster than pandas. Discuss reduced repetitive coding, visible changes and reproducible workflows.
- Never invent users, customers, testimonials, benchmarks, percentages, time saved or performance results.
`;

type GeneratedInstagramPost = {
  pillar: string;
  hook: string;
  caption: string;
  hashtags: string[];
  image_prompt: string;
  image_alt: string;
  poster_title?: string;
  poster_subtitle?: string;
  poster_points?: Array<{ label: string; outcome: string }>;
};

type InstagramContentFormat =
  | "education"
  | "quick-tip"
  | "meme"
  | "quote"
  | "problem-story"
  | "community"
  | "product";

type InstagramContentPlan = {
  format: InstagramContentFormat;
  pillar: string;
  direction: string;
  captionGuide: string;
  usePublishedArticle: boolean;
  requireCta: boolean;
};

const CONTENT_ROTATION: Record<number, InstagramContentPlan> = {
  0: {
    format: "product",
    pillar: "EazyDataFix in practice",
    direction:
      "Show one practical EazyDataFix capability through a real data-workflow problem. Keep the promotion useful and restrained.",
    captionGuide: "Write 250-1,000 characters and finish with a soft CTA to eazydatafix.com.",
    usePublishedArticle: true,
    requireCta: true,
  },
  1: {
    format: "education",
    pillar: "Data clarity",
    direction:
      "Teach one accurate, broadly useful data-analysis or data-quality concept without turning the post into a product advertisement.",
    captionGuide:
      "Write 220-900 characters with one concrete example and one practical takeaway. Do not force a CTA or product mention.",
    usePublishedArticle: false,
    requireCta: false,
  },
  2: {
    format: "meme",
    pillar: "Analyst life meme",
    direction:
      "Create an original, good-natured and highly relatable data-analyst meme about messy data, spreadsheets, debugging or stakeholder requests. Never mock a protected group or a real person.",
    captionGuide:
      "Write 80-450 characters. Let the joke breathe, add one relatable observation and do not include a sales CTA.",
    usePublishedArticle: false,
    requireCta: false,
  },
  3: {
    format: "quick-tip",
    pillar: "Data quick tip",
    direction:
      "Give one immediately useful data-analysis, Python, pandas or data-quality tip that a learner can apply today.",
    captionGuide:
      "Write 160-700 characters with a clear action or mini checklist. Do not force a product mention or CTA.",
    usePublishedArticle: false,
    requireCta: false,
  },
  4: {
    format: "quote",
    pillar: "Data mindset",
    direction:
      "Write one original, memorable quote about data thinking, evidence, curiosity or clean analysis. Do not attribute it to another person.",
    captionGuide:
      "Write 80-500 characters with the original quote first and a brief reflection. No sales CTA.",
    usePublishedArticle: false,
    requireCta: false,
  },
  5: {
    format: "problem-story",
    pillar: "Data problem of the week",
    direction:
      "Tell a short, realistic data-work problem and reveal the lesson. Focus on the analyst's experience, not on selling software.",
    captionGuide:
      "Write 220-900 characters with a setup, consequence and practical lesson. Do not force a product CTA.",
    usePublishedArticle: false,
    requireCta: false,
  },
  6: {
    format: "community",
    pillar: "Data community",
    direction:
      "Start a thoughtful conversation or small data challenge for analysts and learners. Ask one genuine question without engagement bait.",
    captionGuide:
      "Write 100-550 characters and end with one specific discussion question. No sales CTA.",
    usePublishedArticle: false,
    requireCta: false,
  },
};

type OpenAITextPayload = {
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  usage?: { input_tokens?: number; output_tokens?: number };
  error?: { message?: string };
};

type OpenAIImagePayload = {
  data?: Array<{ b64_json?: string }>;
  error?: { message?: string };
};

type MetaErrorPayload = {
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
  };
};

const instagramPostSchema = {
  type: "object",
  additionalProperties: false,
  required: ["pillar", "hook", "caption", "hashtags", "image_prompt", "image_alt"],
  properties: {
    pillar: { type: "string" },
    hook: { type: "string" },
    caption: { type: "string" },
    hashtags: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: { type: "string" },
    },
    image_prompt: { type: "string" },
    image_alt: { type: "string" },
  },
} as const;

const educationalInstagramPostSchema = {
  ...instagramPostSchema,
  required: [...instagramPostSchema.required, "poster_title", "poster_subtitle", "poster_points"],
  properties: {
    ...instagramPostSchema.properties,
    poster_title: { type: "string" },
    poster_subtitle: { type: "string" },
    poster_points: {
      type: "array",
      minItems: 5,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "outcome"],
        properties: {
          label: { type: "string" },
          outcome: { type: "string" },
        },
      },
    },
  },
} as const;

function normalizePost(row: PostRow, imageUrl: string | null = row.image_url): InstagramPost {
  return {
    ...row,
    media_type: "post",
    image_url: imageUrl,
    status: row.status as InstagramPostStatus,
    hashtags: row.hashtags ?? [],
    quality_checks: asInstagramQualityChecks(row.quality_checks),
  };
}

function cleanHashtag(value: string) {
  return value
    .replace(/^#+/, "")
    .replace(/[^A-Za-z0-9_]/g, "")
    .slice(0, 50);
}

function normalizeHashtags(values: string[]) {
  return [...new Set(values.map(cleanHashtag).filter(Boolean))].slice(0, 12);
}

function evaluatePost(
  post: Pick<
    InstagramPost,
    "pillar" | "hook" | "caption" | "hashtags" | "image_prompt" | "image_alt"
  >,
) {
  const fullText = `${post.hook} ${post.caption}`;
  const plan = contentPlanForPillar(post.pillar);
  const shortForm = plan?.format === "meme" || plan?.format === "quote";
  const minimumCaptionLength = shortForm ? 80 : plan?.format === "community" ? 100 : 160;
  const unsupportedClaim =
    /\b(?:\d+(?:\.\d+)?\s*(?:x|times)\s+faster|saves?\s+\d+\s*(?:hours?|minutes?)|\d+%\s+(?:faster|better|less|more))\b/i.test(
      fullText,
    );
  const hashtags = normalizeHashtags(post.hashtags);
  const affirmativeImagePrompt = post.image_prompt.replace(
    /\b(?:do not|don't|without|avoid)\b[^.!?\n]*/gi,
    "",
  );
  const promptRequestsEmbeddedText =
    /\b(?:include|show|display|add|with)\s+(?:readable\s+)?(?:text|words?|letters?|logo|headline|caption|watermark)\b/i.test(
      affirmativeImagePrompt,
    );
  const rules: Array<[boolean, number, string, string, string]> = [
    [
      post.hook.trim().length >= 15 && post.hook.trim().length <= 140,
      15,
      "hook",
      "Hook is concise and clear",
      "Keep the hook between 15 and 140 characters",
    ],
    [
      post.caption.trim().length >= minimumCaptionLength && post.caption.trim().length <= 1800,
      20,
      "caption-length",
      "Caption length fits the content format",
      `Keep this ${plan?.format ?? "post"} caption between ${minimumCaptionLength} and 1,800 characters`,
    ],
    [
      hashtags.length >= 4 && hashtags.length <= 8,
      15,
      "hashtags",
      "Hashtag count is focused",
      "Use four to eight relevant hashtags",
    ],
    [
      !unsupportedClaim,
      20,
      "evidence",
      "No unsupported numerical claims",
      "Remove numerical performance or time-saving claims without evidence",
    ],
    [
      !plan?.requireCta || /eazydatafix\.com|link in (?:the )?bio/i.test(post.caption),
      10,
      "cta",
      plan?.requireCta ? "Product post includes a clear destination" : "No forced sales CTA",
      "Add eazydatafix.com or a link-in-bio CTA to this product-focused post",
    ],
    [
      post.image_alt.trim().length >= 20 && post.image_alt.trim().length <= 220,
      10,
      "image-alt",
      "Image alt text is descriptive",
      "Use descriptive image alt text between 20 and 220 characters",
    ],
    [
      post.image_prompt.trim().length >= 40 && !promptRequestsEmbeddedText,
      10,
      "image-safety",
      "Image prompt avoids embedded text and logos",
      "Describe a visual illustration without logos, screenshots or embedded words",
    ],
  ];
  const qualityScore = rules.reduce((score, [passed, weight]) => score + (passed ? weight : 0), 0);
  const qualityChecks: InstagramQualityCheck[] = rules.map(([passed, , id, label, failure]) => ({
    id,
    label,
    passed,
    detail: passed ? "Passed" : failure,
  }));
  return { qualityScore, qualityChecks, hashtags };
}

function extractOutputText(payload: OpenAITextPayload) {
  return (payload.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type === "output_text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

function istDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Minutes since midnight in Asia/Kolkata, independent of the host timezone. */
function istMinutesOfDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const [hour, minute] = parts.split(":").map(Number);
  return hour * 60 + minute;
}

export const INSTAGRAM_DAILY_SLOTS = [
  { key: "slot_0700", label: "07:00", minutes: 7 * 60 },
  { key: "slot_1230", label: "12:30", minutes: 12 * 60 + 30 },
  { key: "slot_1800", label: "18:00", minutes: 18 * 60 },
  { key: "slot_2300", label: "23:00", minutes: 23 * 60 },
] as const;

export type InstagramSlotKey = (typeof INSTAGRAM_DAILY_SLOTS)[number]["key"];

/**
 * Every slot whose IST time has already passed today, oldest first. Retries are
 * safe because each slot is deduplicated by the stable (run_type, run_date) key.
 */
function dueInstagramSlots(now = new Date()) {
  const minutes = istMinutesOfDay(now);
  return INSTAGRAM_DAILY_SLOTS.filter((slot) => minutes >= slot.minutes);
}

function slotIndex(key: string) {
  const index = INSTAGRAM_DAILY_SLOTS.findIndex((slot) => slot.key === key);
  return index < 0 ? 0 : index;
}

function dailyEducationTopic(date = istDate(), slot = 0) {
  const dayNumber = Math.floor(dateOnlyUtc(date) / 86_400_000);
  const cursor = dayNumber * INSTAGRAM_DAILY_SLOTS.length + slot;
  return DAILY_EDUCATION_TOPICS[cursor % DAILY_EDUCATION_TOPICS.length];
}

function dateOnlyUtc(value: string) {
  return Date.parse(`${value}T00:00:00.000Z`);
}

function istWeekdayIndex() {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  }).format(new Date());
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
}

function contentPlanForPillar(pillar: string) {
  const normalized = pillar.trim().toLowerCase();
  return Object.values(CONTENT_ROTATION).find((plan) => plan.pillar.toLowerCase() === normalized);
}

function selectContentPlan(topic?: string): InstagramContentPlan {
  const direction = topic?.trim();
  if (!direction) return CONTENT_ROTATION[istWeekdayIndex()] ?? CONTENT_ROTATION[1];

  const lower = direction.toLowerCase();
  const day = /\bmeme\b/.test(lower)
    ? 2
    : /\bquote\b|mindset/.test(lower)
      ? 4
      : /\btip\b|checklist|how[- ]to/.test(lower)
        ? 3
        : /\bquestion\b|challenge|community/.test(lower)
          ? 6
          : /eazydatafix|product|feature|tutorial/.test(lower)
            ? 0
            : /story|mistake|problem/.test(lower)
              ? 5
              : 1;
  const base = CONTENT_ROTATION[day];
  return {
    ...base,
    direction: `Follow this admin direction: ${direction}\n\n${base.direction}`,
    usePublishedArticle: false,
  };
}

function dailyEducationPlan(date = istDate(), slot = 0): InstagramContentPlan {
  return {
    format: "education",
    pillar: DAILY_EDUCATION_PILLAR,
    direction: `Teach one genuinely useful lesson from ${dailyEducationTopic(date, slot)}. It must help Python learners or working developers immediately. Rotate tutorials, tips, tricks, comparisons, common mistakes, mini mental models and ecosystem maps. Prefer one focused idea over a broad generic list.`,
    captionGuide:
      "Write 300-1,100 characters. Explain the concept simply, include one accurate practical example or short code snippet in the caption, add one takeaway, and never add a sales pitch.",
    usePublishedArticle: false,
    requireCta: false,
  };
}

async function instagramAudit(
  postId: string | null,
  action: string,
  actorEmail: string,
  details: Json = {},
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("instagram_audit_log").insert({
    post_id: postId,
    action,
    actor_email: actorEmail,
    details,
  });
  if (error) console.error("[instagram-studio] audit insert failed", error);
}

async function callOpenAIForPost(options: {
  topic?: string;
  dailyEducation?: boolean;
  contentPlan: InstagramContentPlan;
  sourceArticle?: {
    title: string;
    excerpt: string;
    content_markdown: string;
    primary_keyword: string;
  } | null;
  recentPosts: Array<{ hook: string; pillar: string }>;
}) {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured in Lovable Cloud.");
  const recent = options.recentPosts.map((post) => `- ${post.hook} | ${post.pillar}`).join("\n");
  const source = options.sourceArticle
    ? `Use this verified EazyDataFix article as the primary source:\nTitle: ${options.sourceArticle.title}\nKeyword: ${options.sourceArticle.primary_keyword}\nExcerpt: ${options.sourceArticle.excerpt}\nArticle body:\n${options.sourceArticle.content_markdown.slice(0, 7000)}`
    : "No product article is required for this post. Use accurate, broadly accepted Python and data-analysis knowledge and avoid unsupported claims.";
  const educationalPosterDirection = options.dailyEducation
    ? `
- This is the daily Python learning series, not a promotional post.
- Make the lesson complete enough to be saved and revisited.
- Return poster_title with 3-7 words and poster_subtitle with 4-10 words.
- Return 5-7 poster_points. Each label must be 2-24 characters; each outcome must be 2-48 characters.
- The points must form a clean concept map, comparison, sequence or cheat sheet similar to a premium educational infographic.
- Keep every poster point factually accurate, visually scannable and understandable without reading the caption.
- Avoid fragile version-specific claims unless the version is explicitly stated.
- Do not copy wording, layout labels or branding from another creator's post.`
    : "";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CONTENT_MODEL,
      store: false,
      max_output_tokens: 2500,
      instructions: `You are the social content editor for EazyDataFix. Build a trustworthy, useful and human Instagram presence for data analysts and Python learners. The feed must not feel like a continuous advertisement. Return only the requested structured output. ${EAZYDATAFIX_FACTS}`,
      input: `${options.topic?.trim() ? `Admin direction: ${options.topic.trim()}\n` : ""}${source}

Create one single-image Instagram post.
- Assigned format: ${options.contentPlan.format}
- Required content pillar (return this exact value): ${options.contentPlan.pillar}
- Editorial direction: ${options.contentPlan.direction}
- Caption guidance: ${options.contentPlan.captionGuide}
- Write a scroll-stopping but honest hook between 35 and 90 characters so it also works as the poster headline.
- Keep the caption natural, useful and easy to scan with short paragraphs.
- Use four to eight focused hashtags. Return them without the # character.
- Do not use fabricated numbers, testimonials, performance claims or engagement bait.
- Mention EazyDataFix only when the assigned format is product or when it is genuinely necessary to answer the admin direction.
- ${options.contentPlan.requireCta ? "Include one soft CTA to eazydatafix.com or the link in bio." : "Do not add eazydatafix.com, link-in-bio language or a sales CTA."}
- Do not repeat the same idea as these recent posts:\n${recent || "- No previous Instagram posts."}
- The image prompt must describe the visual concept and artwork for a branded 4:5 EazyDataFix poster. Use deep navy, cyan, cobalt, white and restrained green accents. Match the assigned format: educational diagram for education/tips, witty conceptual scene for a meme, calm symbolic visual for a quote, narrative visual for a problem story, or a polished product concept for product content.
- Keep the lower section visually calm and low-detail for the headline. The image-generation step supplies the exact visible brand, category, headline and footer separately.
- Do not request any additional readable words, logos, watermarks, UI screenshots or code text inside the artwork.
- Image alt text must objectively describe the intended visual.
${educationalPosterDirection}
`,
      text: {
        format: {
          type: "json_schema",
          name: options.dailyEducation
            ? "eazydatafix_daily_python_post"
            : "eazydatafix_instagram_post",
          strict: true,
          schema: options.dailyEducation ? educationalInstagramPostSchema : instagramPostSchema,
        },
      },
    }),
  });
  const payload = (await response.json()) as OpenAITextPayload;
  if (!response.ok) {
    throw new Error(
      payload.error?.message || `Instagram copy generation failed with status ${response.status}.`,
    );
  }
  const text = extractOutputText(payload);
  if (!text) throw new Error("OpenAI returned no Instagram copy.");
  return {
    post: JSON.parse(text) as GeneratedInstagramPost,
    inputTokens: payload.usage?.input_tokens ?? null,
    outputTokens: payload.usage?.output_tokens ?? null,
  };
}

async function generateImage(
  prompt: string,
  poster: {
    hook: string;
    pillar: string;
    format: InstagramContentFormat;
    educationalLayout?: {
      title: string;
      subtitle: string;
      points: Array<{ label: string; outcome: string }>;
    };
  },
) {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured in Lovable Cloud.");
  const educationalLayout = poster.educationalLayout;
  const exactVisibleText = educationalLayout
    ? `
REFERENCE-INSPIRED EDUCATIONAL LAYOUT:
- Use an original, premium concept-map or cheat-sheet composition: a central Python/code hub connected to 5-7 color-coded learning rows.
- Use a clean warm-white or very pale blue canvas, dark navy typography, cobalt connector lines and restrained cyan, green, amber and violet accents.
- Make the title and subtitle dominant, then arrange every learning row with generous spacing and strong left-to-right reading order.
- Do not imitate another creator's branding, portrait, watermark, engagement controls or exact composition.
- Use simple original geometric/code symbols rather than third-party product logos.

USE ONLY THESE EXACT VISIBLE TEXT STRINGS:
- Brand: "EazyDataFix"
- Title: "${educationalLayout.title}"
- Subtitle: "${educationalLayout.subtitle}"
${educationalLayout.points
  .map((point, index) => `- Row ${index + 1}: "${point.label}" → "${point.outcome}"`)
  .join("\n")}
- Footer: "eazydatafix.com"

Spell every visible word exactly. Do not invent or add any other words, numbers, logos, watermarks, UI screenshots or code text.`
    : `
USE ONLY THESE EXACT VISIBLE TEXT STRINGS:
- Brand: "EazyDataFix"
- Category: "${poster.pillar}"
- Main headline: "${poster.hook}"
- Footer: "eazydatafix.com"

Spell every visible word exactly. Keep the headline large and readable. Do not invent or add any other words, numbers, logos, watermarks, UI screenshots or code text.`;
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt: `${prompt}

Create a complete premium vertical 4:5 EazyDataFix social poster for the ${poster.format.replace(/-/g, " ")} format.

CONSISTENT BRAND SYSTEM:
- Use the educational light concept-map layout when educational rows are supplied; otherwise use a deep midnight navy background with cyan, cobalt, white and restrained green accents.
- Small clean EazyDataFix brand area at the top-left.
- Visual storytelling occupies the upper and middle area.
- Modern editorial typography, strong hierarchy, generous spacing and safe margins.
- Premium educational design, not a generic corporate advertisement.
${exactVisibleText}`,
      n: 1,
      size: IMAGE_MODEL === "gpt-image-2" ? "1024x1280" : "1024x1536",
      quality: "medium",
      output_format: "jpeg",
      output_compression: 88,
      background: "opaque",
    }),
  });
  const payload = (await response.json()) as OpenAIImagePayload;
  if (!response.ok) {
    throw new Error(
      payload.error?.message || `Instagram image generation failed with status ${response.status}.`,
    );
  }
  const base64 = payload.data?.[0]?.b64_json;
  if (!base64) throw new Error("OpenAI returned no Instagram image.");
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

async function uploadPostImage(postId: string, imageBytes: Uint8Array) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const date = new Date();
  const path = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${postId}.jpg`;
  const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).upload(path, imageBytes, {
    contentType: "image/jpeg",
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw new Error(`Unable to store the Instagram image: ${error.message}`);
  return { path };
}

async function createSignedImageUrl(path: string, expiresIn = PREVIEW_URL_TTL_SECONDS) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Unable to create a temporary Instagram image URL.");
  }
  return data.signedUrl;
}

async function normalizePostsWithSignedImages(rows: PostRow[]) {
  const imagePaths = [...new Set(rows.flatMap((row) => (row.image_path ? [row.image_path] : [])))];
  if (imagePaths.length === 0) return rows.map((row) => normalizePost(row));
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const images = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUrls(imagePaths, PREVIEW_URL_TTL_SECONDS);
  if (images.error) throw new Error(images.error.message || "Unable to create Instagram preview URLs.");
  const signedImages = new Map(
    (images.data ?? []).flatMap((item) =>
      item.path && item.signedUrl ? [[item.path, item.signedUrl] as const] : [],
    ),
  );
  return rows.map((row) =>
    normalizePost(row, row.image_path ? (signedImages.get(row.image_path) ?? null) : row.image_url),
  );
}

async function metaRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as T & MetaErrorPayload;
  if (!response.ok || payload.error) {
    const meta = payload.error;
    const code = meta?.code
      ? ` (${meta.code}${meta.error_subcode ? `/${meta.error_subcode}` : ""})`
      : "";
    throw new Error(
      `${meta?.message || `Meta API request failed with status ${response.status}`}${code}`,
    );
  }
  return payload;
}

async function getMetaProfile(accessToken: string) {
  const url = new URL(`${GRAPH_URL}/me`);
  url.searchParams.set("fields", "user_id,username");
  url.searchParams.set("access_token", accessToken);
  const payload = await metaRequest<{ user_id?: string; id?: string; username?: string }>(
    url.toString(),
  );
  const userId = payload.user_id ?? payload.id;
  if (!userId || !payload.username)
    throw new Error("Meta did not return the Instagram account ID.");
  return { userId, username: payload.username };
}

async function debugToken(accessToken: string) {
  const appId = process.env["INSTAGRAM_APP_ID"]?.trim();
  const appSecret = process.env["INSTAGRAM_APP_SECRET"]?.trim();
  if (!appId || !appSecret) return { expiresAt: null as string | null, valid: true };
  try {
    const url = new URL(`${FACEBOOK_GRAPH_URL}/debug_token`);
    url.searchParams.set("input_token", accessToken);
    url.searchParams.set("access_token", `${appId}|${appSecret}`);
    const payload = await metaRequest<{ data?: { is_valid?: boolean; expires_at?: number } }>(
      url.toString(),
    );
    return {
      valid: payload.data?.is_valid !== false,
      expiresAt: payload.data?.expires_at
        ? new Date(payload.data.expires_at * 1000).toISOString()
        : null,
    };
  } catch {
    // Profile verification remains authoritative for Instagram Login tokens if the
    // generic token debugger does not expose their metadata.
    return { expiresAt: null as string | null, valid: true };
  }
}

async function getCredential(options: { verify?: boolean } = {}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: stored, error } = await supabaseAdmin
    .from("instagram_credentials")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const environmentToken = process.env["INSTAGRAM_ACCESS_TOKEN"]?.trim();
  let accessToken = stored?.access_token || environmentToken;
  if (!accessToken) throw new Error("INSTAGRAM_ACCESS_TOKEN is not configured in Lovable Cloud.");

  if (!stored || options.verify || !stored.instagram_user_id || !stored.instagram_username) {
    let profile: Awaited<ReturnType<typeof getMetaProfile>>;
    try {
      profile = await getMetaProfile(accessToken);
    } catch (storedTokenError) {
      if (!environmentToken || environmentToken === accessToken) throw storedTokenError;
      // Allows a manually rotated Lovable secret to recover an expired database token.
      accessToken = environmentToken;
      profile = await getMetaProfile(accessToken);
    }
    const tokenInfo = await debugToken(accessToken);
    if (!tokenInfo.valid) throw new Error("The Instagram access token is no longer valid.");
    const now = new Date().toISOString();
    const { data: saved, error: saveError } = await supabaseAdmin
      .from("instagram_credentials")
      .upsert({
        id: 1,
        access_token: accessToken,
        instagram_user_id: profile.userId,
        instagram_username: profile.username,
        token_expires_at:
          tokenInfo.expiresAt ??
          (accessToken === stored?.access_token ? (stored?.token_expires_at ?? null) : null),
        last_verified_at: now,
      })
      .select("*")
      .single();
    if (saveError || !saved)
      throw new Error(saveError?.message || "Instagram credentials could not be saved.");
    return saved;
  }
  return stored;
}

async function refreshCredentialIfNeeded() {
  const credential = await getCredential();
  const createdAt = new Date(credential.created_at).getTime();
  const expiresAt = credential.token_expires_at
    ? new Date(credential.token_expires_at).getTime()
    : null;
  const lastRefresh = credential.last_refreshed_at
    ? new Date(credential.last_refreshed_at).getTime()
    : null;
  const olderThanOneDay = Date.now() - createdAt > 86_400_000;
  const expiresWithinTwentyDays = expiresAt !== null && expiresAt - Date.now() < 20 * 86_400_000;
  const metadataMissingAndDue =
    expiresAt === null && (lastRefresh === null || Date.now() - lastRefresh > 30 * 86_400_000);
  if (!olderThanOneDay || (!expiresWithinTwentyDays && !metadataMissingAndDue)) return credential;

  const url = new URL("https://graph.instagram.com/refresh_access_token");
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", credential.access_token);
  const payload = await metaRequest<{
    access_token?: string;
    token_type?: string;
    expires_in?: number;
  }>(url.toString());
  if (!payload.access_token) throw new Error("Meta did not return a refreshed access token.");
  const now = new Date().toISOString();
  const tokenExpiresAt = payload.expires_in
    ? new Date(Date.now() + payload.expires_in * 1000).toISOString()
    : credential.token_expires_at;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("instagram_credentials")
    .update({
      access_token: payload.access_token,
      token_expires_at: tokenExpiresAt,
      last_refreshed_at: now,
      last_verified_at: now,
    })
    .eq("id", 1)
    .select("*")
    .single();
  if (error || !data)
    throw new Error(error?.message || "The refreshed Instagram token could not be stored.");
  return data;
}

export async function generateInstagramDraft(options: {
  topic?: string;
  actorEmail: string;
  runType: "manual" | "daily" | "education_daily" | InstagramSlotKey;
  /** Publish to Instagram immediately after generation instead of waiting for review. */
  autoPublish?: boolean;
  runDate?: string;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const slot = options.runType.startsWith("slot_") ? slotIndex(options.runType) : 0;
  const dailyEducation =
    options.runType === "education_daily" || options.runType.startsWith("slot_");
  const runDate = options.runType === "manual" ? null : (options.runDate ?? istDate());
  const promptVersion = dailyEducation ? DAILY_EDUCATION_PROMPT_VERSION : PROMPT_VERSION;
  let run: { id: string } | null = null;
  if (runDate) {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("instagram_generation_runs")
      .select("id, status, post_count, post_ids")
      .eq("run_type", options.runType)
      .eq("run_date", runDate)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (existing?.status === "completed") {
      let published = false;
      let publishError: string | null = null;
      if (options.autoPublish) {
        // A retry must never create a second post; only finish an unpublished one.
        const result = await ensureSlotPostsPublished(existing.post_ids, options.actorEmail);
        published = result.published > 0;
        publishError = result.error;
      }
      return {
        skipped: true,
        created: existing.post_count,
        postIds: existing.post_ids,
        published,
        publishError,
      };
    }
    if (existing) {
      const { data: restarted, error: restartError } = await supabaseAdmin
        .from("instagram_generation_runs")
        .update({
          status: "running",
          post_count: 0,
          post_ids: [],
          model: CONTENT_MODEL,
          image_model: IMAGE_MODEL,
          prompt_version: promptVersion,
          requested_by_email: options.actorEmail,
          error_message: null,
          input_tokens: null,
          output_tokens: null,
          completed_at: null,
        })
        .eq("id", existing.id)
        .select("id")
        .single();
      if (restartError || !restarted) {
        throw new Error(restartError?.message || "Unable to restart Instagram generation.");
      }
      run = restarted;
    }
  }

  if (!run) {
    const { data: insertedRun, error: runError } = await supabaseAdmin
      .from("instagram_generation_runs")
      .insert({
        run_type: options.runType,
        run_date: runDate,
        model: CONTENT_MODEL,
        image_model: IMAGE_MODEL,
        prompt_version: promptVersion,
        requested_by_email: options.actorEmail,
      })
      .select("id")
      .single();
    if (runError || !insertedRun) {
      throw new Error(runError?.message || "Unable to start Instagram generation.");
    }
    run = insertedRun;
  }

  let postId: string | null = null;
  try {
    const contentPlan = dailyEducation
      ? dailyEducationPlan(runDate ?? undefined, slot)
      : selectContentPlan(options.topic);
    const [recentResult, usedSourcesResult] = await Promise.all([
      supabaseAdmin
        .from("instagram_posts")
        .select("hook, pillar")
        .neq("status", "archived")
        .order("created_at", { ascending: false })
        .limit(30),
      supabaseAdmin
        .from("instagram_posts")
        .select("source_article_id")
        .not("source_article_id", "is", null),
    ]);
    if (recentResult.error) throw new Error(recentResult.error.message);
    if (usedSourcesResult.error) throw new Error(usedSourcesResult.error.message);
    const usedIds = (usedSourcesResult.data ?? [])
      .map((row) => row.source_article_id)
      .filter((id): id is string => Boolean(id));
    let sourceArticle = null;
    if (contentPlan.usePublishedArticle) {
      let query = supabaseAdmin
        .from("content_articles")
        .select("id, title, excerpt, content_markdown, primary_keyword")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1);
      if (usedIds.length > 0) query = query.not("id", "in", `(${usedIds.join(",")})`);
      const { data, error: sourceError } = await query.maybeSingle();
      if (sourceError) throw new Error(sourceError.message);
      sourceArticle = data;
    }
    const generated = await callOpenAIForPost({
      topic: options.topic,
      dailyEducation,
      contentPlan,
      sourceArticle,
      recentPosts: recentResult.data ?? [],
    });
    const generatedPost = { ...generated.post, pillar: contentPlan.pillar };
    const evaluated = evaluatePost(generatedPost as InstagramPost);
    if (dailyEducation && evaluated.qualityScore < 80) {
      throw new Error("Daily education post did not meet the draft quality gate.");
    }
    const posterPoints = (generatedPost.poster_points ?? []).slice(0, 7).map((point) => ({
      label: point.label
        .replace(/["\n\r]/g, "")
        .trim()
        .slice(0, 24),
      outcome: point.outcome
        .replace(/["\n\r]/g, "")
        .trim()
        .slice(0, 48),
    }));
    const posterTitle = generatedPost.poster_title
      ?.replace(/["\n\r]/g, "")
      .trim()
      .slice(0, 60);
    const posterSubtitle = generatedPost.poster_subtitle
      ?.replace(/["\n\r]/g, "")
      .trim()
      .slice(0, 90);
    if (dailyEducation && (!posterTitle || !posterSubtitle || posterPoints.length < 5)) {
      throw new Error("Daily education poster did not contain enough scannable learning points.");
    }
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("instagram_posts")
      .insert({
        source_article_id: sourceArticle?.id ?? null,
        media_type: "post",
        status: "draft",
        pillar: contentPlan.pillar,
        hook: generatedPost.hook.trim(),
        caption: generatedPost.caption.trim(),
        hashtags: evaluated.hashtags,
        image_prompt: generatedPost.image_prompt.trim(),
        image_alt: generatedPost.image_alt.trim(),
        quality_score: evaluated.qualityScore,
        quality_checks: evaluated.qualityChecks as unknown as Json,
        model: CONTENT_MODEL,
        image_model: IMAGE_MODEL,
        prompt_version: promptVersion,
        created_by_email: options.actorEmail,
        updated_by_email: options.actorEmail,
      })
      .select("*")
      .single();
    if (insertError || !inserted)
      throw new Error(insertError?.message || "Instagram draft could not be saved.");
    postId = inserted.id;

    const imageBytes = await generateImage(generatedPost.image_prompt, {
      hook: generatedPost.hook,
      pillar: contentPlan.pillar,
      format: contentPlan.format,
      educationalLayout:
        dailyEducation && posterTitle && posterSubtitle
          ? { title: posterTitle, subtitle: posterSubtitle, points: posterPoints }
          : undefined,
    });
    const image = await uploadPostImage(postId, imageBytes);
    const { data: completedPost, error: updateError } = await supabaseAdmin
      .from("instagram_posts")
      .update({
        image_path: image.path,
        image_url: null,
        // Slot posts are auto-approved and published immediately; manual drafts wait for an editor.
        status: options.autoPublish ? "review" : "draft",
        scheduled_at: null,
        last_error: null,
      })
      .eq("id", postId)
      .select("*")
      .single();
    if (updateError || !completedPost)
      throw new Error(updateError?.message || "Instagram image could not be attached.");

    await supabaseAdmin
      .from("instagram_generation_runs")
      .update({
        status: "completed",
        post_count: 1,
        post_ids: [postId],
        input_tokens: generated.inputTokens,
        output_tokens: generated.outputTokens,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
    await instagramAudit(postId, "generated", options.actorEmail, {
      run_id: run.id,
      run_type: options.runType,
      auto_publish: Boolean(options.autoPublish),
    });

    let published = false;
    let publishError: string | null = null;
    if (options.autoPublish) {
      try {
        await publishInstagramPostById(postId, options.actorEmail);
        published = true;
      } catch (error) {
        publishError = error instanceof Error ? error.message : "Instagram publishing failed";
      }
    }

    const previewUrl = await createSignedImageUrl(image.path);
    return {
      skipped: false,
      created: 1,
      postIds: [postId],
      published,
      publishError,
      post: normalizePost(completedPost, previewUrl),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Instagram generation error";
    await supabaseAdmin
      .from("instagram_generation_runs")
      .update({ status: "failed", error_message: message, completed_at: new Date().toISOString() })
      .eq("id", run.id);
    if (postId) {
      await supabaseAdmin
        .from("instagram_posts")
        .update({ status: "failed", last_error: message, updated_by_email: options.actorEmail })
        .eq("id", postId);
    }
    throw error;
  }
}

function credentialSummary(credential: CredentialRow | null, lastError: string | null = null) {
  const expires = credential?.token_expires_at ?? null;
  const remaining = expires
    ? Math.max(0, Math.ceil((new Date(expires).getTime() - Date.now()) / 86_400_000))
    : null;
  return {
    configured: Boolean(
      (credential?.access_token || process.env["INSTAGRAM_ACCESS_TOKEN"]) &&
      process.env["INSTAGRAM_APP_ID"] &&
      process.env["INSTAGRAM_APP_SECRET"],
    ),
    connected: Boolean(credential?.instagram_user_id && credential.instagram_username),
    username: credential?.instagram_username ?? null,
    userId: credential?.instagram_user_id ?? null,
    tokenExpiresAt: expires,
    tokenDaysRemaining: remaining,
    lastVerifiedAt: credential?.last_verified_at ?? null,
    lastError,
  };
}

export async function getInstagramDashboard(claims: unknown): Promise<InstagramDashboard> {
  readAdminEmail(claims);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [postsResult, runsResult, settingsResult, credentialResult] = await Promise.all([
    supabaseAdmin
      .from("instagram_posts")
      .select("*")
      .eq("media_type", "post")
      .order("updated_at", { ascending: false })
      .limit(200),
    supabaseAdmin
      .from("instagram_generation_runs")
      .select(
        "id, run_type, status, post_count, model, image_model, requested_by_email, error_message, created_at, completed_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabaseAdmin.from("instagram_studio_settings").select("*").eq("id", 1).maybeSingle(),
    supabaseAdmin.from("instagram_credentials").select("*").eq("id", 1).maybeSingle(),
  ]);
  if (postsResult.error) throw new Error(postsResult.error.message);
  if (runsResult.error) throw new Error(runsResult.error.message);
  if (settingsResult.error) throw new Error(settingsResult.error.message);
  if (credentialResult.error) throw new Error(credentialResult.error.message);
  const posts = await normalizePostsWithSignedImages(postsResult.data ?? []);
  return {
    posts,
    recentRuns: runsResult.data ?? [],
    stats: {
      total: posts.length,
      needsReview: posts.filter((post) => post.status === "draft" || post.status === "review")
        .length,
      scheduled: posts.filter((post) => post.status === "scheduled").length,
      published: posts.filter((post) => post.status === "published").length,
      failed: posts.filter((post) => post.status === "failed").length,
      posts: posts.filter((post) => post.media_type === "post").length,
    },
    settings: {
      dailyDraftCount: settingsResult.data?.daily_draft_count ?? 1,
      defaultPublishTime: settingsResult.data?.default_publish_time ?? "10:00:00",
      timezone: settingsResult.data?.timezone ?? "Asia/Kolkata",
      promptVersion: settingsResult.data?.prompt_version ?? PROMPT_VERSION,
      contentModel: CONTENT_MODEL,
      imageModel: IMAGE_MODEL,
      automationReady: Boolean(
        process.env["OPENAI_API_KEY"] &&
        process.env["CONTENT_CRON_SECRET"] &&
        (credentialResult.data?.access_token || process.env["INSTAGRAM_ACCESS_TOKEN"]),
      ),
    },
    connection: credentialSummary(credentialResult.data),
  };
}

export async function verifyInstagramConnection(claims: unknown) {
  const actorEmail = readAdminEmail(claims);
  try {
    const credential = await getCredential({ verify: true });
    await instagramAudit(null, "connection_verified", actorEmail, {
      username: credential.instagram_username,
      user_id: credential.instagram_user_id,
    });
    return credentialSummary(credential);
  } catch (error) {
    return credentialSummary(
      null,
      error instanceof Error ? error.message : "Instagram verification failed",
    );
  }
}

export async function saveInstagramPost(input: InstagramPostInput, claims: unknown) {
  const actorEmail = readAdminEmail(claims);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: current, error: currentError } = await supabaseAdmin
    .from("instagram_posts")
    .select("status")
    .eq("id", input.id)
    .single();
  if (currentError || !current)
    throw new Error(currentError?.message || "Instagram post not found.");
  if (["publishing", "published", "archived"].includes(current.status)) {
    throw new Error("This Instagram post is locked and cannot be edited.");
  }
  const evaluated = evaluatePost(input as InstagramPost);
  const { data, error } = await supabaseAdmin
    .from("instagram_posts")
    .update({
      pillar: input.pillar.trim(),
      hook: input.hook.trim(),
      caption: input.caption.trim(),
      hashtags: evaluated.hashtags,
      image_prompt: input.image_prompt.trim(),
      image_alt: input.image_alt.trim(),
      quality_score: evaluated.qualityScore,
      quality_checks: evaluated.qualityChecks as unknown as Json,
      status: "draft",
      scheduled_at: null,
      meta_creation_id: null,
      last_error: null,
      updated_by_email: actorEmail,
    })
    .eq("id", input.id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Instagram post could not be saved.");
  await instagramAudit(input.id, "updated", actorEmail, { quality_score: evaluated.qualityScore });
  return normalizePost(data);
}

export async function regenerateInstagramImage(postId: string, claims: unknown) {
  const actorEmail = readAdminEmail(claims);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: post, error } = await supabaseAdmin
    .from("instagram_posts")
    .select("*")
    .eq("id", postId)
    .single();
  if (error || !post) throw new Error(error?.message || "Instagram post not found.");
  if (["publishing", "published", "archived"].includes(post.status)) {
    throw new Error("This post cannot receive a new image in its current status.");
  }
  const imageBytes = await generateImage(post.image_prompt, {
    hook: post.hook,
    pillar: post.pillar,
    format: contentPlanForPillar(post.pillar)?.format ?? "education",
  });
  const image = await uploadPostImage(postId, imageBytes);
  const { data, error: updateError } = await supabaseAdmin
    .from("instagram_posts")
    .update({
      image_path: image.path,
      image_url: null,
      status: "draft",
      last_error: null,
      updated_by_email: actorEmail,
    })
    .eq("id", postId)
    .select("*")
    .single();
  if (updateError || !data)
    throw new Error(updateError?.message || "The new image could not be saved.");
  await instagramAudit(postId, "image_regenerated", actorEmail);
  const previewUrl = await createSignedImageUrl(image.path);
  return normalizePost(data, previewUrl);
}

export async function setInstagramPostStatus(
  input: { id: string; status: InstagramPostStatus; scheduledAt?: string | null },
  claims: unknown,
) {
  const actorEmail = readAdminEmail(claims);
  if (!["draft", "review", "scheduled", "archived"].includes(input.status)) {
    throw new Error("Use the publishing action to publish an Instagram post.");
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: current, error } = await supabaseAdmin
    .from("instagram_posts")
    .select("*")
    .eq("id", input.id)
    .single();
  if (error || !current) throw new Error(error?.message || "Instagram post not found.");
  if ((input.status === "review" || input.status === "scheduled") && current.quality_score < 80) {
    throw new Error("Quality score must be at least 80 before approval.");
  }
  if (
    (input.status === "review" || input.status === "scheduled") &&
    !current.image_path &&
    !current.image_url
  ) {
    throw new Error("Generate an image before approving this post.");
  }
  let scheduledAt: string | null = null;
  if (input.status === "scheduled") {
    if (current.status !== "review" && current.status !== "scheduled") {
      throw new Error("Move the post to review before scheduling it.");
    }
    if (!input.scheduledAt) throw new Error("Choose an Instagram publication time.");
    const scheduled = new Date(input.scheduledAt);
    if (!Number.isFinite(scheduled.getTime()) || scheduled.getTime() <= Date.now()) {
      throw new Error("Scheduled publication time must be in the future.");
    }
    scheduledAt = scheduled.toISOString();
  }
  const { data, error: updateError } = await supabaseAdmin
    .from("instagram_posts")
    .update({
      status: input.status,
      scheduled_at: scheduledAt,
      last_error: null,
      updated_by_email: actorEmail,
    })
    .eq("id", input.id)
    .select("*")
    .single();
  if (updateError || !data)
    throw new Error(updateError?.message || "Instagram status could not be changed.");
  await instagramAudit(input.id, input.status, actorEmail, { scheduled_at: scheduledAt });
  return normalizePost(data);
}

function publishCaption(post: PostRow) {
  const tags = normalizeHashtags(post.hashtags)
    .map((tag) => `#${tag}`)
    .join(" ");
  const suffix = tags ? `\n\n${tags}` : "";
  const body = `${post.hook.trim()}\n\n${post.caption.trim()}`.slice(0, 2200 - suffix.length);
  return `${body}${suffix}`;
}

async function waitForContainer(containerId: string, accessToken: string) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const url = new URL(`${GRAPH_URL}/${containerId}`);
    url.searchParams.set("fields", "status_code,status");
    url.searchParams.set("access_token", accessToken);
    const payload = await metaRequest<{ status_code?: string; status?: string }>(url.toString());
    if (!payload.status_code || payload.status_code === "FINISHED") return;
    if (payload.status_code === "ERROR" || payload.status_code === "EXPIRED") {
      throw new Error(
        payload.status || `Instagram media container ${payload.status_code.toLowerCase()}.`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error("Instagram is still processing the image. Try publishing again shortly.");
}

export async function publishInstagramPostById(postId: string, actorEmail: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: current, error } = await supabaseAdmin
    .from("instagram_posts")
    .select("*")
    .eq("id", postId)
    .single();
  if (error || !current) throw new Error(error?.message || "Instagram post not found.");
  if (current.status === "published") return normalizePost(current);
  if (!["draft", "review", "scheduled", "failed"].includes(current.status)) {
    throw new Error("This Instagram post cannot be published in its current status.");
  }
  if (current.quality_score < 80)
    throw new Error("Quality score must be at least 80 before publishing.");
  if (!current.image_path && !current.image_url) {
    throw new Error("The Instagram post has no stored image.");
  }

  await supabaseAdmin
    .from("instagram_posts")
    .update({ status: "publishing", last_error: null, updated_by_email: actorEmail })
    .eq("id", postId);

  try {
    const credential = await refreshCredentialIfNeeded();
    if (!credential.instagram_user_id) throw new Error("Instagram account ID is unavailable.");
    let creationId = current.meta_creation_id;
    if (!creationId) {
      const body = new URLSearchParams({
        caption: publishCaption(current),
        access_token: credential.access_token,
      });
      const imageUrl = current.image_path
        ? await createSignedImageUrl(current.image_path, META_FETCH_URL_TTL_SECONDS)
        : current.image_url;
      if (!imageUrl) throw new Error("The Instagram image URL could not be prepared.");
      body.set("image_url", imageUrl);
      const created = await metaRequest<{ id?: string }>(
        `${GRAPH_URL}/${credential.instagram_user_id}/media`,
        { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body },
      );
      if (!created.id) throw new Error("Meta did not return a media container ID.");
      creationId = created.id;
      await supabaseAdmin
        .from("instagram_posts")
        .update({ meta_creation_id: creationId })
        .eq("id", postId);
    }
    await waitForContainer(creationId, credential.access_token);
    const publishBody = new URLSearchParams({
      creation_id: creationId,
      access_token: credential.access_token,
    });
    const published = await metaRequest<{ id?: string }>(
      `${GRAPH_URL}/${credential.instagram_user_id}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: publishBody,
      },
    );
    if (!published.id) throw new Error("Meta did not return the published Instagram media ID.");
    const mediaUrl = new URL(`${GRAPH_URL}/${published.id}`);
    mediaUrl.searchParams.set("fields", "id,permalink,timestamp");
    mediaUrl.searchParams.set("access_token", credential.access_token);
    const media = await metaRequest<{ id?: string; permalink?: string; timestamp?: string }>(
      mediaUrl.toString(),
    );
    const publishedAt = media.timestamp || new Date().toISOString();
    const { data, error: updateError } = await supabaseAdmin
      .from("instagram_posts")
      .update({
        status: "published",
        published_at: publishedAt,
        scheduled_at: null,
        instagram_media_id: published.id,
        instagram_permalink: media.permalink ?? null,
        last_error: null,
        updated_by_email: actorEmail,
      })
      .eq("id", postId)
      .select("*")
      .single();
    if (updateError || !data)
      throw new Error(updateError?.message || "Published post could not be recorded.");
    await instagramAudit(postId, "published", actorEmail, {
      media_id: published.id,
      permalink: media.permalink ?? null,
    });
    return normalizePost(data);
  } catch (publishError) {
    const message =
      publishError instanceof Error ? publishError.message : "Instagram publishing failed";
    await supabaseAdmin
      .from("instagram_posts")
      .update({ status: "failed", last_error: message, updated_by_email: actorEmail })
      .eq("id", postId);
    await instagramAudit(postId, "publish_failed", actorEmail, { error: message });
    throw publishError;
  }
}

export async function publishInstagramPost(postId: string, claims: unknown) {
  return publishInstagramPostById(postId, readAdminEmail(claims));
}

export async function publishDueInstagramPosts() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("instagram_posts")
    .select("id")
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(10);
  if (error) throw new Error(error.message);
  let published = 0;
  const errors: Array<{ id: string; error: string }> = [];
  for (const post of data ?? []) {
    try {
      await publishInstagramPostById(post.id, "automation@eazydatafix.com");
      published += 1;
    } catch (publishError) {
      errors.push({
        id: post.id,
        error: publishError instanceof Error ? publishError.message : "Publishing failed",
      });
    }
  }
  return { due: data?.length ?? 0, published, errors };
}

/** Publish any already-generated slot post that is not live yet. Never generates. */
async function ensureSlotPostsPublished(postIds: string[], actorEmail: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let published = 0;
  let error: string | null = null;
  for (const id of postIds) {
    const { data } = await supabaseAdmin
      .from("instagram_posts")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();
    if (!data) continue;
    if (data.status === "published" || data.status === "publishing") continue;
    if (data.status === "archived") continue;
    try {
      if (data.status === "draft") {
        await supabaseAdmin
          .from("instagram_posts")
          .update({ status: "review", updated_by_email: actorEmail })
          .eq("id", id);
      }
      await publishInstagramPostById(id, actorEmail);
      published += 1;
    } catch (publishError) {
      error = publishError instanceof Error ? publishError.message : "Instagram publishing failed";
    }
  }
  return { published, error };
}

export async function runInstagramTick() {
  const errors: string[] = [];
  const actorEmail = "automation@eazydatafix.com";
  let connection: { username: string | null; refreshed: boolean } | null = null;
  try {
    const credential = await refreshCredentialIfNeeded();
    connection = {
      username: credential.instagram_username,
      refreshed: Boolean(credential.last_refreshed_at),
    };
  } catch (error) {
    console.error("[instagram-studio] credential maintenance failed", error);
    errors.push(error instanceof Error ? error.message : "Credential maintenance failed");
  }

  const runDate = istDate();
  const slots: Array<{
    slot: string;
    label: string;
    skipped: boolean;
    created: number;
    published: boolean;
    error: string | null;
  }> = [];

  for (const slot of dueInstagramSlots()) {
    try {
      const result = await generateInstagramDraft({
        actorEmail,
        runType: slot.key,
        runDate,
        autoPublish: true,
      });
      if (result.publishError) {
        errors.push(`${slot.label} IST: ${result.publishError}`);
      }
      slots.push({
        slot: slot.key,
        label: slot.label,
        skipped: result.skipped,
        created: result.created,
        published: result.published,
        error: result.publishError,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Slot generation failed";
      console.error(`[instagram-studio] ${slot.label} IST slot failed`, error);
      errors.push(`${slot.label} IST: ${message}`);
      slots.push({
        slot: slot.key,
        label: slot.label,
        skipped: false,
        created: 0,
        published: false,
        error: message,
      });
    }
  }

  const publishing = await publishDueInstagramPosts();
  errors.push(...publishing.errors.map((item) => `${item.id}: ${item.error}`));
  return {
    connection,
    date: runDate,
    slots,
    publishing,
    errors,
  };
}
