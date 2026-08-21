import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { INSTAGRAM_POST_STATUSES } from "./instagram-studio.types";

const postInputSchema = z.object({
  id: z.string().uuid(),
  pillar: z.string().min(1).max(100),
  hook: z.string().min(1).max(160),
  caption: z.string().min(1).max(2200),
  hashtags: z.array(z.string().max(60)).max(12),
  image_prompt: z.string().min(1).max(4000),
  image_alt: z.string().min(1).max(300),
});

export const getInstagramStudioDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getInstagramDashboard } = await import("./instagram-studio.server");
    return getInstagramDashboard(context.claims);
  });

export const generateInstagramPostDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ topic: z.string().max(500).optional() }))
  .handler(async ({ data, context }) => {
    const { generateInstagramDraft } = await import("./instagram-studio.server");
    const { readAdminEmail } = await import("./content-studio.server");
    return generateInstagramDraft({
      topic: data.topic,
      actorEmail: readAdminEmail(context.claims),
      runType: "manual",
    });
  });

export const generateInstagramReelDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ topic: z.string().max(500).optional() }))
  .handler(async ({ data, context }) => {
    const { generateInstagramReelDraft: generateReel } = await import("./instagram-studio.server");
    const { readAdminEmail } = await import("./content-studio.server");
    return generateReel({
      topic: data.topic,
      actorEmail: readAdminEmail(context.claims),
      runType: "reel_manual",
    });
  });

export const saveInstagramPostDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(postInputSchema)
  .handler(async ({ data, context }) => {
    const { saveInstagramPost } = await import("./instagram-studio.server");
    return saveInstagramPost(data, context.claims);
  });

export const changeInstagramPostStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(INSTAGRAM_POST_STATUSES),
      scheduledAt: z.string().nullable().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { setInstagramPostStatus } = await import("./instagram-studio.server");
    return setInstagramPostStatus(data, context.claims);
  });

export const regenerateInstagramPostImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { regenerateInstagramImage } = await import("./instagram-studio.server");
    return regenerateInstagramImage(data.id, context.claims);
  });

export const rerenderInstagramReel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { rerenderInstagramReel: rerender } = await import("./instagram-studio.server");
    return rerender(data.id, context.claims);
  });

export const publishInstagramPostNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { publishInstagramPost } = await import("./instagram-studio.server");
    return publishInstagramPost(data.id, context.claims);
  });

export const checkInstagramConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { verifyInstagramConnection } = await import("./instagram-studio.server");
    return verifyInstagramConnection(context.claims);
  });

export type { InstagramDashboard, InstagramPost } from "./instagram-studio.types";
