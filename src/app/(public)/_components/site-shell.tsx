import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { SUPPORT_EMAIL, INSTALL_HREF } from "../_lib/metadata";
import { ArrowRight, Check, Play, ShopifyBox } from "./icons";

type NavItem = { label: string; href: string; key: string };
type PillTone = "ok" | "warn" | "fail" | "muted";

export const cn = (...classes: (string | false | null | undefined)[]) =>
    classes.filter(Boolean).join(" ");

export const containerClass = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export const cardClass =
    "rounded-box border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-1 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-base-content [&_h4]:font-semibold [&_h4]:leading-tight [&_h4]:text-base-content [&_p]:mt-3 [&_p]:text-sm [&_p]:leading-6 [&_p]:text-base-content/70";

export const iconBoxClass =
    "mb-4 inline-flex size-11 items-center justify-center rounded-box bg-primary/10 text-primary [&_svg]:size-5";

export const warningIconBoxClass =
    "inline-flex size-11 shrink-0 items-center justify-center rounded-box bg-warning/20 text-warning [&_svg]:size-5";

export const faqDetailsClass =
    "group rounded-box border border-base-300 bg-base-100";

export const faqSummaryClass =
    "flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-base-content [&::-webkit-details-marker]:hidden";

export const faqIconClass =
    "relative size-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-4 before:-translate-y-1/2 before:bg-base-content before:content-[''] after:absolute after:left-1/2 after:top-0 after:h-4 after:w-0.5 after:-translate-x-1/2 after:bg-base-content after:transition after:content-[''] group-open:after:rotate-90";

export const faqAnswerClass =
    "max-w-3xl px-5 pb-5 text-sm leading-7 text-base-content/70";

export const planClass =
    "relative flex flex-col gap-6 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm";

export const featuredPlanClass = "border-primary bg-primary/10";

export const checkItemClass =
    "flex items-start gap-3 text-sm leading-6 text-base-content/80 [&_svg]:mt-1 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-primary";

export const tableClass =
    "w-full overflow-hidden rounded-box border border-base-300 bg-base-100 text-sm";

export const thClass =
    "border-b border-base-300 bg-base-200 px-4 py-3 text-left font-semibold text-base-content";

export const tdClass =
    "border-b border-base-300 px-4 py-3 align-top text-base-content/80 last:border-b-0";

export const featureTdClass =
    "border-b border-base-300 px-4 py-3 align-top font-semibold text-base-content last:border-b-0";

export const checkMarkClass = "font-semibold text-primary";

export const dashMarkClass = "text-base-content/40";

export const pillClass = (tone: PillTone = "muted") =>
    cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "ok" && "bg-success/15 text-success",
        tone === "warn" && "bg-warning/20 text-warning",
        tone === "fail" && "bg-error/15 text-error",
        tone === "muted" && "bg-base-200 text-base-content/70"
    );

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
        className={cn(
            "inline-flex items-center gap-2 text-lg font-semibold",
            inverted ? "text-accent-content" : "text-base-content"
        )}
    >
        <Image
            src="/favicon.svg"
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0"
            priority
        />
        <span>Valyn</span>
    </Link>
);

export const PublicHeader = ({ active }: { active?: string }) => (
    <nav className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
        <div
            className={`${containerClass} flex h-16 items-center justify-between gap-4`}
        >
            <BrandMark />
            <div className="hidden items-center gap-1 lg:flex">
                {navItems.map((item) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={cn(
                            "rounded-full px-3 py-2 text-sm font-medium text-base-content/70 transition hover:bg-base-200 hover:text-base-content",
                            item.key === active &&
                                "bg-base-200 text-base-content"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Link href="/demo" className="btn btn-ghost btn-sm">
                    View demo
                </Link>
                <Link href={INSTALL_HREF} className="btn btn-primary btn-sm">
                    <ShopifyBox className="size-4 shrink-0" />
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
    <footer className="bg-accent py-12 text-accent-content">
        <div className={containerClass}>
            <div className="grid gap-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
                <div>
                    <BrandMark inverted />
                    <p className="mt-4 max-w-sm text-sm leading-6 text-accent-content/70">
                        The simplest way to automate order tracking support for
                        Shopify stores.
                    </p>
                </div>
                {footerGroups.map((group) => (
                    <div key={group.title}>
                        <h5 className="mb-4 text-sm font-semibold uppercase tracking-normal text-accent-content/60">
                            {group.title}
                        </h5>
                        <ul className="grid gap-3">
                            {group.links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        className="text-sm text-accent-content/70 hover:text-accent-content"
                                        href={link.href}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 border-t border-accent-content/20 pt-6 text-sm text-accent-content/70 md:flex-row md:items-center md:justify-between">
                <span>© 2026 Valyn. Built for Shopify merchants.</span>
                <span className="inline-flex items-center gap-2">
                    <Check className="size-4 text-primary" />
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
    style,
}: {
    children: ReactNode;
    narrow?: boolean;
    style?: React.CSSProperties;
}) => (
    <div className={containerClass} style={style}>
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
        bg === "soft" ? "bg-base-200"
        : bg === "warm" ? "bg-base-200/60"
        : bg === "ink" ? "bg-accent text-accent-content"
        : bg === "green-tint" ? "bg-primary/10"
        : "";
    const cls = cn("py-16 lg:py-24", bgClass, className);
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
    <div className="mx-auto mb-10 max-w-3xl text-center">
        {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-normal text-base-content/70">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]" />
                {eyebrow}
            </span>
        )}
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-base-content sm:text-4xl lg:text-5xl">
            {title}
        </h2>
        {description && (
            <p className="mt-4 text-lg leading-8 text-base-content/70">
                {description}
            </p>
        )}
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
    <section className={cn("py-16 lg:py-24", center && "text-center")}>
        <div className={containerClass}>
            {eyebrow && (
                <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-normal text-base-content/70">
                    <span className="size-1.5 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]" />
                    {eyebrow}
                </span>
            )}
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-base-content sm:text-5xl lg:text-6xl">
                {title}
            </h1>
            {description && (
                <p
                    className={cn(
                        "mt-5 max-w-2xl text-lg leading-8 text-base-content/70 sm:text-xl",
                        center && "mx-auto"
                    )}
                >
                    {description}
                </p>
            )}
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
    <div className={cardClass}>
        {badge && (
            <span className="mb-2.5 block text-xs font-semibold uppercase tracking-normal text-base-content/70">
                {badge}
            </span>
        )}
        <h3 className="text-xl font-semibold text-base-content sm:text-2xl">
            {title}
        </h3>
        <div>{children}</div>
    </div>
);

export const PrimaryActions = ({ centered }: { centered?: boolean }) => (
    <div
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        style={centered ? { justifyContent: "center" } : undefined}
    >
        <Link href={INSTALL_HREF} className="btn btn-primary btn-lg">
            Install on Shopify <ArrowRight className="size-4 shrink-0" />
        </Link>
        <Link href="/demo" className="btn btn-ghost btn-lg">
            <Play className="size-4 shrink-0" />
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
            <div className="relative overflow-hidden rounded-box bg-accent p-8 text-center text-accent-content sm:p-10 lg:p-14">
                <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight text-accent-content sm:text-4xl lg:text-5xl">
                    {title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-accent-content/70">
                    {description}
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href={primaryHref} className="btn btn-primary btn-lg">
                        {primaryLabel}
                    </Link>
                    <Link
                        href={secondaryHref}
                        className="btn btn-outline btn-lg border-accent-content/30 text-accent-content hover:bg-accent-content hover:text-accent"
                    >
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
            <div
                className="relative overflow-hidden rounded-box bg-accent p-8 text-center text-accent-content sm:p-10 lg:p-14"
                id="install"
            >
                <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight text-accent-content sm:text-4xl lg:text-5xl">
                    Install Valyn on your Shopify store.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-accent-content/70">
                    Enter your store domain to start the OAuth flow. Setup and
                    SMTP configuration happen inside the app.
                </p>
                <form
                    action="/api/auth"
                    method="get"
                    className="relative mt-7 flex flex-wrap justify-center gap-2.5"
                >
                    <input
                        name="shop"
                        required
                        placeholder="your-store.myshopify.com"
                        aria-label="Shopify store domain"
                        pattern="[a-z0-9][a-z0-9\-]*\.myshopify\.com"
                        className="input input-bordered w-full max-w-sm border-accent-content/20 bg-accent-content/10 text-accent-content placeholder:text-accent-content/50"
                    />
                    <button type="submit" className="btn btn-primary btn-lg">
                        Install
                    </button>
                </form>
                <p className="relative mt-3.5 text-sm text-accent-content/60">
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
    <div className="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="flex items-center gap-4 border-b border-base-300 bg-base-200 px-5 py-4 text-sm text-base-content/70">
            <div>
                <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary" />
                    Inbox automation —{" "}
                    <strong className="text-base-content">Live</strong>
                </span>
            </div>
            <div className="ml-auto text-xs text-base-content/70">
                Last 7 days
            </div>
        </div>
        <div className="grid border-b border-base-300 sm:grid-cols-2 lg:grid-cols-4">
            {DASH_STATS.map((s) => (
                <div
                    className="border-b border-base-300 p-5 sm:border-r sm:border-b-0 last:border-r-0"
                    key={s.label}
                >
                    <div className="text-xs font-semibold uppercase tracking-normal text-base-content/70">
                        {s.label}
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-base-content">
                        {s.val}
                    </div>
                    <div
                        className={cn(
                            "mt-2 text-xs",
                            s.flat ? "text-base-content/70" : "text-primary"
                        )}
                    >
                        {s.trend}
                    </div>
                </div>
            ))}
        </div>
        <div className="grid">
            {DASH_ROWS.map((row) => (
                <div
                    className="grid gap-3 border-b border-base-300 px-5 py-4 text-sm last:border-b-0 lg:grid-cols-[1.1fr_1.4fr_80px_130px_80px] lg:items-center"
                    key={row.subject}
                >
                    <div className="font-semibold text-base-content">
                        {row.name}
                        <span className="block text-xs font-normal text-base-content/70">
                            {row.addr}
                        </span>
                    </div>
                    <div className="text-xs text-base-content/70">
                        {row.subject}
                    </div>
                    <div className=" text-sm">{row.order}</div>
                    <div>
                        <span className={pillClass(row.pill.tone)}>
                            {row.pill.text}
                        </span>
                    </div>
                    <div className="text-xs text-base-content/70">
                        {row.time}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
