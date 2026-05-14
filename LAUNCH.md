# Valyn launch runbook

End-to-end playbook for shipping the first public version. Steps are ordered by
dependency — finishing each phase is a prerequisite for the next. Skip nothing.

Domain: `getvalyn.com` • Inbound: `inbound.getvalyn.com` • AWS region: `us-east-1`

---

## Phase 0 — Pre-flight (today, 15 min)

Confirm the code is launch-ready before you touch any cloud.

```bash
git status                                # working tree clean? if not, commit
bun install                               # deps in sync
bun run type-check                        # → no output (pass)
bun run test                              # → 38 / 38 passing
bun run build                             # → "✓ Compiled successfully", no warnings
```

Spot-check the secrets you'll need in production:

```bash
grep -E '^(SHOPIFY_API_KEY|SHOPIFY_API_SECRET|DATABASE_URL|SMTP_CREDS_KEY|CRON_SECRET|VERCEL_TOKEN|VERCEL_PROJECT_ID|RENDER_)' .env
```

- `SHOPIFY_API_KEY` / `SHOPIFY_API_SECRET` — from Shopify Partners → your app
- `DATABASE_URL` — Postgres connection string (Neon / Supabase / Vercel Marketplace)
- `SMTP_CREDS_KEY` — `openssl rand -base64 32` (already set if you ran this earlier)
- `CRON_SECRET` — UUID for manual cron invocation (already set)
- `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` — from vercel.com → Account Settings → Tokens / Project Settings

Generate a fresh `SMTP_CREDS_KEY` now if you don't have one. **Once set, never rotate** — it decrypts every merchant's SMTP password.

---

## Phase 1 — AWS infrastructure (one-shot, ~10 min provision + 24-48h SES approval)

### 1.1 Provision via Pulumi

```bash
cd aws
npm install                               # @pulumi/aws, @pulumi/command, dotenv
pulumi login s3://valyn-pulumi-state      # uses the bucket from package.json
pulumi stack select dev                   # or `pulumi stack init dev` first time
pulumi up                                 # review the plan, type "yes"
```

What gets created:

| Resource                                                                    | Purpose                               |
| --------------------------------------------------------------------------- | ------------------------------------- |
| `valyn-rate-limits-table-dev` (DynamoDB)                                    | Per-IP rate limiter                   |
| `valyn-inbound-emails-dev` (S3)                                             | Raw MIME storage, 30-day lifecycle    |
| `valyn-inbound-dev` (SNS topic)                                             | Notifies the app on new mail          |
| SES receipt rule set → S3 + SNS                                             | Routes inbound mail into the pipeline |
| Route 53 MX `inbound.getvalyn.com` → `inbound-smtp.us-east-1.amazonaws.com` | DNS for SES inbound                   |
| Route 53 TXT `_amazonses.inbound.getvalyn.com`                              | Domain verification                   |
| SES domain identity verification                                            | Confirms SES can receive              |
| IAM user with minimum policy                                                | App's runtime credentials             |
| `local.Command` → Vercel API                                                | Mirrors `.env` into Vercel env vars   |

When Pulumi finishes, sanity check:

```bash
dig MX inbound.getvalyn.com +short        # must return: 10 inbound-smtp.us-east-1.amazonaws.com.
dig TXT _amazonses.inbound.getvalyn.com +short    # SES verification token visible
pulumi stack output                       # shows the bucket name + SNS ARN
```

### 1.2 SES production access (BLOCKING — file today)

By default AWS keeps every account in SES sandbox: inbound only accepts mail from
addresses you've verified. You can't onboard real merchants until you exit.

1. AWS Console → **SES** → **Account dashboard**
2. **Request production access**
3. Use case description (paste this, adjust contact):

    > Valyn is a Shopify app that receives forwarded customer support emails
    > and replies automatically using Shopify order data. Inbound volume per
    > merchant is bounded by the plan (500/mo Starter, 3,000/mo Pro).
    > Outbound email is sent by each merchant's own SMTP — we do not send
    > from SES. Bounce/complaint handling: not applicable to inbound.

4. Submit. Approval is usually 24h, sometimes 48h.

### 1.3 Verify Vercel got the env vars

The Pulumi `vercel/env-sync.ts` upserted every `.env` key into the Vercel project.

```bash
vercel env ls --environment production    # or check vercel.com → Project → Settings → Env Vars
```

Expect to see: `NODE_ENV`, `APP_URL`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`, `RATE_LIMITS_TABLE_NAME`, `DATABASE_URL`,
`SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_SCOPES`, `SHOPIFY_APP_URL`,
`INBOUND_EMAIL_BUCKET`, `INBOUND_EMAIL_DOMAIN`, `INBOUND_SNS_TOPIC_ARN`,
`SMTP_CREDS_KEY`, `CRON_SECRET`.

`VERCEL_TOKEN` / `VERCEL_PROJECT_ID` are filtered out — they're Pulumi-only.

---

## Phase 2 — Database

```bash
DATABASE_URL='postgres://prod-user:pw@host:5432/valyn' bun db:push
```

This applies:

- `EmailStatus` gains `REVIEW`, `LIMIT_EXCEEDED`, `MISCLASSIFIED`
- New enums: `Strictness`, `FallbackBehavior`, `TemplateType`
- New `ReplyTemplate` table
- `Settings`: `strictness`, `fallbackBehavior`, `smtpLastVerifiedAt`, `smtpLastError`
- `EmailLog`: `confidence`, `detectionReason`, `detectedLanguage`,
  `replyPreview`, `retryCount`, `lastRetryAt`, `reviewedAt`, `reviewedBy`,
  `manuallyMarked`

Verify:

```bash
DATABASE_URL='...' bunx prisma db pull --schema=/tmp/check.prisma && diff prisma/schema.prisma /tmp/check.prisma | head
```

Backups: confirm your Postgres provider has daily backups on (Neon Free has 7d
history; Supabase has daily; Vercel Marketplace varies).

---

## Phase 3 — Vercel deploy

### 3.1 First production deploy

```bash
git push origin main                      # triggers production build
```

Watch the build at `vercel.com/<team>/valyn/deployments`. First build is
typically 2-4 min.

### 3.2 Domain + DNS

Vercel → Project → **Domains** → **Add**:

- `getvalyn.com` (apex / primary)
- `www.getvalyn.com` (auto-redirect to apex)

Update Route 53 (or wherever your apex DNS lives):

- `A` record `getvalyn.com` → `76.76.21.21` (Vercel's anycast)
- `CNAME` record `www.getvalyn.com` → `cname.vercel-dns.com`

Wait ~5 min for SSL certificate provisioning. Vercel shows green checks
when done.

### 3.3 Confirm production

```bash
curl -sI https://getvalyn.com/ | head -3                    # → 200 OK
curl -s https://getvalyn.com/api/health                     # → {"status":"ok"}
curl -s https://getvalyn.com/sitemap.xml | head -3          # → valid XML
curl -s https://getvalyn.com/robots.txt                     # → disallow rules
curl -sI https://getvalyn.com/api/cron/cleanup-logs         # → 401 (good — needs auth)
curl -sI -H "Authorization: Bearer $CRON_SECRET" \
  https://getvalyn.com/api/cron/cleanup-logs                # → 200 {"ok":true,"deleted":0}
```

### 3.4 Cron verification

Vercel → Project → **Settings → Crons** should show:

| Path                     | Schedule    | Status    |
| ------------------------ | ----------- | --------- |
| `/api/cron/cleanup-logs` | `0 3 * * *` | Scheduled |

Wait until 03:00 UTC and check the **Logs** tab for a `"retention cleanup"`
line. Or invoke manually with the curl above to confirm it works.

---

## Phase 4 — Shopify Partners dashboard

Shopify Partners → **Apps** → your app → **Configuration**.

### 4.1 URLs

| Field                         | Value                                    |
| ----------------------------- | ---------------------------------------- |
| **App URL**                   | `https://getvalyn.com/`                  |
| **Allowed redirection URLs**  | `https://getvalyn.com/api/auth/callback` |
| **Embedded in Shopify admin** | ✅ ON                                    |
| **App proxy**                 | Leave empty                              |

### 4.2 API access (scopes)

Set to exactly:

```
read_orders,read_fulfillments,read_customers
```

Must match `SHOPIFY_SCOPES` env var.

### 4.3 Mandatory compliance webhooks

**App setup → Privacy** — point all three at the same endpoint:

- `customers/data_request` → `https://getvalyn.com/api/webhooks/shopify`
- `customers/redact` → `https://getvalyn.com/api/webhooks/shopify`
- `shop/redact` → `https://getvalyn.com/api/webhooks/shopify`

The route dispatches by `X-Shopify-Topic` header.

### 4.4 Test the GDPR webhooks

Partners → app → **App setup → Webhooks → Send test notification** for each
of the three. Each should return 200 within a few seconds.

### 4.5 Legal pages + support

| Field                    | Value                                              |
| ------------------------ | -------------------------------------------------- |
| **Privacy policy URL**   | `https://getvalyn.com/legal/privacy`               |
| **Terms of service URL** | `https://getvalyn.com/legal/terms`                 |
| **Support email**        | `support@getvalyn.com` (set up an inbox / forward) |

---

## Phase 5 — Dev store smoke test (gate before submission)

You must pass every line of this before submitting publicly. Reviewers walk
a near-identical path.

### 5.1 Install

Partners → **Stores → Add store → Development store**. Then visit:

```
https://getvalyn.com/api/auth?shop=<your-dev-store>.myshopify.com
```

| Expected                                                              | If it fails, check                            |
| --------------------------------------------------------------------- | --------------------------------------------- |
| Shopify OAuth grant screen                                            | `SHOPIFY_API_KEY`, `Allowed redirection URLs` |
| Redirect back lands in embedded admin                                 | `App URL`, `Embedded` toggle                  |
| Page renders inside Shopify admin iframe (not a "refused to connect") | proxy.ts CSP headers                          |
| `BillingBanner` shows Starter + Pro cards                             | usage endpoint, subscription state            |

### 5.2 Subscribe

| Step                                              | Expected                                  |
| ------------------------------------------------- | ----------------------------------------- |
| Click **Start Pro**                               | Top-frame redirect to Shopify charge page |
| Approve test charge (no real money in dev)        | Lands back in embedded admin              |
| `BillingBanner` is gone                           | `subscriptionStatus = ACTIVE`             |
| `Subscription` card shows "Pro" + trial-ends date | `planKey = 'pro'` persisted               |

### 5.3 Configure SMTP

Use Gmail with an **app password** (Settings → Security → 2FA → App passwords).
Free, fast, reliable. In Valyn's Settings → SMTP:

| Field        | Value                    |
| ------------ | ------------------------ |
| Host         | `smtp.gmail.com`         |
| Port         | `465`                    |
| Use TLS      | ✅                       |
| Username     | your-gmail-address       |
| Password     | the 16-char app password |
| From name    | (your store name)        |
| From address | same as username         |

Click **Send test connection** → green Banner + "Verified today" badge.

### 5.4 End-to-end WISMO

1. **Pre-fill an order** in the dev store admin (create order #1001 with a tracking number, mark it fulfilled).
2. **Forward a test email** from an external account (not from the SMTP user — Gmail dedupes self-replies):
    - To: `wismo+<shopId>@inbound.getvalyn.com` (copy exact value from your Settings page)
    - Subject: `Where is my order?`
    - Body: `Hi, my order #1001 hasn't arrived. Can you check?`
3. Within ~5s the original sender should receive the auto-reply.
4. Refresh Valyn dashboard → row appears: `Replied`, intent `WISMO`, language `EN`.
5. Click the row → Modal shows full body, reply preview, confidence ~0.7+.

### 5.5 Walk every code path

Run through each scenario in one sitting. Each row of the table is a failure mode you don't want to discover in production.

| Scenario                | How to trigger                                                       | Expected status                                            |
| ----------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| WISMO with order #      | Forward "where is order #1001"                                       | `Replied`                                                  |
| WISMO no order #        | Forward "where is my order" from a customer with prior orders        | `Replied` (most-recent order)                              |
| WISMO unknown sender    | Forward from never-seen address, no order #                          | `Replied` with fallback OR `Needs review` per setting      |
| Non-WISMO               | "What's your return policy"                                          | `Ignored`                                                  |
| Auto-replies OFF        | Toggle in Settings, forward WISMO                                    | `Needs review` (logged, not silent)                        |
| Strictness REVIEW_QUEUE | Set in Settings, forward WISMO                                       | `Needs review` → click **Approve & send** → `Replied`      |
| Fallback SKIP           | Set + forward "where is my order" with no match                      | `Ignored`                                                  |
| SMTP wrong password     | Change password in Settings, forward WISMO                           | `Failed`, error visible in row                             |
| Quota exceeded          | (Hard to test; skip or seed `EmailLog` rows manually if you want)    | `Over quota`                                               |
| Manual retry            | On a `Failed` row, click **Retry send**                              | Goes to `Replied` if fixed                                 |
| Mark misclassified      | On any `Replied`, click **Mark misclassified**                       | Status `Misclassified`                                     |
| CSV export              | Click **Export CSV**                                                 | Downloads file with all columns                            |
| Templates               | `/templates` → add a custom IN_TRANSIT, mark default → forward WISMO | Reply uses your template body                              |
| Pause + log review      | Pause automation, forward 2 emails, resume                           | Both logged as `Needs review`, accessible from tab         |
| GDPR webhook            | Partners → Webhooks → Send test for `customers/redact`               | 200 response, EmailLog rows for that email deleted         |
| Uninstall               | Shopify admin → Apps → Valyn → Uninstall                             | `Shop.uninstalledAt` set, `subscriptionStatus = CANCELLED` |

If anything in this table fails, **stop and fix before continuing**.

---

## Phase 6 — Listing assets

These are the bits Shopify reviewers actually grade you on. Done well, they
clear the App Store bar. Done poorly, you lose 2-3 weeks per resubmit.

### 6.1 App icon — 1200×1200 PNG

- Square, no rounded corners (Shopify adds them).
- Solid background (no transparency).
- Recognizable at 64×64 — the icon shrinks aggressively in the App Store grid.
- Avoid embedded text; the wordmark goes in the listing title.

### 6.2 Feature media — 1600×900 banner

One hero image at the top of the listing. PNG or JPEG.

### 6.3 Screenshots (3-7) — 1600×900 each

Take these inside the dev store during a real install. Hide test data
(`@example.com`, `#1001`). Use these scenes:

1. Dashboard with stats + email log + a few replied rows
2. Email log row drawer with reply preview
3. Settings page (Auto-replies section showing strictness + tone + language)
4. Settings — Outgoing SMTP with green "Verified" badge
5. Templates page with a custom IN_TRANSIT template
6. Billing banner showing Starter + Pro cards (catch this before subscribing)
7. (Optional) The forwarding-instructions card with the inbound address

Use Cleanshot / macOS Screenshot, retina-resolution. Crop to 1600×900 in
Preview / Photos.

### 6.4 Copy

| Field        | Limit     | Example direction                                                                                                                                                                                                                          |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| App name     | 30 chars  | `Valyn — WISMO replies`                                                                                                                                                                                                                    |
| Tagline      | 100 chars | `Auto-reply to "where is my order?" emails using real Shopify order data.`                                                                                                                                                                 |
| Description  | 500 chars | Lead with the problem (60% of support inbox is WISMO), the solution (auto-detects, looks up the order, sends the tracking reply from your own domain), and what's intentionally out of scope (no full helpdesk). Mirror the homepage tone. |
| Categories   | n/a       | `Customer service` (primary), `Productivity` (secondary)                                                                                                                                                                                   |
| Search terms | n/a       | `wismo`, `order tracking`, `auto-reply`, `customer support`, `order status`                                                                                                                                                                |

### 6.5 Pricing setup

Partners → **Pricing**:

- Starter: `$19.00 USD / month, 7-day trial`
- Pro: `$49.00 USD / month, 7-day trial`

**Must exactly match** `src/config/billing.ts`. Shopify rejects mismatched
listings on review.

### 6.6 (Optional) Demo video

A 30–60s screen recording of the install → forward email → reply flow speeds
up review noticeably. Loom or QuickTime. Upload to YouTube unlisted, paste
the URL in the listing.

---

## Phase 7 — Search engines (after Phase 3 is live for 24h)

### 7.1 Google Search Console

1. https://search.google.com/search-console → **Add property** → URL prefix → `https://getvalyn.com/`
2. **Verify** via DNS TXT (Route 53 → Add record → the value Google gives you).
3. **Sitemaps** → submit `sitemap.xml`. Confirm Google parses it (status: Success).
4. **URL Inspection** → paste `https://getvalyn.com/` → **Request indexing**. Repeat for `/pricing`, `/features`, `/demo`, `/faq`, `/reduce-wismo-tickets-shopify`, `/gorgias-alternative`.

Realistic timing: first pages indexed in 1-7 days; full coverage in ~30 days.

### 7.2 Bing Webmaster Tools

1. https://www.bing.com/webmasters → **Add a site**
2. Use **Import from Google Search Console** (single click). It pulls your verification + sitemap.
3. Confirm in **Sitemaps** that `sitemap.xml` is listed as "Indexed".

### 7.3 IndexNow ping (optional, 10 min)

Bing's IndexNow lets you push new URLs to Bing/Yandex without waiting for crawl.
Skip for V1 — only worth it once you're publishing blog posts regularly.

---

## Phase 8 — Soft launch (recommended over public submission)

Hard truth: **don't submit publicly on day one**. Use Custom Distribution to
share with 3–5 friendly merchants first. Find every bug at 5 merchants, not 50.

### 8.1 Generate the private install link

Partners → **Distribution → Custom Distribution → Generate install link**.

The link looks like `https://accounts.shopify.com/select?...&app_id=...`.
Send it to merchants. They install just like an App Store install — full
OAuth + billing — but the app stays unlisted.

### 8.2 Watch the first 100 emails

For each early install:

- Open Vercel **Functions → Logs**, filter by `wismo` — confirm clean processing
- Check the Valyn dashboard email log — confidence should be ≥0.7 on most
  WISMO, ≤0.3 on most OTHER
- Track customer reply rate to the auto-reply — should be near zero (the
  reply answered the question)

Spend a week here. Fix the things you'll find: edge-case order numbers,
language detection misses, SMTP providers with quirky TLS.

---

## Phase 9 — Public App Store submission

Only after Phase 8 has had no real merchant-side outages for 5+ days.

### 9.1 Pre-submission checklist

- [ ] Every row in the Phase 5 smoke test passes
- [ ] SES is in production access (not sandbox)
- [ ] All 3 GDPR webhooks return 200 on Partners "Send test"
- [ ] Privacy + Terms URLs render real legal text (you reviewed with counsel)
- [ ] Pricing in Partners matches `src/config/billing.ts` exactly
- [ ] App icon + 3-7 screenshots + feature banner uploaded
- [ ] Tagline ≤100 chars, description ≤500 chars filled
- [ ] Support email is monitored
- [ ] At least 3 friendly merchants have had Valyn installed for ≥5 days
- [ ] Vercel + AWS cost dashboard checked — no surprises

### 9.2 Submit

Partners → **Distribution → Public Distribution → Submit for review**.

Expect:

- Automated checks (minutes)
- Human review (10-21 days)
- Likely 1-2 rounds of feedback. Address each comment, resubmit same day.

### 9.3 During review

Don't change `src/config/billing.ts` prices, the API scopes, or the GDPR
webhook URLs. Reviewers retest after changes and the clock resets.

---

## Day-1 / week-1 operations

### Logs

Vercel → Project → **Logs** (or **Observability** → Drains for long retention).

Useful filters:

- `wismo pipeline error` — anything red
- `gdpr` — any GDPR webhook activity
- `smtp verify failed` — failed test connections (worth a follow-up email)
- `retention cleanup` — confirms the cron is firing

### Cron health

Vercel **Crons** tab shows the last 50 invocations. If `cleanup-logs` ever
shows red, click it and read the failure.

### Database

Watch row counts:

```sql
SELECT status, COUNT(*) FROM "EmailLog"
  WHERE "receivedAt" > now() - interval '24 hours'
  GROUP BY status ORDER BY 2 DESC;
```

Red flags: `FAILED` >5% of total → SMTP issue; `LIMIT_EXCEEDED` >0 →
merchant on wrong tier; `MISCLASSIFIED` rising → detection tuning needed.

### Costs

Check after week 1:

- AWS: SES inbound is free for first 1k/month, then $0.10/1k. S3+SNS rounding errors.
- Vercel: Hobby tier fine until ~100 daily users; upgrade to Pro before going public.
- Postgres: depends on provider.

---

## Known gaps (post-launch backlog)

These are documented limitations. None block App Store approval; none lie to
merchants in the marketing copy after the recent cleanup.

| Gap                                                  | Impact                                                                    | Fix path                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Response delays >60s cap in-process                  | Merchants can configure 60s; longer values silently clamp                 | Vercel Queues or SQS-backed job runner                               |
| Test-send-sample-WISMO from Settings                 | Today merchants can only verify SMTP connectivity                         | Add a button that sends a canned reply to the merchant's own address |
| Self-serve data export for merchants                 | GDPR webhooks handle the legal floor; no in-app UX                        | Add `GET /api/internal/data-export.zip`                              |
| Detection-confidence threshold slider                | Confidence is stored, not yet exposed for tuning                          | Add to Settings → Auto-replies                                       |
| Audit history table                                  | EmailLog carries per-row history (retryCount, reviewedAt, manuallyMarked) | Defer until merchants ask                                            |
| Multi-store routing rules (was Scale-tier marketing) | Removed from marketing                                                    | Defer indefinitely                                                   |

---

## Rollback playbook (in case something burns)

### Vercel

Vercel → Deployments → click the last known good → **Promote to production**.
Takes ~30 seconds.

### Database

Schema-only changes are forward-compatible (added columns, new enum values).
If you need to revert: don't try to roll back schema; roll the app back instead.

### Disable replies platform-wide (kill switch)

If something is causing customer-facing damage, the fastest stop is to flip a
single env var:

```bash
vercel env add VALYN_KILL_SWITCH on production
```

You'd then add an early-return in `processInboundEmail` that checks
`process.env.VALYN_KILL_SWITCH === "on"`. **This isn't wired yet** — wire it
on day 1 before you have real merchants.

### Shopify

If a webhook causes catastrophic damage, you can disable it from Partners →
Webhooks. The OAuth `register` call at install-time will re-create it on the
next install, so this is a temporary mitigation.

---

## Emergency contacts

| Service           | Where to log in                   | Where to file urgent issue   |
| ----------------- | --------------------------------- | ---------------------------- |
| Vercel            | vercel.com                        | Dashboard → Support          |
| AWS               | console.aws.amazon.com            | Health Dashboard → Open case |
| Shopify Partners  | partners.shopify.com              | Partners → Help & support    |
| Postgres provider | Neon / Supabase / etc.            | provider's status page       |
| Domain (Route 53) | console.aws.amazon.com → Route 53 | AWS support                  |

Bookmark all five before you go live.

---

## Final sanity command

Run this one-liner the morning of launch. If any step fails, **don't launch**.

```bash
bun run type-check && bun run test && bun run build && \
  curl -fsS https://getvalyn.com/api/health && \
  curl -fsS https://getvalyn.com/sitemap.xml >/dev/null && \
  dig MX inbound.getvalyn.com +short && \
  echo "READY ✓"
```
