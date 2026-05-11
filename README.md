# Valyn

Embedded Shopify app that detects "Where is my order?" emails forwarded by
the merchant and replies automatically using Shopify order/tracking data.

Stack: Next.js 16 (App Router), Prisma + Postgres, Shopify Admin GraphQL,
Polaris + App Bridge v4, AWS SES inbound + S3 + SNS, nodemailer (per-shop
SMTP), Pulumi + Vercel for deploy.

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
- `aws/` — Pulumi: DynamoDB rate-limit, SES inbound (S3 + SNS + MX), IAM

---

## Deploy

One-time setup outside Pulumi:

1. Create the Shopify app in the Partners dashboard. Note the API key,
   API secret, and set the App URL + redirect URL to your production
   `APP_URL`.
2. Provision a Postgres (Vercel Postgres, Neon, Supabase, etc.) — copy
   the connection URL.
3. Verify the apex domain in Route53 and confirm Pulumi can read its
   hosted zone.
4. Generate the SMTP-credentials encryption key once:
   `openssl rand -base64 32`
5. Create the Vercel project (import this repo from GitHub).
6. Fill in `.env` with everything: Shopify keys, DATABASE_URL,
   SMTP_CREDS_KEY.
7. `cd aws && pulumi config set aws:region us-east-1` (and adjust
   `inbound:domain`, `inbound:zoneName`, `inbound:webhookUrl`).
8. `bun run deploy` — Pulumi provisions AWS and prints the resulting
   outputs (IAM access keys, table names, bucket, SNS topic, inbound
   domain).
9. Set the app env vars in Vercel (Project → Settings → Environment
   Variables): everything from `.env` plus the AWS outputs from step 8
   (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`,
   `RATE_LIMITS_TABLE_NAME`, `INBOUND_EMAIL_BUCKET`,
   `INBOUND_EMAIL_DOMAIN`, `INBOUND_SNS_TOPIC_ARN`).
10. Push `main` — Vercel auto-deploys.

---

## Shopify App Store submission checklist

### Partners dashboard configuration

- [ ] **App URL**: `https://getvalyn.com/` (root — proxy auto-redirects
      to `/dashboard` when `?shop=...` is present).
- [ ] **Allowed redirection URLs**: `https://getvalyn.com/api/auth/callback`.
- [ ] **Privacy policy URL**: `https://getvalyn.com/legal/privacy`.
- [ ] **Terms of service URL**: `https://getvalyn.com/legal/terms`.
- [ ] **Support contact**: `support@getvalyn.com`.
- [ ] **Mandatory compliance webhooks** (App setup → Privacy):
      `https://getvalyn.com/api/webhooks/shopify` for all three:
      `customers/data_request`, `customers/redact`, `shop/redact`.
      The endpoint dispatches by `X-Shopify-Topic` header.
- [ ] **Embedded app**: enabled.
- [ ] **App proxy**: leave unconfigured (we don't use one).
- [ ] **Distribution → Public Distribution** (or **Custom Distribution**
      for soft-launch with a select set of merchants).

### Listing assets

- [ ] App icon 1200×1200 PNG.
- [ ] Feature media (banner) 1600×900.
- [ ] 3–7 screenshots of the embedded admin (Dashboard with stats +
      email log, Settings with forwarding instructions, Billing banner,
      SMTP test result).
- [ ] Tagline ≤100 chars.
- [ ] Description ≤500 chars.
- [ ] Pricing in the listing must match `src/config/billing.ts`
      (currently Starter $19/mo and Pro $49/mo USD, 7-day trial).

### Pre-submission smoke test

- [ ] Install on a fresh dev store via
      `https://getvalyn.com/api/auth?shop=<store>.myshopify.com`.
- [ ] Subscribe via the in-app billing banner (test charge mode is
      automatic in non-production; merchants are not actually billed).
- [ ] Configure SMTP (Gmail app password works fastest) and click
      **Send test connection** — should be green.
- [ ] Forward a "where is my order #1234" email from an external address
      to your `inboundAddress` and confirm a reply arrives within ~5s
      and a row appears in the Email log.
- [ ] Uninstall and confirm the row's `uninstalledAt` is set.
- [ ] Wait 48h, confirm `shop/redact` cleared the data (or simulate
      with `curl` + a hand-signed HMAC — see README earlier section).

### AWS production access

- [ ] **Request SES production access** in the AWS console (sandbox
      limits inbound to verified addresses).
      _Outbound_ SES is not used — replies go via merchant SMTP — but
      you still need production for inbound to accept mail from any
      sender.
- [ ] Verify `inbound.getvalyn.com` MX records resolve to
      `inbound-smtp.us-east-1.amazonaws.com` (Pulumi creates these
      automatically; confirm with `dig MX inbound.getvalyn.com`).

### Submit

- [ ] Submit via Partners dashboard → Apps → Distribution → submit for
      review. Expect 1–2 review rounds, ~2–3 weeks turnaround.

---

## Operational notes

- Logs are JSON to stdout (`src/lib/logger.ts`). Vercel's log drain can
  filter by `msg`, `shopId`, `level`.
- Inbound MIME files live in S3 for 30 days then auto-expire.
- The WISMO pipeline waits synchronously inside the SNS HTTP request.
  If average latency exceeds ~10s under load, move to a queue
  (EventBridge or SQS).
