# EazyDataFix Content Studio setup

The Content Studio is available at `/admin/content-studio`. It uses Supabase for authentication and durable content storage, OpenAI for structured copy and image generation, Meta's Instagram API for scheduled publishing, and GitHub Actions for automation.

## 1. Apply the database migration

Apply `supabase/migrations/20260815184500_content_studio.sql` to the Supabase project connected to Lovable. The migration adds:

- Articles and editorial status
- Generation history
- Audit history
- Content Studio settings
- Row-level security for public articles

Draft, review and archived content is never included in the public read policy.

For Instagram Studio, also apply:

```text
supabase/migrations/20260816190000_instagram_studio.sql
supabase/migrations/20260821183000_instagram_reels.sql
```

This adds the Instagram draft queue, generation and audit history, service-role-only token storage and settings. Keep the `instagram-media` bucket private. The server creates one-hour signed URLs for admin previews and creates a fresh signed URL immediately before Meta fetches an approved image. Signed URLs are not persisted in the database. Browser users cannot query the Instagram tables or credentials directly.

If the managed migration runner rejects the `storage.buckets` statement, create private buckets named `instagram-media` and `instagram-reels` through the storage dashboard. The application stores server-generated JPEG covers in the first bucket and rendered MP4 Reels in the second.

## 2. Configure Lovable Cloud secrets

Add these server-only values in Lovable Cloud. Never prefix them with `VITE_`.

```text
OPENAI_API_KEY
OPENAI_CONTENT_MODEL=gpt-5.6
OPENAI_IMAGE_MODEL=gpt-image-2
CONTENT_ADMIN_EMAILS=approved-admin@example.com
CONTENT_CRON_SECRET=<a-long-random-value>
SUPABASE_SERVICE_ROLE_KEY=<existing-project-secret>
INSTAGRAM_ACCESS_TOKEN=<generated-long-lived-token>
INSTAGRAM_APP_ID=<instagram-app-id>
INSTAGRAM_APP_SECRET=<instagram-app-secret>
SHOTSTACK_API_KEY=<production-render-key>
SHOTSTACK_ENV=v1
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

## 4. Enable the schedules

Create a GitHub Actions repository secret named `CONTENT_CRON_SECRET` with the exact same value used in Lovable Cloud. The workflow runs every day at 08:00 Asia/Kolkata and creates two drafts. It does not publish them.

The endpoint is idempotent by India calendar date, so retries do not create a second daily batch.

The Instagram workflow uses the same GitHub `CONTENT_CRON_SECRET`. It runs every 30 minutes and calls `/api/cron/instagram-studio-tick`. The server:

- Prepares at most one Python education post per India calendar date after 08:00 IST
- Rotates useful Python tutorials, tips, tricks, mental models, common mistakes, ecosystem maps and practical mini-guides
- Generates an original 4:5 concept-map or cheat-sheet poster with exact learning rows and EazyDataFix branding
- Automatically schedules that education post for 20:00 IST without an approval step; deployment after 20:00 publishes it on the next tick
- Keeps manually generated posts and Reels behind the existing approval gate
- Publishes every due Scheduled item and records the Meta permalink
- Verifies and refreshes the long-lived Instagram token server-side
- Creates one 30-second 9:16 Reel every two days beginning 22 August 2026
- Builds six timed motion-story scenes and rotates three original EazyDataFix instrumentals
- Queues the Reel through Shotstack, stores the completed MP4 privately and keeps it in Draft
- Publishes approved Reels through Meta with `media_type=REELS` and `share_to_feed=true`

## 5. First production check

1. Sign in at `/admin/content-studio` with an approved email.
2. Generate two drafts manually.
3. Open each draft and review Content, SEO, Quality and Preview.
4. Save to recalculate the deterministic scores.
5. Move a passing article to Review, then schedule or publish it.
6. Confirm the article appears under `/blog`, `/sitemap.xml` and `/rss.xml`.

Publication requires an SEO score of at least 70 and a quality score of at least 80.

## 6. First Instagram production check

1. Open the Instagram tab inside `/admin/content-studio`.
2. Click **Verify connection** and confirm the connected account is `@eazydatafix`.
3. Generate one draft and wait for its 4:5 image.
4. Edit the hook, caption, hashtags, image prompt and alt text as needed, then save.
5. Approve a post only after it reaches a quality score of at least 80.
6. Publish the first post manually and confirm the returned Instagram permalink opens.
7. Schedule a later approved post and confirm the 30-minute workflow publishes it.

For the automatic education flow, dispatch `instagram-content-studio.yml` once. Confirm exactly one **Daily Python Learning** post is created with status **Scheduled** and time **20:00 IST**. If the test is run after 20:00 IST, confirm it publishes during that same tick. Automatic posts still require a quality score of at least 80; a failed quality check is recorded instead of publishing weak content.

## 7. First Reel production check

1. Add a Shotstack production key as `SHOTSTACK_API_KEY` and set `SHOTSTACK_ENV=v1`.
2. Open the Reel Studio panel and confirm **Automation ready**.
3. Click **Generate Reel now** once for the production smoke test.
4. Wait for the next automation tick or refresh after the renderer finishes.
5. Play the complete 30-second preview and verify all six scenes, the music level and the 9:16 safe area.
6. Approve only after the Reel reaches quality 80 and render status **Ready**.
7. Publish manually and confirm the returned Instagram permalink opens as a Reel.

The bundled tracks are original South-Indian-cinematic instrumentals created for EazyDataFix. Do not replace them with commercial movie songs unless written commercial-use permission is available. For tracks available only inside Instagram's licensed music library, publish the reviewed video manually in the Instagram app and add the track there.

Editing approved or scheduled copy returns the post to Draft so it must pass human approval again. Tokens and app secrets are never returned to the browser or written to logs. Private media is exposed only through short-lived signed URLs created by the server.
