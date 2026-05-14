# Valyn — Onboarding Simplification Spec

Goal: a non-technical merchant (e.g. a Shopify store owner who uses Gmail for support)
can go from install to first auto-reply without needing to know what SMTP, TLS, or a
port number is.

---

## 1. First-run wizard (replaces cold settings page)

On first install, instead of dropping the merchant on the settings page, show a
3-step wizard that covers the two hard parts: outgoing email + forwarding.

### Step 1 — "How do you send support emails?"

Show three big buttons:

- **Gmail** (personal or Google Workspace)
- **Outlook / Microsoft 365**
- **Something else**

Selecting Gmail or Outlook pre-fills all SMTP fields silently in the background.
The merchant never sees host, port, or TLS.

| Provider       | Host                  | Port | TLS  |
| -------------- | --------------------- | ---- | ---- |
| Gmail          | smtp.gmail.com        | 465  | true |
| Outlook / M365 | smtp-mail.outlook.com | 587  | true |

### Step 2 — "Enter your email credentials"

For Gmail and Outlook, show only two fields:

- **Your support email address** (e.g. support@yourstore.com)
- **App password** — with a collapsible "What is this?" that explains:

> Gmail and Outlook don't let apps use your regular password for security reasons.
> You need to create a one-time "app password" — it takes about 30 seconds.

Include inline step-by-step instructions per provider (same style as the forwarding
address card already has):

**Gmail app password:**

1. Go to myaccount.google.com → Security → 2-Step Verification → App passwords
2. Select "Mail" and your device, click Generate
3. Copy the 16-character password and paste it above

**Outlook app password:**

1. Go to account.microsoft.com → Security → Advanced security options → App passwords
2. Click Create a new app password
3. Copy and paste it above

After they paste the password, auto-run the SMTP test silently. Show a green
checkmark or a simple error message — not technical error details.

For "Something else": show the full current SMTP form (host, port, TLS, etc.)
unchanged. These users know what they're doing.

### Step 3 — "Forward your support inbox"

Same as the current forwarding address card, already good. No changes needed here.

---

## 2. SMTP section redesign (for returning merchants)

In Settings → Outgoing email, add provider tabs above the form fields (same
pattern as the forwarding address card):

**Gmail | Outlook | Other**

- Selecting Gmail or Outlook hides the technical fields (host, port, TLS) and
  shows only Email + App password
- Selecting Other shows the full form as today
- Provider selection is persisted so returning merchants don't re-enter it

The "Send test connection" button becomes "Test & save" — runs the test, and if it
passes, saves in one action.

---

## 3. Error messages — plain language

Replace nodemailer/SMTP error strings with human-readable messages:

| Raw error             | Show instead                                                                   |
| --------------------- | ------------------------------------------------------------------------------ |
| `ECONNREFUSED`        | "Couldn't connect to your mail server. Check your host and port."              |
| `EAUTH` / `535`       | "Wrong email or password. Double-check your app password."                     |
| `ETIMEDOUT`           | "Connection timed out. Your mail server may be blocking the connection."       |
| `CERT_HAS_EXPIRED`    | "Your mail server has an SSL issue. Try turning off TLS or contact your host." |
| `smtp not configured` | "You haven't set up outgoing email yet. Go to Settings → Outgoing email."      |

Catch these in the SMTP test handler and in `sendReplyForLog()` before writing
to `EmailLog.errorMessage`.

---

## 4. Onboarding checklist improvements

The dashboard already has an onboarding checklist. Make each incomplete item
actionable with a single CTA:

| Item                    | CTA                                                     |
| ----------------------- | ------------------------------------------------------- |
| SMTP not configured     | "Set up email →" (opens wizard at step 1)               |
| Forwarding not set up   | "Get forwarding address →" (scrolls to forwarding card) |
| No emails processed yet | "Send a test email →" (shows test email instructions)   |

---

## 5. "Send a test" feature (optional but high value)

Add a **Send test email** button in the dashboard or onboarding checklist.

When clicked:

- Valyn sends a fake WISMO email directly into the pipeline for this shop
  (bypasses SES, calls `processInboundEmail()` directly with synthetic data)
- Uses a real order from the shop (fetches the most recent one via Shopify Admin)
- Shows the result inline: the reply that would have been sent, with order name
  and tracking filled in

This lets the merchant see the product working in 10 seconds without needing to
set up email forwarding first. High confidence builder before they commit to
changing their inbox rules.

---

## 6. What NOT to change

- The forwarding address card is already well done — provider tabs, copy button,
  per-provider instructions. Keep it as-is.
- The email log, dashboard stats, and template editor are for merchants who are
  already set up. No simplification needed there.
- Don't add OAuth (Gmail API / Microsoft Graph) for sending — significant
  engineering effort for marginal gain over app passwords. Defer to task.md.
