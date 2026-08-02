CREATE TABLE public.package_analytics_cache (
  package TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.package_analytics_cache TO anon, authenticated;
GRANT ALL ON public.package_analytics_cache TO service_role;
ALTER TABLE public.package_analytics_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read analytics cache" ON public.package_analytics_cache FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.package_download_daily (
  package TEXT NOT NULL,
  day DATE NOT NULL,
  downloads BIGINT NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (package, day)
);

CREATE INDEX package_download_daily_day_idx ON public.package_download_daily (package, day DESC);

GRANT SELECT ON public.package_download_daily TO anon, authenticated;
GRANT ALL ON public.package_download_daily TO service_role;
ALTER TABLE public.package_download_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read daily downloads" ON public.package_download_daily FOR SELECT TO anon, authenticated USING (true);