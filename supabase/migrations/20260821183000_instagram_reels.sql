ALTER TABLE public.instagram_posts
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'post'
    CHECK (media_type IN ('post', 'reel')),
  ADD COLUMN IF NOT EXISTS reel_scenes JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS music_track TEXT,
  ADD COLUMN IF NOT EXISTS music_license TEXT,
  ADD COLUMN IF NOT EXISTS video_path TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS render_provider TEXT,
  ADD COLUMN IF NOT EXISTS render_job_id TEXT,
  ADD COLUMN IF NOT EXISTS render_status TEXT
    CHECK (render_status IS NULL OR render_status IN ('queued', 'rendering', 'ready', 'failed')),
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER NOT NULL DEFAULT 30
    CHECK (duration_seconds BETWEEN 3 AND 90),
  ADD COLUMN IF NOT EXISTS share_to_feed BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE public.instagram_generation_runs
  DROP CONSTRAINT IF EXISTS instagram_generation_runs_run_type_check;

ALTER TABLE public.instagram_generation_runs
  ADD CONSTRAINT instagram_generation_runs_run_type_check
  CHECK (run_type IN ('manual', 'daily', 'reel_manual', 'reel_alternate'));

CREATE UNIQUE INDEX IF NOT EXISTS instagram_generation_reel_alternate_once_idx
  ON public.instagram_generation_runs (run_type, run_date)
  WHERE run_type = 'reel_alternate' AND run_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS instagram_posts_media_type_status_idx
  ON public.instagram_posts (media_type, status, scheduled_at, updated_at DESC);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'instagram-reels',
  'instagram-reels',
  false,
  52428800,
  ARRAY['video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
