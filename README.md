# Valyn

Embedded Shopify app that detects "Where is my order?" emails forwarded by
the merchant and replies automatically using Shopify order/tracking data.

Stack: Next.js 16 (App Router), Prisma + Postgres, Shopify Admin GraphQL,
Polaris + App Bridge v4, AWS SES inbound + S3 + SNS, nodemailer (per-shop
SMTP), Pulumi + Render for deploy.

---

## Local development

```bash
bun install
cp .example.env .env  # fill in real values
bun db:push           # apply Prisma schema to your local Postgres
bun dev
```

Shopify won't talk to `localhost`. Use a tunnel:

```bash
cloudflared tunnel --url http://localhost:3000
# or `ngrok http 3000`
```

Set `APP_URL` and `SHOPIFY_APP_URL` in `.env` to the public tunnel URL.
Update the Partners-dashboard **App URL** and **Allowed redirection URLs**
to match.

Install on a dev store:
`https://<tunnel>/api/auth?shop=<store>.myshopify.com`

---

## Architecture

- `src/app/(dashboard)` — embedded admin (Polaris), session-token-authed
- `src/app/(public)` — privacy + terms (server-rendered, indexable)
- `src/app/api/auth*` — Shopify OAuth (manual implementation)
- `src/app/api/webhooks/shopify` — uninstall + GDPR + subscription updates
- `src/app/api/webhooks/inbound-email` — SNS subscription handler that
  fetches MIME from S3, parses, and runs the WISMO pipeline
- `src/app/api/internal/*` — embedded UI's session-token-authed APIs
- `src/lib/wismo/pipeline.ts` — detect → identify order → reply → log
- `aws/` — Pulumi: DynamoDB rate-limit, SES inbound (S3 + SNS + MX),
  IAM, Render env-var sync

---

## Deploy

One-time setup outside Pulumi:

1. Create the Shopify app in the Partners dashboard. Note the API key,
   API secret, and set the App URL + redirect URL to your production
   `APP_URL`.
2. Provision a Postgres on Render (or anywhere) — copy the connection URL.
3. Verify the apex domain in Route53 (or wherever) and confirm Pulumi can
   read its hosted zone.
4. Generate the SMTP-credentials encryption key once:
   `openssl rand -base64 32`
5. Create the Render web service from `render.yaml`
   (Render dashboard → Blueprints → connect repo). Copy the service id.
6. Get a Render API key.
7. Fill in `.env` (Shopify keys, DATABASE_URL, SMTP_CREDS_KEY,
   RENDER_API_KEY, RENDER_SERVICE_ID).
8. `cd aws && pulumi config set aws:region us-east-1` (and adjust
   `inbound:domain`, `inbound:zoneName`, `inbound:webhookUrl`).
9. `bun run deploy` — Pulumi provisions AWS, syncs env vars to Render.
10. Push `main` — Render auto-deploys.

The `.env` is the source of truth for secrets; Pulumi reads it via dotenv.

---

## Shopify App Store submission checklist

- [ ] Replace `REPLACE_*` markers in `src/app/(public)/privacy/page.tsx`
      and `src/app/(public)/terms/page.tsx`. Have counsel review.
- [ ] Set Privacy Policy URL = `https://<APP_URL>/privacy` in Partners
      dashboard.
- [ ] Set Terms of Service URL = `https://<APP_URL>/terms`.
- [ ] Set support email + URL.
- [ ] Confirm GDPR webhook endpoints in Partners dashboard
      (`/api/webhooks/shopify` for all three).
- [ ] Upload listing assets:
    - app icon 1200×1200
    - feature media (banner) 1600×900
    - 3–7 screenshots of the embedded admin (Dashboard, Settings,
      forwarding instructions, billing banner)
- [ ] Tagline (≤100 chars) and description (≤500 chars).
- [ ] Pricing in the listing must match `src/config/billing.ts`
      (currently $19/mo, 14-day trial).
- [ ] Test the full install → subscribe → forward email → reply flow
      on a fresh dev store.
- [ ] Request SES production access in the AWS console (sandbox limits
      inbound to verified addresses; outbound is unaffected since we use
      merchant SMTP).
- [ ] Submit via Partners dashboard → Apps → Distribution.

Expect 1–2 review rounds, ~2–3 weeks turnaround.

---

## Operational notes

- Logs are JSON to stdout (`src/lib/logger.ts`). Render's log search can
  filter by `msg`, `shopId`, `level`.
- Inbound MIME files live in S3 for 30 days then auto-expire.
- `pulumi up` PUTs the _complete_ env-var set to Render — anything not in
  `aws/render/env-sync.ts` gets removed. Add new vars there, never via
  the Render dashboard.
- The WISMO pipeline waits synchronously inside the SNS HTTP request.
  If average latency exceeds ~10s under load, move to a queue
  (EventBridge or SQS).
