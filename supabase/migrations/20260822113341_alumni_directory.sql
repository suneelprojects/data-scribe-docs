CREATE TABLE public.alumni_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  headline TEXT,
  company_name TEXT,
  location TEXT,
  program_name TEXT,
  batch_label TEXT,
  linkedin_url TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  source_url TEXT,
  source_checked_at TIMESTAMPTZ,
  publication_status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (publication_status IN ('pending_review', 'approved', 'claimed', 'removed')),
  is_visible BOOLEAN NOT NULL DEFAULT FALSE,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (is_visible = FALSE OR publication_status IN ('approved', 'claimed'))
);

CREATE INDEX alumni_profiles_public_directory_idx
  ON public.alumni_profiles (company_name, program_name, location, display_name)
  WHERE is_visible = TRUE AND publication_status IN ('approved', 'claimed');

CREATE TRIGGER alumni_profiles_updated_at
BEFORE UPDATE ON public.alumni_profiles
FOR EACH ROW EXECUTE FUNCTION public.content_studio_set_updated_at();

ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published alumni profiles"
  ON public.alumni_profiles
  FOR SELECT
  USING (is_visible = TRUE AND publication_status IN ('approved', 'claimed'));

GRANT ALL ON public.alumni_profiles TO service_role;
