# Valyn

Embedded Shopify app that detects "Where is my order?" (WISMO) customer
support emails and replies automatically using real Shopify order data —
sent from the merchant's own SMTP so customers see the store's address.

---

## What it does (merchant-facing)

A merchant forwards their support inbox to a per-shop Valyn address.
Whenever a customer writes asking about an order:

1. **Detect** — an AI classifier (keyword classifier as fallback) decides
   whether the email is WISMO (in EN, FR, DE) or skips it.
2. **Look up the order** — by order number in the message, then by sender
   email, then by most-recent order.
3. **Reply** — composes a templated response with order name, carrier,
   tracking link, ETA, and sends it through the merchant's SMTP.
4. **Log** — every processed email shows up in the embedded dashboard with
   intent, status, confidence, and a reply preview.

Everything irrelevant (returns, complaints, refunds, product questions)
lands untouched in the merchant's inbox. Valyn is not a helpdesk — it
solves one repetitive workflow.

---

## Plans

Two tiers, both with a **7-day free trial**, billed through Shopify Billing.

|                    | Starter           | Pro                          |
| ------------------ | ----------------- | ---------------------------- |
| Price              | **$19/mo**        | **$49/mo**                   |
| Email quota        | 500 / month       | 3,000 / month                |
| Languages          | English only      | EN, FR, DE                   |
| Reply templates    | Built-in defaults | Multiple custom per scenario |
| Reply tone control | —                 | Neutral / Friendly / Formal  |
| Manual review mode | —                 | ✓                            |
| One-click retry    | —                 | ✓                            |
| Log retention      | 7 days            | 90 days                      |
| Support            | Email             | Priority email               |

A merchant can switch tiers any time from the in-app billing banner.
Per-plan caps live in `src/lib/plan-features.ts` — single source of truth.

---

## End-to-end flow

```
Customer
   │  sends "where is my order?" email
   ▼
Merchant's support inbox
   │  forwards (Gmail / Outlook / helpdesk rule)
   ▼
wismo+<shopId>@inbound.getvalyn.com
   │
   ▼  Phase 1 — Intake (AWS)
SES receipt rule
   │  ├─ writes raw MIME to S3 (30-day lifecycle)
   │  └─ publishes notification to SNS topic
   ▼
SNS HTTPS subscription
   │
   ▼  Phase 2 — Pipeline (Next.js on Vercel)
POST /api/webhooks/inbound-email
   │  ├─ verifies SNS topic ARN
   │  ├─ confirms subscription on first call
   │  ├─ fetches MIME from S3
   │  └─ parses with mailparser
   ▼
src/lib/wismo/pipeline.ts → processInboundEmail()
   │  ├─ claim EmailLog row (inboundMessageId @unique) — idempotency
   │  ├─ classifyInbound(): Bedrock LLM every email, keyword fallback
   │  ├─ update row with intent, confidence, language, reason
   │  ├─ gate: subscription status, pause, quota, strictness, fallback
   │  ├─ identifyOrder(): Shopify Admin GraphQL
   │  │      order# → customer email → most recent
   │  ├─ buildReplyBody(): merchant template if any, else translated default
   │  ├─ applyTone(): neutral / friendly / formal wrapper
   │  └─ sendReplyForLog(): nodemailer through merchant SMTP
   ▼
Customer's inbox
   reply arrives in ~3-5s, threading preserved via In-Reply-To header
```

---

## Architecture

| Layer               | Tech                                    | Role                                                         |
| ------------------- | --------------------------------------- | ------------------------------------------------------------ |
| Frontend (public)   | Next.js App Router, Tailwind, DaisyUI   | Marketing site at `getvalyn.com`                             |
| Frontend (embedded) | Polaris + App Bridge v4                 | `/dashboard`, `/settings`, `/templates` inside Shopify admin |
| Auth (embedded)     | App Bridge session tokens (HS256 JWT)   | Gates all `/api/internal/*` calls                            |
| Auth (install)      | Manual Shopify OAuth                    | `/api/auth` + `/api/auth/callback`                           |
| Database            | Prisma + PostgreSQL                     | Shop, Settings, EmailLog, ReplyTemplate                      |
| Inbound email       | AWS SES → S3 → SNS → webhook            | One inbound address per shop                                 |
| WISMO detection     | Amazon Bedrock LLM (keyword fallback)   | AI intent classification on every email                      |
| Outbound email      | nodemailer + per-shop SMTP              | Replies from merchant's domain                               |
| Rate limit          | DynamoDB sliding-window                 | Per-IP cap on `/api/internal/*`                              |
| Cron                | Vercel Crons                            | Daily retention cleanup                                      |
| Infra-as-code       | Pulumi                                  | AWS resources + Vercel env-var sync                          |
| Hosting             | Vercel                                  | Next.js + Fluid Compute                                      |
| Logs                | JSON-line to stdout                     | Vercel log search                                            |
| Billing             | Shopify Billing API                     | `appSubscriptionCreate` + `app_subscriptions/update` webhook |

---

## Data model (`prisma/schema.prisma`)

### `Shop`

One row per installed store. Tracks OAuth credentials, subscription state,
plan, and billing-period boundaries.

### `Settings` (1:1 with Shop)

Merchant-controlled knobs:

- `autoReplyEnabled` — kill switch; paused emails are still logged as `REVIEW`
- `strictness` — `AUTO_REPLY` / `REVIEW_QUEUE` / `PASS_THROUGH`
- `fallbackBehavior` — when no order matched: `SEND_FALLBACK` / `QUEUE_REVIEW` / `SKIP`
- `language` — default reply language (overridden by detected language per email)
- `tone` — Pro-only: `NEUTRAL` / `FRIENDLY` / `FORMAL`
- `responseDelaySeconds` — 0-60s in-process delay
- `greeting`, `signature`, `supportEmail` — text knobs
- `smtpHost/Port/Secure/User/PassEnc/FromName/FromAddress` — outgoing SMTP. Password encrypted at rest with AES-256-GCM via `SMTP_CREDS_KEY`
- `smtpLastVerifiedAt`, `smtpLastError` — health surface
- `inboundAddress` — `wismo+<shopId>@inbound.getvalyn.com`, auto-provisioned at install

### `ReplyTemplate` (Pro)

Per-shop, per-`TemplateType` (`IN_TRANSIT` / `PROCESSING` / `NO_ORDER` /
`MULTIPLE`). One default per type; placeholders `{{orderName}}`,
`{{carrier}}`, `{{tracking}}` are interpolated at send time.

### `EmailLog`

Every email Valyn processes:

- Identity: `inboundMessageId @unique` (idempotency), `senderEmail`, `subject`, `body`
- Classification: `intent` (`WISMO`/`OTHER`), `confidence`, `detectionReason`, `detectedLanguage`
- Resolution: `orderId`, `orderName`
- Outcome: `status` (one of `PENDING`/`REPLIED`/`FAILED`/`IGNORED`/`REVIEW`/`LIMIT_EXCEEDED`/`MISCLASSIFIED`)
- Audit: `replyPreview`, `errorMessage`, `retryCount`, `lastRetryAt`, `reviewedAt`, `reviewedBy`, `manuallyMarked`

Indexes on `(shopId, receivedAt)` and `(shopId, status)` keep dashboard
queries cheap.

---

## Decision flow (pipeline order)

```
1. messageId already processed?  → skip (idempotency claim)
2. classifyInbound(): LLM (keyword fallback) → WISMO or OTHER?
3. OTHER                          → IGNORED
4. Subscription not ACTIVE?       → IGNORED ("no active subscription")
5. autoReplyEnabled === false?    → REVIEW   ("automation paused")
6. usage.used > quota?            → LIMIT_EXCEEDED
7. strictness === PASS_THROUGH?   → IGNORED  ("strictness: pass-through")
8. strictness === REVIEW_QUEUE?   → REVIEW
9. SMTP not configured?           → FAILED   ("smtp not configured")
10. identifyOrder() throws?       → FAILED   ("lookup: ...")
11. no order matched?
    - fallbackBehavior SKIP        → IGNORED
    - fallbackBehavior QUEUE_REVIEW → REVIEW
    - fallbackBehavior SEND_FALLBACK → continue (sends noOrderFound template)
12. delay (0-60s)
13. send via merchant SMTP
14. → REPLIED  (or FAILED on send error)
```

Merchant control happens at every step — nothing happens silently.

---

## Key code locations

| File                                 | Responsibility                                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| `src/lib/wismo/pipeline.ts`          | The whole decision flow above; `processInboundEmail()` + `sendReplyForLog()`     |
| `src/lib/wismo/detect.ts`            | Keyword classifier (LLM fallback), `intent + confidence + language + matched`    |
| `src/lib/wismo/classify-llm.ts`      | Bedrock LLM intent classifier; returns null on any failure so caller falls back  |
| `src/lib/wismo/shopify-orders.ts`    | Admin GraphQL for order lookup                                                   |
| `src/lib/wismo/tone.ts`              | Tone wrappers around reply body                                                  |
| `src/lib/translations.ts`            | Built-in reply templates per language                                            |
| `src/lib/plan-features.ts`           | Per-plan capability matrix                                                       |
| `src/lib/usage.ts`                   | Billing-period usage counting                                                    |
| `src/lib/billing.ts`                 | `appSubscriptionCreate`, `fetchAppSubscription`, `isSubscriptionActive`          |
| `src/lib/email.ts`                   | nodemailer wrapper + `verifySmtpConnection`                                      |
| `src/lib/crypto.ts`                  | AES-256-GCM for SMTP passwords at rest                                           |
| `src/lib/shopify-session.ts`         | JWT verification for embedded API calls                                          |
| `src/lib/inbound.ts`                 | Fetches MIME from S3 + extracts shop ID from recipient                           |
| `src/proxy.ts`                       | Next.js middleware: rate limit, CSP, bypass for webhooks/auth/cron               |
| `src/app/api/auth/*`                 | OAuth start + callback (manual implementation)                                   |
| `src/app/api/webhooks/shopify`       | uninstall, GDPR, subscription updates                                            |
| `src/app/api/webhooks/inbound-email` | SNS subscription handler                                                         |
| `src/app/api/internal/*`             | Session-token-authed: usage, logs, settings, templates, SMTP test, billing/start |
| `src/app/api/billing/callback`       | Returned-to URL after merchant approves charge                                   |
| `src/app/api/cron/cleanup-logs`      | Plan-aware retention deletion                                                    |
| `src/app/(dashboard)/*`              | Embedded admin UI (Polaris)                                                      |
| `src/app/(public)/*`                 | Marketing site + legal pages                                                     |
| `aws/`                               | Pulumi: DynamoDB, SES inbound, IAM, Vercel env-var sync                          |
| `prisma/schema.prisma`               | Database schema                                                                  |

---

## Webhooks

### Shopify → Valyn (`/api/webhooks/shopify`)

HMAC-verified via `SHOPIFY_API_SECRET`. Dispatches on `X-Shopify-Topic`:

| Topic                      | Action                                                               |
| -------------------------- | -------------------------------------------------------------------- |
| `app/uninstalled`          | Mark `uninstalledAt`, set `subscriptionStatus = CANCELLED`           |
| `app_subscriptions/update` | Mirror status + period end onto the `Shop` row                       |
| `customers/data_request`   | Log a structured record (no PII export required by Shopify for this) |
| `customers/redact`         | Delete `EmailLog` rows for that customer email                       |
| `shop/redact`              | Cascade-delete the Shop + Settings + EmailLog + ReplyTemplate        |

The first two are registered via API at install. The three GDPR webhooks are
configured **once** in the Partners dashboard (Shopify fires them across all
shops automatically).

### AWS SES → Valyn (`/api/webhooks/inbound-email`)

SNS-signed. Validates the topic ARN, auto-confirms subscription on first
call, then fetches + parses the MIME blob from S3 and calls
`processInboundEmail`.

---

## Embedded UI (Shopify admin)

### `/dashboard`

- Usage card (used/quota progress bar, period reset date)
- Plan/subscription card (trial-ends or renewal)
- Onboarding checklist (hides when complete)
- 4 stat cards (total processed, WISMO detected, replies sent, retention days)
- Filterable email log: search, status, intent, date range
- Tabs: All / Needs review / Failed / Replied
- Per-row click → detail modal with full body, reply preview, actions (Retry, Approve, Mark misclassified)
- CSV export

### `/settings`

- Forwarding-address card with per-provider (Gmail / Outlook / Help Scout) instructions
- Auto-replies section: enable toggle, strictness, fallback behavior, response delay, language, tone (Pro), greeting, signature, support email
- Outgoing SMTP: host/port/TLS/user/pass/from, "Send test connection" button, last-verified badge

### `/templates` (Pro)

- Per-scenario editor (in_transit / processing / no_order / multiple)
- Placeholder docs: `{{orderName}}`, `{{carrier}}`, `{{tracking}}`
- Default selector per type — pipeline uses the marked default; falls back to built-in language pack if none

---

## Public site (`getvalyn.com`)

- `/` — hero with animated email demo, problem, how-it-works, features, dashboard preview, pricing teaser, security, FAQ teaser
- `/install` — focused OAuth landing: shop-domain form posting to `/api/auth`, "what happens next" steps, read-only scope disclosure
- `/pricing` — 2 tier cards, full comparison table, pricing FAQ
- `/features`, `/features/order-tracking-automation`, `/features/wismo-automation`, `/features/customer-support-automation`
- `/demo` — interactive 5-step stage (auto-play + manual)
- `/faq` — grouped Q&A with FAQPage JSON-LD
- `/gorgias-alternative`, `/aftership-alternative`, `/shopify-helpdesk-alternative`
- `/reduce-wismo-tickets-shopify`, `/shopify-order-tracking-automation`, `/shopify-customer-support-automation` (SEO landing)
- `/blog` + 4 long-form posts
- `/legal/{terms,privacy,cookies,gdpr,data-processing-agreement,security}`
- `/contact`

JSON-LD coverage: Organization + WebSite site-wide, SoftwareApplication on
homepage with both plan offers, FAQPage on `/faq`. Sitemap auto-includes all
non-redirect routes; robots.txt disallows dashboard / settings / api.

---

## Detection logic

`classifyInbound()` in `pipeline.ts`:

```
1. detect() keyword pass always computed (src/lib/wismo/detect.ts)
2. classifyWithLlm() runs on EVERY email — Bedrock, cheap model
   (Nova Lite default). Cost is trivial (<$0.30/mo at the Pro quota
   ceiling), so accuracy beats the old cost short-circuit.
3. LLM null (disabled / throttled / timeout / bad output) → keyword verdict
```

The LLM runs exactly once per message: the `EmailLog` row is written as an
idempotency claim (via `inboundMessageId @unique`) _before_ classification,
so an SNS redelivery can't re-trigger the call. SDK-internal retries are
capped at `maxAttempts: 2`.

The LLM only classifies intent — it never writes the reply (templates +
real Shopify data do that). Failure is never fatal: the keyword classifier
is always the fallback, so a Bedrock outage degrades precision, not uptime.

Keyword classifier / fallback (`src/lib/translations.ts` → `WISMO_KEYWORDS`):

- EN: `where is my order`, `tracking`, `delivery`, `shipped`, `shipping`
- FR: `où est ma commande`, `suivi`, `colis`, `livraison`, `commande`
- DE: `wo ist meine bestellung`, `sendungsverfolgung`, `lieferung`, `versand`
- Keyword confidence: `0.6 + 0.1 × unique_matches`, capped at 0.99. The LLM
  returns its own 0–1 confidence when consulted.

Bedrock config via `BEDROCK_MODEL_ID` / `BEDROCK_REGION` / `WISMO_LLM_ENABLED`
env (see Environment variables). Set `WISMO_LLM_ENABLED=false` to run
keyword-only. IAM: `bedrock:InvokeModel` granted to the app user in `aws/`.

Order extraction (`extractOrderName`): regex matches `#1234`, `order 1234`,
`commande 1234`. Minimum 3 digits to avoid matching prices.

---

## Reply composition

```
[greeting]                          ← merchant-controlled (Settings)
                                    ← blank line
[tone opening]                      ← from `applyTone()`
                                    ← blank line
[body]                              ← from template or built-in language pack
                                    ← blank line
[tone closing]                      ← from `applyTone()`
                                    ← blank line
[signature]                         ← merchant-controlled (Settings)
```

The body is selected by:

1. **Template type** chosen by order state: `IN_TRANSIT` (fulfilled or has
   tracking), `PROCESSING` (unfulfilled), `NO_ORDER` (no match), `MULTIPLE`
   (multiple recent matches).
2. **Source** — for Pro plans, the merchant's default template for that
   type; otherwise the built-in translation pack.
3. **Language** — the detected language of the inbound email (falls back to
   merchant's `Settings.language`, then English).

---

## Security posture

- **Shopify scopes**: minimum — `read_orders`, `read_fulfillments`, `read_customers`. No write scopes.
- **Session tokens**: HS256 JWT, verified manually (no library dependency). Checks `aud`, `iss`, `exp`, `nbf`, `iss`/`dest` host match, `*.myshopify.com` regex.
- **Webhook HMAC**: SHA-256 verified before any body parsing.
- **SMTP passwords**: AES-256-GCM at rest. `SMTP_CREDS_KEY` is 32 bytes base64.
- **Shopify access tokens**: stored server-side, never exposed to clients.
- **Idempotency**: `inboundMessageId @unique` prevents duplicate replies on SNS retries.
- **Rate limit**: per-IP DynamoDB sliding window on `/api/internal/*`.
- **CSP**: `frame-ancestors` set per-request to the merchant's shop + `admin.shopify.com` for embedded routes; public marketing pages are unconstrained.
- **GDPR**: all three mandatory webhooks implemented with real deletes. 30-day inbound MIME lifecycle on S3. 7d/90d EmailLog retention by plan, enforced by daily cron.

---

## Performance + scale

- Inbound pipeline runs synchronously inside the SNS HTTPS request. Spec target: <5s end-to-end. Vercel function timeout default 300s gives plenty of headroom.
- `responseDelaySeconds` capped at 60s in-process. Longer would need a queue — flagged in `task.md` as deferred work.
- Quota check is a single `count()` query per inbound email — fine until ~50k logs per shop, after which a `UsageRecord` materialization may be wise.
- Cleanup cron runs daily at 03:00 UTC; processes all shops sequentially.

---

## Environment variables

Required at runtime (synced from `.env` by Pulumi):

| Var                                                                             | Purpose                                                                                                                                        |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                                                                      | `production`                                                                                                                                   |
| `APP_URL`                                                                       | `https://getvalyn.com`                                                                                                                         |
| `SHOPIFY_API_KEY` / `SHOPIFY_API_SECRET` / `SHOPIFY_SCOPES` / `SHOPIFY_APP_URL` | Shopify app credentials                                                                                                                        |
| `DATABASE_URL`                                                                  | Postgres connection string                                                                                                                     |
| `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`                    | App's IAM credentials (created by Pulumi)                                                                                                      |
| `RATE_LIMITS_TABLE_NAME`                                                        | DynamoDB table (Pulumi output)                                                                                                                 |
| `INBOUND_EMAIL_BUCKET` / `INBOUND_EMAIL_DOMAIN` / `INBOUND_SNS_TOPIC_ARN`       | SES inbound (Pulumi outputs)                                                                                                                   |
| `SMTP_CREDS_KEY`                                                                | 32-byte base64 — encrypts merchants' SMTP passwords                                                                                            |
| `CRON_SECRET`                                                                   | Bearer token for manual cron invocation                                                                                                        |
| `BEDROCK_REGION` / `BEDROCK_MODEL_ID` / `WISMO_LLM_ENABLED`                     | AI WISMO classifier (defaults: us-east-1 / `us.amazon.nova-lite-v1:0` / true). Optional — keyword-only if disabled or model access not enabled |

Local-dev-only (filtered out before push to Vercel):

| Var                                    | Purpose                               |
| -------------------------------------- | ------------------------------------- |
| `VERCEL_TOKEN`                         | API token for Pulumi to push env vars |
| `VERCEL_PROJECT_ID` / `VERCEL_TEAM_ID` | Project identification                |

---

## Out of scope (by design)

Things Valyn is **not** trying to be:

- A helpdesk / ticketing system
- A live chat tool
- A returns / refunds automation tool
- An AI chatbot — AI classifies intent only; replies are templated, never generated
- An omnichannel inbox (no chat, SMS, social DMs)
- A marketing email tool

If a merchant needs any of these, they need a different tool. Valyn does
one job: read forwarded support emails, answer the WISMO ones, log
everything for review.

---

## Where to look when something breaks

| Symptom                                       | First place to look                                                                                                          |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Reply never sent                              | Vercel logs filter `wismo pipeline`, then `EmailLog.errorMessage` for the row                                                |
| OAuth fails                                   | `Allowed redirection URLs` in Partners + `SHOPIFY_API_KEY` env                                                               |
| Embedded admin shows "refused to connect"     | `proxy.ts` CSP frame-ancestors check                                                                                         |
| Cron didn't fire                              | Vercel → Crons tab                                                                                                           |
| SES inbound not arriving                      | `dig MX inbound.getvalyn.com`; SES domain identity verified?                                                                 |
| GDPR webhook 401                              | HMAC secret mismatch — confirm `SHOPIFY_API_SECRET` in Vercel                                                                |
| `SMTP not configured` on every send           | Merchant didn't fill Settings → SMTP, or test never ran                                                                      |
| `LIMIT_EXCEEDED` rows                         | Merchant on Starter; nudge to Pro via dashboard                                                                              |
| `MISCLASSIFIED` rate climbing                 | Check `EmailLog.detectionReason` (`ai:` vs keyword); tune the Bedrock prompt in `classify-llm.ts` or adjust `WISMO_KEYWORDS` |
| Bedrock errors in logs / `ai:` reasons absent | Model access not enabled for `BEDROCK_MODEL_ID` in that region — pipeline is silently keyword-only until fixed               |

For launch-time procedures, see [`LAUNCH.md`](./LAUNCH.md).
For deferred / post-launch work, see [`task.md`](./task.md).
