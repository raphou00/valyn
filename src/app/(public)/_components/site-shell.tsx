import Link from "next/link";
import type { ReactNode } from "react";
import { SUPPORT_EMAIL, INSTALL_HREF } from "../_lib/metadata";
import { ArrowRight, Check, Play, ShopifyBox } from "./icons";

type NavItem = { label: string; href: string; key: string };

const navItems: NavItem[] = [
    { label: "Features", href: "/features", key: "features" },
    { label: "Pricing", href: "/pricing", key: "pricing" },
    { label: "Demo", href: "/demo", key: "demo" },
    { label: "FAQ", href: "/faq", key: "faq" },
    { label: "vs. Gorgias", href: "/gorgias-alternative", key: "gorgias" },
];

const BrandMark = ({ inverted = false }: { inverted?: boolean }) => (
    <Link
        href="/"
        className="brand"
        style={inverted ? { color: "#fff" } : undefined}
    >
        <span
            aria-hidden
            style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background:
                    "linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#052b13",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-0.04em",
            }}
        >
            V
        </span>
        <span>Valyn</span>
    </Link>
);

export const PublicHeader = ({ active }: { active?: string }) => (
    <nav className="nav">
        <div className="wrap nav-inner">
            <BrandMark />
            <div className="nav-links">
                {navItems.map((item) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={item.key === active ? "active" : undefined}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
            <div className="nav-cta">
                <Link href="/demo" className="btn btn-ghost btn-sm">
                    View demo
                </Link>
                <Link href={INSTALL_HREF} className="btn btn-green btn-sm">
                    <ShopifyBox className="ico" />
                    Install on Shopify
                </Link>
            </div>
        </div>
    </nav>
);

const footerGroups: {
    title: string;
    links: { label: string; href: string }[];
}[] = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Demo", href: "/demo" },
            { label: "vs. Gorgias", href: "/gorgias-alternative" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "FAQ", href: "/faq" },
            { label: "WISMO guide", href: "/reduce-wismo-tickets-shopify" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Terms", href: "/legal/terms" },
            { label: "Privacy", href: "/legal/privacy" },
            { label: "Cookies", href: "/legal/cookies" },
            { label: "GDPR", href: "/legal/gdpr" },
            { label: "Security", href: "/legal/security" },
        ],
    },
];

export const PublicFooter = () => (
    <footer className="footer">
        <div className="wrap">
            <div className="footer-grid">
                <div>
                    <BrandMark inverted />
                    <p className="brand-blurb">
                        The simplest way to automate order tracking support for
                        Shopify stores.
                    </p>
                </div>
                {footerGroups.map((group) => (
                    <div key={group.title}>
                        <h5>{group.title}</h5>
                        <ul>
                            {group.links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="footer-bottom">
                <span>© 2026 Valyn. Built for Shopify merchants.</span>
                <span className="shopify-mark">
                    <Check />
                    Built on Shopify
                </span>
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </div>
        </div>
    </footer>
);

/* Layout primitives */

export const Container = ({
    children,
    narrow = false,
    style,
}: {
    children: ReactNode;
    narrow?: boolean;
    style?: React.CSSProperties;
}) => (
    <div className={narrow ? "wrap-narrow" : "wrap"} style={style}>
        {children}
    </div>
);

export const Section = ({
    children,
    bg,
    className,
    style,
}: {
    children: ReactNode;
    bg?: "soft" | "warm" | "ink" | "green-tint";
    className?: string;
    style?: React.CSSProperties;
}) => {
    const bgClass =
        bg === "soft" ? "bg-soft"
        : bg === "warm" ? "bg-warm"
        : bg === "ink" ? "bg-ink"
        : bg === "green-tint" ? "bg-green-tint"
        : "";
    const cls = ["section", bgClass, className].filter(Boolean).join(" ");
    return (
        <section className={cls} style={style}>
            {children}
        </section>
    );
};

export const SectionHead = ({
    eyebrow,
    title,
    description,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
}) => (
    <div className="section-head">
        {eyebrow && (
            <span className="eyebrow">
                <span className="dot" />
                {eyebrow}
            </span>
        )}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
    </div>
);

export const PageHead = ({
    eyebrow,
    title,
    description,
    center = true,
}: {
    eyebrow?: string;
    title: ReactNode;
    description?: ReactNode;
    center?: boolean;
}) => (
    <section className={`page-head${center ? " center" : ""}`}>
        <div className="wrap">
            {eyebrow && (
                <span className="eyebrow">
                    <span className="dot" />
                    {eyebrow}
                </span>
            )}
            <h1>{title}</h1>
            {description && <p className="lede">{description}</p>}
        </div>
    </section>
);

// Aliases kept for the secondary pages still using the previous API.
export const PageHero = PageHead;
export const SectionIntro = SectionHead;

export const FeatureCard = ({
    title,
    badge,
    children,
}: {
    title: string;
    badge?: string;
    children: ReactNode;
}) => (
    <div className="card">
        {badge && (
            <span className="kicker" style={{ marginBottom: 10 }}>
                {badge}
            </span>
        )}
        <h3>{title}</h3>
        <div>{children}</div>
    </div>
);

export const PrimaryActions = ({ centered }: { centered?: boolean }) => (
    <div
        className="hero-ctas"
        style={centered ? { justifyContent: "center" } : undefined}
    >
        <Link href={INSTALL_HREF} className="btn btn-green btn-lg">
            Install on Shopify <ArrowRight className="ico" />
        </Link>
        <Link href="/demo" className="btn btn-ghost btn-lg">
            <Play className="ico" />
            View live demo
        </Link>
    </div>
);

export const FinalCta = ({
    title = "Start automating order support today.",
    description = "Install on Shopify in under two minutes. 7-day free trial, no card required.",
    primaryHref = INSTALL_HREF,
    primaryLabel = "Install on Shopify",
    secondaryHref = "/demo",
    secondaryLabel = "View live demo",
}: {
    title?: string;
    description?: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
}) => (
    <Section>
        <Container>
            <div className="cta-block">
                <h2>{title}</h2>
                <p>{description}</p>
                <div className="btns">
                    <Link href={primaryHref} className="btn btn-green btn-lg">
                        {primaryLabel}
                    </Link>
                    <Link href={secondaryHref} className="btn btn-ghost btn-lg">
                        {secondaryLabel}
                    </Link>
                </div>
            </div>
        </Container>
    </Section>
);

/* Install panel — anchor target for #install. Merchant pastes their
 * Shopify store domain, form posts to /api/auth which starts OAuth. */
export const InstallPanel = () => (
    <Section>
        <Container>
            <div className="cta-block" id="install">
                <h2>Install Valyn on your Shopify store.</h2>
                <p>
                    Enter your store domain to start the OAuth flow. Setup and
                    SMTP configuration happen inside the app.
                </p>
                <form
                    action="/api/auth"
                    method="get"
                    style={{
                        position: "relative",
                        display: "flex",
                        gap: 10,
                        justifyContent: "center",
                        marginTop: 28,
                        flexWrap: "wrap",
                    }}
                >
                    <input
                        name="shop"
                        required
                        placeholder="your-store.myshopify.com"
                        aria-label="Shopify store domain"
                        pattern="[a-z0-9][a-z0-9\-]*\.myshopify\.com"
                        style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            color: "#fff",
                            border: "1px solid #2a313c",
                            borderRadius: "var(--radius)",
                            padding: "14px 18px",
                            fontFamily: "inherit",
                            fontSize: 15,
                            width: "min(360px, 100%)",
                            outline: "none",
                        }}
                    />
                    <button type="submit" className="btn btn-green btn-lg">
                        Install
                    </button>
                </form>
                <p
                    style={{
                        marginTop: 14,
                        fontSize: 13,
                        color: "#8a93a1",
                        position: "relative",
                    }}
                >
                    Or find Valyn on the Shopify App Store once we&apos;re
                    listed.
                </p>
            </div>
        </Container>
    </Section>
);

/* ===== Featured visual: dashboard mockup ===== */

const DASH_STATS: {
    label: string;
    val: string;
    trend: string;
    flat?: boolean;
}[] = [
    { label: "Emails processed", val: "1,284", trend: "↑ 12% vs prev week" },
    { label: "WISMO detected", val: "912", trend: "71% of inbox" },
    { label: "Auto-replies sent", val: "887", trend: "97% match rate" },
    {
        label: "Failed lookups",
        val: "25",
        trend: "Awaiting review",
        flat: true,
    },
];

const DASH_ROWS: {
    name: string;
    addr: string;
    subject: string;
    order: string;
    pill: { tone: "ok" | "warn" | "muted"; text: string };
    time: string;
}[] = [
    {
        name: "Sarah Patel",
        addr: "sarah.p@gmail.com",
        subject: "Where's my package? Order #1042",
        order: "#1042",
        pill: { tone: "ok", text: "● Replied" },
        time: "2m ago",
    },
    {
        name: "Marc Dubois",
        addr: "marc@dubois-mail.fr",
        subject: "ma commande n'est pas arrivée",
        order: "#1041",
        pill: { tone: "ok", text: "● Replied" },
        time: "4m ago",
    },
    {
        name: "Anna Becker",
        addr: "a.becker@web.de",
        subject: "Wo ist mein Paket?",
        order: "#1039",
        pill: { tone: "ok", text: "● Replied" },
        time: "11m ago",
    },
    {
        name: "Reginald Owens",
        addr: "reggie.owens@gmail.com",
        subject: "Can I change the shipping address on my order?",
        order: "—",
        pill: { tone: "muted", text: "Skipped — not WISMO" },
        time: "18m ago",
    },
    {
        name: "Unknown sender",
        addr: "noreply@notify.shopify.com",
        subject: "I haven't gotten my stuff yet??",
        order: "—",
        pill: { tone: "warn", text: "● Needs review" },
        time: "26m ago",
    },
    {
        name: "Lina Hofer",
        addr: "lina@example.com",
        subject: "When will my order #1037 arrive?",
        order: "#1037",
        pill: { tone: "ok", text: "● Replied" },
        time: "31m ago",
    },
];

export const DashboardMockup = () => (
    <div className="dash">
        <div className="dash-head">
            <div className="left">
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            background: "var(--green)",
                            borderRadius: "50%",
                        }}
                    />
                    Inbox automation —{" "}
                    <strong style={{ color: "var(--ink)" }}>Live</strong>
                </span>
            </div>
            <div
                style={{
                    marginLeft: "auto",
                    fontSize: 12,
                    color: "var(--muted)",
                }}
            >
                Last 7 days
            </div>
        </div>
        <div className="dash-stats">
            {DASH_STATS.map((s) => (
                <div className="dash-stat" key={s.label}>
                    <div className="label">{s.label}</div>
                    <div className="val">{s.val}</div>
                    <div className={`trend${s.flat ? " flat" : ""}`}>
                        {s.trend}
                    </div>
                </div>
            ))}
        </div>
        <div className="dash-table">
            {DASH_ROWS.map((row) => (
                <div className="dash-row" key={row.subject}>
                    <div className="who">
                        {row.name}
                        <span className="sub">{row.addr}</span>
                    </div>
                    <div className="sub-text">{row.subject}</div>
                    <div className="order">{row.order}</div>
                    <div>
                        <span className={`pill ${row.pill.tone}`}>
                            {row.pill.text}
                        </span>
                    </div>
                    <div className="time">{row.time}</div>
                </div>
            ))}
        </div>
    </div>
);
