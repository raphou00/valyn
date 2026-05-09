# Valyn – Shopify App Specification

## Overview

**Valyn** is a Shopify app that automatically handles “Where is my order?” (WISMO) customer support requests.

It connects to a Shopify store, monitors incoming customer emails, detects tracking-related requests, retrieves order and fulfillment data from Shopify, and sends accurate automated replies.

The goal is to reduce repetitive support workload for merchants.

---

## Core Value Proposition

- Reduce repetitive support tickets (WISMO)
- Save time for merchants
- Provide instant responses to customers
- Improve customer experience

---

## Target Users

- Shopify merchants (small to mid-size)
- Dropshipping stores
- Stores with high order volume and email-based support

---

## Core Features (V1)

### 1. Shopify Store Connection

- Merchant installs the app
- OAuth flow grants access to:
    - Orders
    - Fulfillments
    - Customers
- Store data is securely stored and linked to the app

---

### 2. Email Intake System

- Merchant configures a support email (e.g. support@store.com)
- Emails are forwarded or received by the app
- Each incoming email is processed

Stored data:

- sender email
- subject
- body
- timestamp

---

### 3. WISMO Detection Engine

Detect if an email is related to order tracking.

Initial implementation:

- keyword-based detection:
    - "where is my order"
    - "tracking"
    - "commande"
    - "colis"
    - "delivery"
    - "livraison"

Output:

- `intent = WISMO` or `intent = OTHER`

---

### 4. Order Identification

System attempts to identify the order using:

Priority:

1. Order number in email (e.g. #1234)
2. Customer email match
3. Recent orders for that customer

Edge cases:

- multiple orders → select most recent
- no match → fallback response

---

### 5. Shopify Data Retrieval

For identified order:

Retrieve:

- order status
- fulfillment status
- tracking number
- carrier
- tracking URL
- estimated delivery (if available)

---

### 6. Automated Response System

Generate and send response to customer.

Template example:

> Hello,
> Your order #1234 is currently in transit.
> Carrier: DHL
> Tracking: [link]
> Expected delivery: 2–3 days
>
> Thank you for your patience.

---

### 7. Logging System

Each processed email is logged:

- intent detected
- order found / not found
- response sent
- timestamp

---

## Admin Dashboard (Shopify Embedded App)

### Main View

Display:

- Total emails processed
- WISMO detected
- Auto-replies sent
- Failed lookups

---

### Email Log Table

Columns:

- Customer email
- Intent
- Order ID
- Status (replied / failed / ignored)
- Timestamp

---

### Controls

- Enable / disable automation
- Manual override toggle
- Retry failed responses

---

## Settings Page

### General Settings

- Enable/disable auto-replies
- Response delay (instant / X minutes)
- Language selection (EN / FR / DE)

---

### Response Customization

- Greeting message
- Signature
- Tone:
    - neutral
    - friendly
    - formal

---

### Email Configuration

- Support email address
- Forwarding instructions

---

## Edge Cases Handling

### No Order Found

Response:

> We couldn’t find your order.
> Please reply with your order number.

---

### No Tracking Available

Response:

> Your order is being processed and will ship soon.

---

### Multiple Orders

- Select most recent
- Optionally mention it in response

---

### Non-WISMO Email

- Do nothing
- Or mark as "manual handling required"

---

## Future Features (Not in V1)

- Returns automation
- Refund status
- Multi-channel (chat, WhatsApp, Instagram)
- AI-based classification
- Customer self-service portal
- Shopify App Store listing
- Analytics (response time, ticket reduction)

---

## Security & Permissions

- Read-only access to Shopify orders
- Secure storage of tokens
- No modification of store data

---

## Performance Goals

- Email processed < 5 seconds
- Response accuracy > 90%
- Minimal false positives

---

## Success Metrics

- % of WISMO emails automated
- Time saved per merchant
- Reduction in support workload
- Merchant retention

---

## Positioning

> “The simplest way to automate order tracking support for Shopify stores.”

---

## Scope Discipline

**Strict rule for V1:**

- Only solve WISMO
- No extra features
- No over-engineering

---

End of specification.
