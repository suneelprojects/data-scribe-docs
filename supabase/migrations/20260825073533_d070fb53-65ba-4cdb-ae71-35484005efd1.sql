ALTER TABLE public.instagram_generation_runs
  DROP CONSTRAINT IF EXISTS instagram_generation_runs_run_type_check;

ALTER TABLE public.instagram_generation_runs
  ADD CONSTRAINT instagram_generation_runs_run_type_check
  CHECK (run_type IN (
    'manual', 'daily', 'education_daily',
    'reel_manual', 'reel_alternate',
    'slot_0700', 'slot_1230', 'slot_1800', 'slot_2300'
  ));

CREATE UNIQUE INDEX IF NOT EXISTS instagram_generation_runs_run_type_date_key
  ON public.instagram_generation_runs (run_type, run_date)
  WHERE run_date IS NOT NULL;