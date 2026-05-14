# Valyn

Embedded Shopify app that auto-replies to "Where is my order?" customer
emails using real order and tracking data, sent from the merchant's own
SMTP. Two plans (Starter $19/mo, Pro $49/mo), 7-day free trial.

🌐 **[getvalyn.com](https://getvalyn.com)**

---

## Documentation

| File                       | When to read it                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`app.md`](./app.md)       | What Valyn does and how it works — architecture, data model, decision flow, security posture                                       |
| [`LAUNCH.md`](./LAUNCH.md) | Step-by-step playbook to ship the first public version — AWS, Vercel, Shopify Partners, dev-store smoke test, App Store submission |
| [`task.md`](./task.md)     | Post-launch backlog — what's deferred and why                                                                                      |

---

## Stack

- Next.js 16 (App Router) on Vercel
- Prisma + Postgres
- Shopify Admin GraphQL, Polaris + App Bridge v4
- AWS SES inbound + S3 + SNS for email intake
- nodemailer + per-shop SMTP for outbound
- DynamoDB rate-limiter
- Pulumi → AWS, with `.env` auto-sync to Vercel

---

## Local development

```bash
bun install
cp .example.env .env             # fill in real values
bun db:push                      # apply Prisma schema to local Postgres
bun dev
```

Shopify won't talk to `localhost`. Use a tunnel:

```bash
cloudflared tunnel --url http://localhost:3000
# or `ngrok http 3000`
```

Set `APP_URL` and `SHOPIFY_APP_URL` in `.env` to the tunnel URL. Update the
Partners-dashboard **App URL** and **Allowed redirection URLs** to match.

Install on a dev store via either:

```
https://<tunnel>/install                      # public-facing install page
https://<tunnel>/api/auth?shop=<store>.myshopify.com   # direct OAuth start
```

---

## Common commands

```bash
bun dev                          # Next.js dev server
bun run type-check               # tsc --noEmit
bun run test                     # vitest run (38 tests)
bun run test:watch               # vitest watch mode
bun run build                    # production build (prisma generate + next build)
bun run lint                     # eslint
bun run fmt:write                # prettier --write
bun db:push                      # apply schema changes
bun db:studio                    # prisma studio
cd aws && pulumi up              # provision AWS + sync env vars to Vercel
```

A pre-commit hook (Husky + lint-staged) runs prettier + eslint on staged
files, then full `type-check` and `test`. Bypass with `--no-verify` only
if you know what you're doing.

---

## Repo map

```
src/
├─ app/
│  ├─ (public)/        — marketing site (getvalyn.com)
│  ├─ (dashboard)/     — embedded admin (inside Shopify)
│  ├─ api/
│  │  ├─ auth/         — Shopify OAuth
│  │  ├─ billing/      — subscription callback
│  │  ├─ cron/         — Vercel cron jobs
│  │  ├─ internal/     — session-token-authed APIs
│  │  └─ webhooks/     — Shopify + SES SNS
│  └─ layout.tsx, sitemap.ts, robots.ts, opengraph-image.tsx
├─ lib/
│  ├─ wismo/           — detection, pipeline, Shopify Admin, tone
│  ├─ shopify-session.ts, shopify-domain.ts, billing.ts
│  ├─ usage.ts, plan-features.ts
│  ├─ email.ts, crypto.ts, inbound.ts
│  └─ db.ts, env.ts, rate-limiter.ts, logger.ts
├─ components/emails/  — react-email templates
└─ proxy.ts            — Next.js middleware (rate limit, CSP)

aws/                   — Pulumi (DynamoDB, SES inbound, IAM, Vercel env sync)
prisma/                — schema.prisma + seed
```

See [`app.md`](./app.md#key-code-locations) for a file-by-file
responsibility table.
