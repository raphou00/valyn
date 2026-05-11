# Shopify App Launch Tasks

Goal: make every feature promised on the public marketing pages available and working for merchants in the dashboard before first launch.

## Launch Baseline

- [ ] Verify `/dashboard` and `/settings` work inside Shopify embedded admin with valid `shop` and App Bridge session tokens.
- [ ] Add a merchant-facing onboarding checklist for: choose plan, configure SMTP, copy forwarding address, send test email, review first processed email.
- [ ] Add empty, loading, error, and success states for every dashboard workflow.
- [ ] Add automated tests for billing gates, settings updates, inbound processing, retry/manual review actions, and log exports.

## Starter Plan

Marketing promise: $19/month, 7-day trial, up to 500 processed emails/month, English WISMO detection, Shopify lookup and auto-reply, one reply template/basic signature, 7-day log retention, standard email support.

- [ ] Enforce the 500 processed emails/month quota before sending auto-replies.
- [ ] Show current monthly usage and remaining quota in the dashboard.
- [ ] Notify merchants when they are close to the Starter limit.
- [ ] Block or queue new auto-replies when the Starter limit is exceeded, with clear dashboard messaging.
- [ ] Restrict Starter detection/replies to English, or update marketing if all languages remain available.
- [ ] Implement one editable Starter reply template, not only greeting/signature.
- [ ] Implement 7-day email log retention for Starter.
- [ ] Add a visible plan/status area showing trial state, active plan, renewal date, and cancellation/upgrade path.
- [ ] Add standard support contact/help entry in the dashboard.

## Pro Plan

Marketing promise: $49/month, 7-day trial, up to 3,000 processed emails/month, EN/FR/DE detection, multiple templates, tone control, custom signatures, 90-day logs, one-click retry, pause automation, manual review mode, priority support.

- [ ] Enforce the 3,000 processed emails/month quota.
- [ ] Show current monthly usage and remaining Pro quota in the dashboard.
- [ ] Notify merchants when they are close to the Pro limit.
- [ ] Implement multiple reply templates.
- [ ] Let merchants choose which template is used for in-transit, processing, no-order-found, and multiple-order cases.
- [ ] Make tone control affect generated replies, or remove the claim.
- [ ] Support EN/FR/DE reply language per customer email, not only a single merchant-selected language.
- [ ] Implement 90-day email log retention for Pro.
- [ ] Add one-click retry for failed replies.
- [ ] Add manual review mode with a queue of emails waiting for merchant action.
- [ ] Add per-email actions: retry, skip, approve/send, mark reviewed, and view full email/reply preview.
- [ ] Add priority support contact/help entry in the dashboard.

## Shared Dashboard Features

- [ ] Add CSV export for email logs, including sender, subject, intent, status, order, error, received time, and reply time.
- [ ] Add filters/search for logs by status, intent, date range, sender, subject, and order name.
- [ ] Add full log detail view with inbound body, matched order data, reply preview, error details, and processing timestamps.
- [ ] Add visible audit history for every reply, skipped email, failed lookup, retry, and manual action.
- [ ] Add a real review state instead of using only `PENDING`, `IGNORED`, `FAILED`, and `REPLIED`.
- [ ] Add a dashboard control for fallback behavior: send fallback reply, queue for manual review, or skip.
- [ ] Add configurable detection strictness: auto-reply, queue for review, or pass through.
- [ ] Store and display detection confidence or reason, or remove confidence/false-positive claims from marketing.
- [ ] Add false-positive handling: retract/flag or mark misclassified, with stats surfaced in the dashboard.
- [ ] Make pause behavior match marketing: paused emails should be logged and reviewable, not silently ignored.
- [ ] Make response delay work in the inbound pipeline.
- [ ] Show SMTP health status and last successful/failed connection test.
- [ ] Add a safe test-email flow that lets merchants send a sample WISMO email and see the expected reply preview.
- [ ] Add log retention cleanup jobs and make retention plan-aware.
- [ ] Add data export/delete workflows for merchant support and privacy requests.

## Backend And Data Model

- [ ] Add fields for plan usage accounting by billing period.
- [ ] Add fields for template configuration and template type.
- [ ] Add fields for review status, retry count, last retry time, and reviewed time.
- [ ] Add fields for detection confidence/reason and detected language.
- [ ] Add fields for generated reply preview/body so merchants can review exactly what was sent.
- [ ] Add a background job or queue for response delay, retries, and manual approval sends.
- [ ] Add quota checks in `processInboundEmail` before sending.
- [ ] Add retention cleanup for raw inbound email and database logs.
- [ ] Add operational monitoring for inbound SNS failures, Shopify lookup failures, SMTP failures, and quota blocks.

## Marketing Alignment Before Launch

- [ ] Re-check every public page claim against the implemented dashboard.
- [ ] Downgrade or remove any claim that is not fully implemented at launch.
- [ ] Keep pricing table, feature pages, FAQ, and homepage plan details consistent with actual Starter/Pro behavior.
- [ ] Add screenshots or demo content only after the dashboard flows are implemented.
