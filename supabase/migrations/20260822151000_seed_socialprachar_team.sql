-- Initial verified SocialPrachar team records.
-- Profile fields use only the public professional information reviewed on 2026-08-22.
INSERT INTO public.alumni_profiles (
  display_name,
  headline,
  company_name,
  location,
  program_name,
  batch_label,
  linkedin_url,
  source_url,
  source_checked_at,
  publication_status,
  is_visible,
  last_verified_at
)
VALUES
  (
    'Mahesh Babu Channa',
    'Building Vajra.ai & Ziro.Digital',
    'Vajra.ai & Ziro.Digital',
    NULL,
    'SocialPrachar Team',
    'Leadership',
    'https://in.linkedin.com/in/mahibaabu',
    'https://in.linkedin.com/in/mahibaabu',
    now(),
    'approved',
    true,
    now()
  ),
  (
    'Madhav Reddy Challa',
    'QA Automation Engineer',
    'DXC Technology',
    'Hyderabad, Telangana, India',
    'SocialPrachar Team',
    'Team',
    'https://in.linkedin.com/in/madhav-reddy-challa-a0478522a',
    'https://in.linkedin.com/in/madhav-reddy-challa-a0478522a',
    now(),
    'approved',
    true,
    now()
  ),
  (
    'Suneel Kumar Kola',
    'Senior AI Engineer | Creator & Maintainer of EazyDataFix | SocialPrachar.com consultant & trainer',
    'SocialPrachar.com',
    NULL,
    'SocialPrachar Team',
    'Team',
    'https://in.linkedin.com/in/suneelkumarkola',
    'https://in.linkedin.com/in/suneelkumarkola',
    now(),
    'approved',
    true,
    now()
  )
ON CONFLICT (linkedin_url) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  headline = EXCLUDED.headline,
  company_name = EXCLUDED.company_name,
  location = EXCLUDED.location,
  program_name = EXCLUDED.program_name,
  batch_label = EXCLUDED.batch_label,
  source_url = EXCLUDED.source_url,
  source_checked_at = EXCLUDED.source_checked_at,
  publication_status = EXCLUDED.publication_status,
  is_visible = EXCLUDED.is_visible,
  last_verified_at = EXCLUDED.last_verified_at,
  updated_at = now();
