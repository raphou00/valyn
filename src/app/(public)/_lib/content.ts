import type { ListingItem, TextSection } from "../_components/content-page";

export const featureItems: ListingItem[] = [
    {
        title: "Order tracking automation",
        description:
            "Detect tracking requests, find the Shopify order, and return clear status or tracking details.",
        href: "/features/order-tracking-automation",
        badge: "Tracking",
    },
    {
        title: "WISMO automation",
        description:
            "Reduce repetitive Where is my order emails without turning your support process into a chatbot.",
        href: "/features/wismo-automation",
        badge: "WISMO",
    },
    {
        title: "Customer support automation",
        description:
            "Automate the highest-volume repetitive questions while keeping manual control for exceptions.",
        href: "/features/customer-support-automation",
        badge: "Support",
    },
];

export const featureSections: Record<string, TextSection[]> = {
    orderTracking: [
        {
            title: "Why order tracking support becomes repetitive",
            paragraphs: [
                "Shopify merchants often answer the same tracking question many times a day. The customer expects a specific answer, but the support team still has to open Shopify, search for the order, check fulfillment, and write a reply.",
                "Valyn turns that routine into a controlled workflow for incoming email.",
            ],
        },
        {
            title: "How Valyn identifies the customer order",
            paragraphs: [
                "Valyn first looks for an order number in the email subject or body. If no order number is present, it searches Shopify orders by the sender email and uses the most recent matching order.",
            ],
            bullets: [
                "Order number lookup for messages like order #1042.",
                "Customer email lookup when the customer does not include a number.",
                "Recent order selection when several orders match the same email.",
            ],
        },
        {
            title: "How Valyn generates a reply",
            paragraphs: [
                "When tracking details are available, Valyn replies with the order name, carrier, and tracking link or number. When tracking is not available yet, the reply tells the customer that the order is still being processed.",
            ],
        },
        {
            title: "What happens when tracking is unavailable",
            paragraphs: [
                "Valyn uses fallback responses instead of inventing details. If an order cannot be found, the customer is asked to reply with an order number so a human can resolve the request.",
            ],
        },
        {
            title: "Why this is simpler than a full helpdesk",
            paragraphs: [
                "Valyn is focused on the order-support workload that repeats every day. It does not replace your helpdesk, inbox, or support team. It removes the repetitive tracking replies that are easy to standardize.",
            ],
        },
    ],
    wismo: [
        {
            title: "What WISMO means",
            paragraphs: [
                "WISMO means Where is my order. It is one of the most common post-purchase support questions for Shopify stores.",
            ],
        },
        {
            title: "Why WISMO hurts support teams",
            paragraphs: [
                "Each WISMO ticket is usually simple, but the volume adds up. A support rep still needs to search for the order, inspect fulfillment, copy a tracking link, and respond quickly enough to avoid customer frustration.",
            ],
        },
        {
            title: "How Valyn detects WISMO emails",
            paragraphs: [
                "Valyn checks customer email subject lines and bodies for order-tracking language across English, French, and German. Messages that do not look like order support are ignored and logged.",
            ],
        },
        {
            title: "How Valyn replies automatically",
            paragraphs: [
                "After detection, Valyn looks up the Shopify order and sends a merchant-approved response through the merchant's SMTP account. Customers see the store's sender address, not a generic third-party address.",
            ],
        },
        {
            title: "When Valyn escalates instead of replying",
            paragraphs: [
                "If the order cannot be found, SMTP is not configured, automation is disabled, or the subscription is inactive, Valyn records the outcome instead of sending an unsafe response.",
            ],
        },
    ],
    customerSupport: [
        {
            title: "Automate repetitive questions",
            paragraphs: [
                "The first version of Valyn focuses on order tracking questions because they are common, structured, and answerable from Shopify order data.",
            ],
        },
        {
            title: "Keep merchants in control",
            paragraphs: [
                "Merchants can enable or pause automation, set the reply language, edit greeting and signature text, and test outgoing SMTP settings before relying on automated replies.",
            ],
        },
        {
            title: "Avoid overcomplicated helpdesk software",
            paragraphs: [
                "Valyn is useful when the problem is repetitive order support, not when a team needs a full omnichannel helpdesk with agent assignment, macros, live chat, and SLA routing.",
            ],
        },
        {
            title: "Start with order tracking, expand later",
            paragraphs: [
                "Order support is the practical starting point. It gives merchants measurable support relief without broad claims or risky generic automation.",
            ],
        },
    ],
};

export const faqItems = [
    {
        question: "What does Valyn do?",
        answer: "Valyn automates repetitive Shopify support emails, starting with order tracking requests.",
    },
    {
        question: "Does Valyn replace my helpdesk?",
        answer: "No. Valyn is focused on repetitive order support. It is not a full helpdesk.",
    },
    {
        question: "Does Valyn modify my Shopify store?",
        answer: "No. The first version reads only the order-related data needed to answer customer questions.",
    },
    {
        question: "What happens if Valyn cannot find an order?",
        answer: "Valyn sends a fallback reply or marks the message for manual review depending on your setup.",
    },
    {
        question: "Can I disable automation?",
        answer: "Yes. Merchants can pause automation at any time.",
    },
    {
        question: "Does Valyn support multiple languages?",
        answer: "The product is built around English, French, and German reply templates.",
    },
    {
        question: "Is customer data secure?",
        answer: "Valyn uses limited Shopify permissions, encrypted SMTP credentials, structured logging, and data minimization.",
    },
    {
        question: "Is Valyn useful for dropshipping stores?",
        answer: "Yes, especially stores receiving many repetitive tracking questions from customers.",
    },
];

export const seoPages: Record<
    string,
    { title: string; description: string; sections: TextSection[] }
> = {
    orderTracking: {
        title: "Shopify order tracking automation",
        description:
            "Automate Shopify tracking email replies with order data, fulfillment status, and merchant-controlled templates.",
        sections: [
            {
                title: "Why Shopify merchants need order tracking automation",
                paragraphs: [
                    "Tracking requests are predictable but time-consuming. Customers want to know whether the order shipped, which carrier has it, and where they can follow delivery.",
                ],
            },
            {
                title: "How order tracking emails create repetitive support",
                paragraphs: [
                    "Without automation, every tracking email creates the same manual loop: open Shopify, search for the order, check fulfillment, find the tracking link, and write a reply.",
                ],
            },
            {
                title: "How Valyn automates tracking replies",
                paragraphs: [
                    "Valyn receives forwarded support emails, detects order-support language, matches the Shopify order, and sends a response through the merchant's configured SMTP account.",
                ],
            },
            {
                title: "When Valyn should escalate to manual support",
                paragraphs: [
                    "Valyn should not guess when the order is unclear or the request is not about tracking. Those cases are logged so the merchant can handle them manually.",
                ],
            },
            {
                title: "FAQ",
                bullets: [
                    "Valyn is focused on order support, not full helpdesk replacement.",
                    "Automated replies use Shopify order data and merchant-approved text.",
                    "Merchants can pause automation whenever they need to.",
                ],
            },
        ],
    },
    reduceWismo: {
        title: "Reduce WISMO tickets for your Shopify store",
        description:
            "Reduce Where is my order support tickets with focused Shopify order support automation.",
        sections: [
            {
                title: "What WISMO means",
                paragraphs: [
                    "WISMO means Where is my order. It describes customer messages asking about order status, shipment progress, tracking links, or delivery timing.",
                ],
            },
            {
                title: "Why customers ask WISMO questions",
                paragraphs: [
                    "Customers ask when shipping updates are unclear, tracking links are hard to find, or delivery expectations are not visible after checkout.",
                ],
            },
            {
                title: "How WISMO affects support workload",
                paragraphs: [
                    "A single WISMO reply is simple. Hundreds of them per month create a support workload that distracts from higher-value customer conversations.",
                ],
            },
            {
                title: "How automation reduces WISMO tickets",
                paragraphs: [
                    "Automation answers the repetitive cases quickly and consistently while leaving ambiguous requests for manual handling.",
                ],
            },
            {
                title: "How Valyn handles WISMO",
                paragraphs: [
                    "Valyn detects WISMO emails, looks up the customer order in Shopify, replies with tracking details when available, and records the result in a merchant dashboard.",
                ],
            },
        ],
    },
    customerSupport: {
        title: "Shopify customer support automation",
        description:
            "Automate repetitive Shopify order support without adopting a broad helpdesk platform.",
        sections: [
            {
                title: "Start with the questions that repeat",
                paragraphs: [
                    "Order tracking requests are a practical first automation target because the information usually exists in Shopify and the reply can be standardized.",
                ],
            },
            {
                title: "Use Shopify order data",
                paragraphs: [
                    "Valyn uses Shopify order and fulfillment data to answer customer questions with status and tracking information.",
                ],
            },
            {
                title: "Keep support quality controlled",
                paragraphs: [
                    "The merchant controls automation, language, greeting, signature, and SMTP setup. Valyn logs replies so the team can review what happened.",
                ],
            },
            {
                title: "Avoid generic automation claims",
                paragraphs: [
                    "Valyn does not position itself as a generic chatbot. It solves one specific support problem: repetitive Shopify order tracking email replies.",
                ],
            },
        ],
    },
};

export const comparisonPages: Record<
    string,
    { title: string; description: string; sections: TextSection[] }
> = {
    gorgias: {
        title: "A simple Gorgias alternative for Shopify order support",
        description:
            "Valyn is not a full helpdesk. It is a focused automation tool for repetitive Shopify order tracking support.",
        sections: [
            {
                title: "Gorgias is powerful but broader",
                paragraphs: [
                    "Gorgias is built for full helpdesk workflows across many channels. That breadth is useful for larger support teams, but it can be more than a merchant needs for simple WISMO automation.",
                ],
            },
            {
                title: "Valyn is focused on WISMO and order support",
                paragraphs: [
                    "Valyn focuses on incoming email, Shopify order lookup, automated tracking replies, and logs for merchant review.",
                ],
            },
            {
                title: "When to choose Valyn",
                bullets: [
                    "You mainly need to reduce repetitive order tracking emails.",
                    "You want setup around Shopify order data and SMTP.",
                    "You do not need agent assignment, chat, or broad helpdesk tooling.",
                ],
            },
            {
                title: "When to choose a full helpdesk",
                bullets: [
                    "You need omnichannel support workflows.",
                    "You manage a larger agent team with assignment rules.",
                    "You need broad customer service reporting beyond order tracking.",
                ],
            },
        ],
    },
    aftership: {
        title: "A focused AfterShip alternative for Shopify support automation",
        description:
            "Valyn focuses on automated support replies for order questions, not only tracking pages.",
        sections: [
            {
                title: "Tracking pages vs support automation",
                paragraphs: [
                    "Tracking pages help customers self-serve, but many customers still email support. Valyn focuses on answering those emails automatically.",
                ],
            },
            {
                title: "Automated email replies",
                paragraphs: [
                    "Valyn receives forwarded customer emails, detects tracking requests, and replies using Shopify order data and merchant-approved templates.",
                ],
            },
            {
                title: "Shopify order lookup",
                paragraphs: [
                    "The product looks for order numbers and customer email matches to find the right Shopify order before generating a reply.",
                ],
            },
            {
                title: "Simpler setup for order-support use cases",
                paragraphs: [
                    "Merchants that primarily need fewer WISMO emails can start with focused automation instead of adopting a broader tracking suite.",
                ],
            },
        ],
    },
    helpdesk: {
        title: "A simple Shopify helpdesk alternative for order support",
        description:
            "Use Valyn when you need focused order-support automation rather than a full helpdesk system.",
        sections: [
            {
                title: "Helpdesks solve many workflows",
                paragraphs: [
                    "A helpdesk is the right choice for multi-agent teams, ticket routing, live chat, macros, SLA reporting, and broad customer service operations.",
                ],
            },
            {
                title: "Valyn solves one painful workflow",
                paragraphs: [
                    "Valyn is built to reduce repetitive order tracking emails for Shopify merchants. It detects the request, finds the order, replies, and logs the result.",
                ],
            },
            {
                title: "When focused automation is enough",
                bullets: [
                    "Your support volume is dominated by tracking questions.",
                    "You already have an inbox or simple support process.",
                    "You want to avoid a broad migration before solving WISMO.",
                ],
            },
            {
                title: "When to add a helpdesk",
                bullets: [
                    "You need multiple agents working from shared queues.",
                    "You need live chat and social channel support.",
                    "You need ticket assignment, tags, and SLA reporting.",
                ],
            },
        ],
    },
};

export const blogPosts: (ListingItem & {
    date: string;
    sections: TextSection[];
})[] = [
    {
        title: "What Is WISMO in eCommerce?",
        description:
            "A practical explanation of WISMO, why customers ask it, and how merchants can reduce repetitive tickets.",
        href: "/blog/what-is-wismo",
        badge: "Guide",
        date: "May 10, 2026",
        sections: [
            {
                title: "Definition",
                paragraphs: [
                    "WISMO means Where is my order. In ecommerce, it describes customer messages asking about order status, shipping progress, tracking, or delivery timing.",
                ],
            },
            {
                title: "Why customers ask it",
                paragraphs: [
                    "Customers ask WISMO questions when delivery expectations are unclear, tracking updates are delayed, or they cannot find a tracking link after purchase.",
                ],
            },
            {
                title: "Why it hurts support teams",
                paragraphs: [
                    "The work is repetitive. Support teams spend time searching for the same order information instead of solving exceptions and higher-value customer issues.",
                ],
            },
            {
                title: "How to reduce WISMO tickets",
                bullets: [
                    "Improve post-purchase tracking emails.",
                    "Make tracking links easy to find.",
                    "Automate repetitive order tracking replies.",
                    "Escalate unclear cases to manual support.",
                ],
            },
        ],
    },
    {
        title: "How to Reduce Shopify Support Tickets",
        description:
            "Four practical ways to reduce repetitive Shopify support workload without losing control.",
        href: "/blog/how-to-reduce-shopify-support-tickets",
        badge: "Operations",
        date: "May 10, 2026",
        sections: [
            {
                title: "Improve tracking emails",
                paragraphs: [
                    "Clear shipping confirmations and tracking links reduce the need for customers to ask basic delivery questions.",
                ],
            },
            {
                title: "Add self-service tracking",
                paragraphs: [
                    "A visible tracking page can answer many customers before they contact support.",
                ],
            },
            {
                title: "Automate WISMO replies",
                paragraphs: [
                    "For customers who still email, automation can identify the order and send a consistent tracking response.",
                ],
            },
            {
                title: "Use fallback and manual review",
                paragraphs: [
                    "Automation should be conservative. If the order is unclear, the system should ask for more information or leave the message for manual handling.",
                ],
            },
        ],
    },
    {
        title: "Best Shopify Customer Support Apps",
        description:
            "How to compare full helpdesks, tracking tools, and focused automation tools for Shopify support.",
        href: "/blog/best-shopify-customer-support-apps",
        badge: "Comparison",
        date: "May 10, 2026",
        sections: [
            {
                title: "Full helpdesks",
                paragraphs: [
                    "Full helpdesks are best for teams that need ticket assignment, multiple channels, macros, reporting, and agent workflows.",
                ],
            },
            {
                title: "Tracking tools",
                paragraphs: [
                    "Tracking tools help customers self-serve delivery updates and can reduce some support demand.",
                ],
            },
            {
                title: "Focused automation tools",
                paragraphs: [
                    "Focused tools like Valyn target a specific support workflow, such as repetitive order tracking emails.",
                ],
            },
            {
                title: "How to choose",
                bullets: [
                    "Choose a helpdesk for broad team workflows.",
                    "Choose tracking tools for self-service delivery visibility.",
                    "Choose focused automation when one repetitive question dominates the inbox.",
                ],
            },
        ],
    },
    {
        title: "How to Automate Shopify Order Tracking Emails",
        description:
            "A step-by-step view of the data, safeguards, and workflow needed for Shopify tracking email automation.",
        href: "/blog/how-to-automate-shopify-order-tracking-emails",
        badge: "Automation",
        date: "May 10, 2026",
        sections: [
            {
                title: "Common manual workflow",
                paragraphs: [
                    "A support rep reads the customer email, finds the Shopify order, checks fulfillment, copies the tracking information, and writes a reply.",
                ],
            },
            {
                title: "Automation flow",
                paragraphs: [
                    "An automated workflow receives the email, detects order-support intent, identifies the order, generates a reply, sends it, and logs the result.",
                ],
            },
            {
                title: "Data needed",
                bullets: [
                    "Customer email address.",
                    "Order number when provided.",
                    "Shopify order and fulfillment status.",
                    "Tracking number, carrier, or URL when available.",
                ],
            },
            {
                title: "Risks and safeguards",
                paragraphs: [
                    "Good automation avoids guessing. It should use limited permissions, merchant-controlled templates, logs, and fallback behavior for unclear cases.",
                ],
            },
        ],
    },
];

export const legalSections: Record<
    string,
    { title: string; description: string; sections: TextSection[] }
> = {
    terms: {
        title: "Terms of Service",
        description:
            "The terms that apply when merchants install and use Valyn for Shopify order support automation.",
        sections: [
            {
                title: "Description of service",
                paragraphs: [
                    "Valyn provides a Shopify application that detects forwarded customer emails about order support and can send automated replies using Shopify order data and merchant-approved settings.",
                ],
            },
            {
                title: "Merchant responsibilities",
                bullets: [
                    "Provide accurate Shopify and SMTP configuration.",
                    "Forward only emails you are allowed to process through a third-party application.",
                    "Review automated behavior and disable it when it is not appropriate for your store.",
                ],
            },
            {
                title: "Account access",
                paragraphs: [
                    "Valyn uses Shopify OAuth permissions granted during installation. Access is limited to the scopes required for the service.",
                ],
            },
            {
                title: "Acceptable use",
                paragraphs: [
                    "You may not use Valyn to send unlawful, abusive, misleading, or unsolicited email. You remain responsible for your customer communications.",
                ],
            },
            {
                title: "Payment terms",
                paragraphs: [
                    "Subscription billing is handled by Shopify. Starter is USD 19 per month, Pro is USD 49 per month, each with a 7-day free trial unless the Shopify listing states otherwise.",
                ],
            },
            {
                title: "Cancellation",
                paragraphs: [
                    "You can cancel by uninstalling the app or cancelling the Shopify app subscription. Cancellation stops future automated replies after the subscription ends.",
                ],
            },
            {
                title: "Limitations of liability",
                paragraphs: [
                    "To the maximum extent permitted by law, Valyn is provided with limited liability. Merchants remain responsible for customer relationships and final support outcomes.",
                ],
            },
            {
                title: "Disclaimer of warranties",
                paragraphs: [
                    "The service is provided as is. Valyn does not guarantee that every email will be classified correctly or that every order lookup will succeed.",
                ],
            },
            {
                title: "Termination",
                paragraphs: [
                    "We may suspend or terminate access for misuse, non-payment, or material breach of these terms.",
                ],
            },
            {
                title: "Governing law",
                paragraphs: [
                    "Governing law and company details should be completed before public launch and reviewed by counsel.",
                ],
            },
        ],
    },
    privacy: {
        title: "Privacy Policy",
        description:
            "How Valyn collects, processes, stores, and deletes merchant and customer data for Shopify order support automation.",
        sections: [
            {
                title: "What data is collected",
                bullets: [
                    "Shop domain, OAuth access token, granted scopes, install and subscription state.",
                    "Order metadata needed to answer support requests, including order name, fulfillment status, and tracking information.",
                    "Inbound email sender, subject, body, timestamp, and processing outcome.",
                    "Merchant settings including language, greeting, signature, support email, and encrypted SMTP credentials.",
                ],
            },
            {
                title: "Why data is collected",
                paragraphs: [
                    "Valyn uses this data to classify incoming emails, find matching Shopify orders, generate order-support replies, send those replies through merchant SMTP, and show logs and statistics to the merchant.",
                ],
            },
            {
                title: "How Shopify data is processed",
                paragraphs: [
                    "Shopify data is requested only for installed merchants and only when needed for order support automation or dashboard display.",
                ],
            },
            {
                title: "Customer and order data usage",
                paragraphs: [
                    "Customer email and order data are used to identify the correct order and produce a relevant tracking or fallback response.",
                ],
            },
            {
                title: "Email data usage",
                paragraphs: [
                    "Forwarded emails are parsed so Valyn can detect intent and create an audit log. Raw inbound MIME files are retained in S3 for 30 days and then expire automatically.",
                ],
            },
            {
                title: "Data retention",
                bullets: [
                    "Raw inbound MIME files expire after 30 days.",
                    "Email logs are retained while the app remains installed unless deletion is requested.",
                    "Shop data is deleted after Shopify shop/redact processing following uninstall.",
                ],
            },
            {
                title: "Data deletion",
                paragraphs: [
                    "Valyn responds to Shopify GDPR webhooks for customer redaction and shop redaction. Merchants may also contact support for data questions.",
                ],
            },
            {
                title: "Third-party processors",
                bullets: [
                    "Shopify for app installation, billing, and order data.",
                    "Vercel for application hosting.",
                    "Amazon Web Services for S3, SNS, SES, and DynamoDB infrastructure.",
                ],
            },
            {
                title: "Security measures",
                paragraphs: [
                    "Valyn uses limited permissions, encrypted SMTP credentials, protected session-token APIs, webhook HMAC checks for Shopify webhooks, and structured logs for operational review.",
                ],
            },
            {
                title: "Merchant rights",
                paragraphs: [
                    "Merchants can request access, deletion, or clarification by contacting support. Customer data requests are handled through Shopify privacy webhooks and support follow-up.",
                ],
            },
        ],
    },
    cookies: {
        title: "Cookie Policy",
        description:
            "How Valyn uses essential, analytics, and marketing cookies on the public website and embedded app.",
        sections: [
            {
                title: "Essential cookies",
                paragraphs: [
                    "Essential cookies are used for security, authentication, Shopify OAuth state, and application functionality.",
                ],
            },
            {
                title: "Analytics cookies",
                paragraphs: [
                    "Analytics may be added to understand page visits, pricing views, demo views, FAQ views, and conversion events. Analytics should be configured to respect applicable consent rules.",
                ],
            },
            {
                title: "Marketing cookies",
                paragraphs: [
                    "Marketing cookies may be used for advertising attribution only after the relevant consent and disclosure requirements are met.",
                ],
            },
            {
                title: "Cookie consent",
                paragraphs: [
                    "Where required, visitors should be offered a cookie consent choice before non-essential cookies are used.",
                ],
            },
            {
                title: "Changing preferences",
                paragraphs: [
                    "Visitors can clear cookies in their browser settings. A dedicated preference center can be added before analytics or advertising launch.",
                ],
            },
        ],
    },
    dpa: {
        title: "Data Processing Agreement",
        description:
            "Valyn's merchant-facing data processing terms for Shopify order support automation.",
        sections: [
            {
                title: "Processor and controller roles",
                paragraphs: [
                    "The merchant is generally the controller of customer data. Valyn acts as a processor when handling customer emails and Shopify order data on behalf of the merchant.",
                ],
            },
            {
                title: "Processing purpose",
                paragraphs: [
                    "Processing is limited to detecting order support requests, identifying Shopify orders, sending automated replies, and maintaining operational logs.",
                ],
            },
            {
                title: "Categories of data",
                bullets: [
                    "Merchant shop and installation data.",
                    "Customer email address and email content forwarded by the merchant.",
                    "Shopify order metadata and tracking information.",
                    "SMTP settings and encrypted credentials.",
                ],
            },
            {
                title: "Sub-processors",
                paragraphs: [
                    "Current infrastructure uses Shopify, Vercel, and Amazon Web Services. Material changes to sub-processors should be disclosed to merchants.",
                ],
            },
            {
                title: "Security controls",
                paragraphs: [
                    "Valyn uses access control, encrypted SMTP credentials, HTTPS endpoints, webhook validation, limited Shopify permissions, and operational logging.",
                ],
            },
            {
                title: "Data deletion",
                paragraphs: [
                    "Data is deleted through Shopify privacy webhooks, uninstall processing, and merchant support requests where applicable.",
                ],
            },
            {
                title: "International transfers",
                paragraphs: [
                    "Hosting and infrastructure may process data in regions used by the listed processors. Transfer terms should be finalized before launch.",
                ],
            },
            {
                title: "Breach notification",
                paragraphs: [
                    "Valyn will notify affected merchants without undue delay after becoming aware of a personal data breach affecting their data.",
                ],
            },
            {
                title: "Audit and contact process",
                paragraphs: [
                    "Merchants can contact support for security, privacy, and processing questions. Formal audit terms should be finalized before enterprise use.",
                ],
            },
        ],
    },
    gdpr: {
        title: "GDPR",
        description:
            "How Valyn approaches GDPR readiness, data minimization, access, deletion, and retention.",
        sections: [
            {
                title: "GDPR readiness statement",
                paragraphs: [
                    "Valyn is designed around limited Shopify permissions, focused processing, and clear deletion behavior for merchant and customer data.",
                ],
            },
            {
                title: "Data minimization",
                paragraphs: [
                    "The app requests only the Shopify access needed to answer order support questions and avoids modifying store data.",
                ],
            },
            {
                title: "Right of access",
                paragraphs: [
                    "Customer data access requests received through Shopify privacy tooling are logged for operational follow-up.",
                ],
            },
            {
                title: "Right of deletion",
                paragraphs: [
                    "Valyn processes Shopify customer redaction and shop redaction webhooks to delete customer-specific or shop-specific data.",
                ],
            },
            {
                title: "Data retention",
                paragraphs: [
                    "Raw inbound emails expire after 30 days. Operational logs remain while the merchant uses the app unless deleted by request or Shopify privacy workflow.",
                ],
            },
            {
                title: "Contact for data requests",
                paragraphs: [
                    "Merchants can contact support@getvalyn.com for privacy and data request questions.",
                ],
            },
        ],
    },
    security: {
        title: "Security",
        description:
            "Security practices behind Valyn's focused Shopify order support automation.",
        sections: [
            {
                title: "Limited Shopify permissions",
                paragraphs: [
                    "Valyn is built around read-focused order access needed for order support automation and does not modify orders.",
                ],
            },
            {
                title: "Token and credential handling",
                paragraphs: [
                    "Shopify access tokens are stored server-side. SMTP passwords are encrypted at rest with AES-256-GCM before storage.",
                ],
            },
            {
                title: "Access control",
                paragraphs: [
                    "Internal dashboard APIs require Shopify App Bridge session tokens signed for the installed app.",
                ],
            },
            {
                title: "Logging",
                paragraphs: [
                    "Valyn logs inbound email processing outcomes, reply status, order matches, and errors so merchants can review automated behavior.",
                ],
            },
            {
                title: "Data retention",
                paragraphs: [
                    "Inbound MIME files expire from S3 after 30 days. Shop-level data is deleted through Shopify redaction workflows after uninstall.",
                ],
            },
            {
                title: "Incident contact",
                paragraphs: [
                    "Security questions can be sent to support@getvalyn.com.",
                ],
            },
            {
                title: "No unnecessary order modification",
                paragraphs: [
                    "The product is designed to read order data for support replies, not modify store orders or fulfillment state.",
                ],
            },
        ],
    },
};
