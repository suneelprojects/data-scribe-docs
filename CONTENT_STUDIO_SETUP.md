# EazyDataFix Content Studio setup

The Content Studio is available at `/admin/content-studio`. It uses Supabase for authentication and durable content storage, the OpenAI Responses API for structured article generation, and a GitHub Actions schedule for two daily drafts.

## 1. Apply the database migration

Apply `supabase/migrations/20260815184500_content_studio.sql` to the Supabase project connected to Lovable. The migration adds:

- Articles and editorial status
- Generation history
- Audit history
- Content Studio settings
- Row-level security for public articles

Draft, review and archived content is never included in the public read policy.

## 2. Configure Lovable Cloud secrets

Add these server-only values in Lovable Cloud. Never prefix them with `VITE_`.

```text
OPENAI_API_KEY
OPENAI_CONTENT_MODEL=gpt-5.6
CONTENT_ADMIN_EMAILS=approved-admin@example.com
CONTENT_CRON_SECRET=<a-long-random-value>
SUPABASE_SERVICE_ROLE_KEY=<existing-project-secret>
```

`CONTENT_ADMIN_EMAILS` accepts a comma-separated list. The server denies access when this value is empty and never sends the allow-list to the browser.

The browser continues to use the existing public Supabase variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
```

## 3. Configure Supabase Auth

Keep email sign-in enabled and add this redirect URL:

```text
https://eazydatafix.com/admin/content-studio
```

Authentication identifies the user. Server-side `CONTENT_ADMIN_EMAILS` authorization decides who can access the studio.

## 4. Enable the daily schedule

Create a GitHub Actions repository secret named `CONTENT_STUDIO_CRON_SECRET` with the exact same value used in Lovable Cloud. The workflow runs every day at 08:00 Asia/Kolkata and creates two drafts. It does not publish them.

The endpoint is idempotent by India calendar date, so retries do not create a second daily batch.

## 5. First production check

1. Sign in at `/admin/content-studio` with an approved email.
2. Generate two drafts manually.
3. Open each draft and review Content, SEO, Quality and Preview.
4. Save to recalculate the deterministic scores.
5. Move a passing article to Review, then schedule or publish it.
6. Confirm the article appears under `/blog`, `/sitemap.xml` and `/rss.xml`.

Publication requires an SEO score of at least 70 and a quality score of at least 80.
