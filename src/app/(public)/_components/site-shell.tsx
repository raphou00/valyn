import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { SUPPORT_EMAIL, INSTALL_HREF } from "../_lib/metadata";
import { ArrowRight, Check, Play, ShopifyBox } from "./icons";

type NavItem = { label: string; href: string; key: string };
type PillTone = "ok" | "warn" | "fail" | "muted";

export const cn = (...classes: (string | false | null | undefined)[]) =>
    classes.filter(Boolean).join(" ");

export const containerClass =
    "mx-auto w-full max-w-[90rem] px-5 min-[420px]:px-6 sm:px-8 lg:px-12";

export const cardClass =
    "rounded-lg border border-base-300 bg-base-100 p-5 shadow-[0_8px_8px_rgba(0,0,0,0.08),0_4px_4px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.02)] transition hover:-translate-y-0.5 sm:p-6 [&_h3]:text-[1.4rem] [&_h3]:font-[330] [&_h3]:leading-tight [&_h3]:text-base-content sm:[&_h3]:text-2xl [&_h4]:text-xl [&_h4]:font-[330] [&_h4]:leading-tight [&_h4]:text-base-content [&_p]:mt-3 [&_p]:text-sm [&_p]:leading-6 [&_p]:text-base-content/70";

export const iconBoxClass =
    "mb-5 inline-flex size-11 items-center justify-center rounded-full bg-secondary text-secondary-content [&_svg]:size-5";

export const warningIconBoxClass =
    "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-base-content text-base-100 [&_svg]:size-5";

export const faqDetailsClass =
    "group rounded-lg border border-base-300 bg-base-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

export const faqSummaryClass =
    "flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-medium text-base-content [&::-webkit-details-marker]:hidden";

export const faqIconClass =
    "relative size-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-4 before:-translate-y-1/2 before:bg-base-content before:content-[''] after:absolute after:left-1/2 after:top-0 after:h-4 after:w-0.5 after:-translate-x-1/2 after:bg-base-content after:transition after:content-[''] group-open:after:rotate-90";

export const faqAnswerClass =
    "max-w-3xl px-5 pb-5 text-sm leading-7 text-base-content/70";

export const planClass =
    "relative flex flex-col gap-6 rounded-xl border border-base-300 bg-base-100 p-8 shadow-[0_8px_8px_rgba(0,0,0,0.08),0_4px_4px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.02)]";

export const featuredPlanClass = "border-transparent bg-secondary";

export const checkItemClass =
    "flex items-start gap-3 text-sm leading-6 text-base-content/80 [&_svg]:mt-1 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-base-content";

export const tableClass =
    "w-full overflow-hidden rounded-lg border border-base-300 bg-base-100 text-sm";

export const thClass =
    "border-b border-base-300 bg-base-200 px-4 py-3 text-left font-medium text-base-content";

export const tdClass =
    "border-b border-base-300 px-4 py-3 align-top text-base-content/80 last:border-b-0";

export const featureTdClass =
    "border-b border-base-300 px-4 py-3 align-top font-medium text-base-content last:border-b-0";

export const checkMarkClass = "font-medium text-base-content";

export const dashMarkClass = "text-base-content/40";

export const pillClass = (tone: PillTone = "muted") =>
    cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium",
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
            "inline-flex items-center gap-2 text-lg font-bold tracking-wide uppercase",
            inverted ? "text-accent-content" : "text-base-content"
        )}
    >
        <Image
            src="/favicon.svg"
            alt="Valyn logo"
            width={28}
            height={28}
            className="size-7 shrink-0"
            priority
        />
        <span>Valyn</span>
    </Link>
);

export const PublicHeader = ({
    active,
    variant = "light",
}: {
    active?: string;
    variant?: "light" | "dark";
}) => (
    <nav
        className={cn(
            "sticky top-0 z-40 border-b backdrop-blur",
            variant === "dark" ?
                "border-accent-content/10 bg-accent/95 text-accent-content"
            :   "border-base-300 bg-base-100/95 text-base-content"
        )}
    >
        <div
            className={`${containerClass} navbar flex h-14 items-center justify-between gap-4`}
        >
            <div className="navbar-start">
                <BrandMark inverted={variant === "dark"} />
            </div>
            <div className="navbar-center hidden items-center gap-1 lg:flex">
                {navItems.map((item) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={cn(
                            "rounded-full px-3 py-2 text-sm font-medium transition",
                            variant === "dark" ?
                                "text-accent-content/70 hover:bg-accent-content/10 hover:text-accent-content"
                            :   "text-base-content/70 hover:bg-base-content/5 hover:text-base-content",
                            item.key === active &&
                                (variant === "dark" ?
                                    "bg-accent-content/10 text-accent-content"
                                :   "bg-base-content/5 text-base-content")
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
            <div className="navbar-end flex items-center gap-2">
                <Link
                    href="/demo"
                    className={cn(
                        "btn btn-sm hidden sm:inline-flex",
                        variant === "dark" ?
                            "border border-accent-content/40 bg-transparent text-accent-content hover:bg-accent-content hover:text-accent"
                        :   "btn-ghost"
                    )}
                >
                    View demo
                </Link>
                <Link
                    href={INSTALL_HREF}
                    className="btn btn-sm hidden sm:inline-flex"
                >
                    <ShopifyBox className="size-4 shrink-0" />
                    Install on Shopify
                </Link>
                <details className="dropdown dropdown-end group lg:hidden">
                    <summary
                        aria-label="Open menu"
                        className={cn(
                            "btn btn-sm btn-ghost btn-square focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 group-open:bg-current/10",
                            variant === "dark" ?
                                "text-accent-content hover:bg-accent-content/10 focus-visible:outline-accent-content/50"
                            :   "text-base-content hover:bg-base-content/5 focus-visible:outline-base-content/30"
                        )}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </summary>
                    <ul
                        className={cn(
                            "menu dropdown-content z-50 mt-3 w-60 max-w-[calc(100vw-2.5rem)] rounded-lg border p-2 shadow",
                            variant === "dark" ?
                                "border-accent-content/10 bg-accent text-accent-content"
                            :   "border-base-300 bg-base-100 text-base-content"
                        )}
                    >
                        {navItems.map((item) => (
                            <li key={item.key}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium",
                                        item.key === active &&
                                            (variant === "dark" ?
                                                "bg-accent-content/10"
                                            :   "bg-base-content/5")
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className="mt-1 border-t border-current/10 pt-1 sm:hidden">
                            <Link href="/demo" className="text-sm font-medium">
                                View demo
                            </Link>
                        </li>
                        <li className="sm:hidden">
                            <Link
                                href={INSTALL_HREF}
                                className="text-sm font-medium"
                            >
                                <ShopifyBox className="size-4 shrink-0" />
                                Install on Shopify
                            </Link>
                        </li>
                    </ul>
                </details>
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
    <footer className="bg-accent py-16 text-accent-content lg:py-20">
        <div className={containerClass}>
            <div className="grid gap-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
                <div>
                    <BrandMark inverted />
                    <p className="mt-4 max-w-sm text-sm leading-6 text-accent-content/60">
                        The simplest way to automate order tracking support for
                        Shopify stores.
                    </p>
                    <span className="flex items-center gap-2 my-2 text-sm">
                        <Check className="size-4 text-secondary" />
                        Built on Shopify
                    </span>
                    <Link href={INSTALL_HREF} className="btn btn-sm mt-6">
                        <ShopifyBox className="size-4 shrink-0" />
                        Install on Shopify
                    </Link>
                </div>
                {footerGroups.map((group) => (
                    <div key={group.title}>
                        <h5 className="mb-4 text-xs font-medium uppercase tracking-[0.06em] text-accent-content/50">
                            {group.title}
                        </h5>
                        <ul className="grid gap-3">
                            {group.links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        className="text-sm text-[#9dabad] underline decoration-[#9dabad]/30 underline-offset-4 hover:text-accent-content"
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
            <div className="mt-12 flex flex-col gap-3 border-t border-accent-content/15 pt-6 text-sm text-accent-content/60 md:flex-row md:items-center md:justify-between">
                <span>© 2026 Valyn. Built for Shopify merchants.</span>
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </div>
        </div>
    </footer>
);

/* Layout primitives */

export const Container = ({
    children,
    narrow,
    style,
}: {
    children: ReactNode;
    narrow?: boolean;
    style?: React.CSSProperties;
}) => (
    <div className={cn(containerClass, narrow && "max-w-4xl")} style={style}>
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
        : bg === "warm" ? "bg-secondary"
        : bg === "ink" ? "bg-accent text-accent-content"
        : bg === "green-tint" ? "bg-secondary"
        : "";
    const cls = cn("py-14 sm:py-16 lg:py-24", bgClass, className);
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
    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
        {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium uppercase tracking-[0.06em] text-secondary-content">
                <span className="size-1.5 rounded-full bg-base-content" />
                {eyebrow}
            </span>
        )}
        <h2 className="mt-5 text-[2.35rem] font-[330] leading-[1.08] text-base-content sm:text-5xl lg:text-[70px]">
            {title}
        </h2>
        {description && (
            <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-7 text-base-content/70 sm:text-lg sm:leading-8">
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
    <section
        className={cn("bg-base-200 py-16 lg:py-24", center && "text-center")}
    >
        <div className={containerClass}>
            {eyebrow && (
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium uppercase tracking-[0.06em] text-secondary-content">
                    <span className="size-1.5 rounded-full bg-base-content" />
                    {eyebrow}
                </span>
            )}
            <h1 className="mt-6 text-5xl font-[330] leading-none text-base-content sm:text-6xl lg:text-[86px]">
                {title}
            </h1>
            {description && (
                <p
                    className={cn(
                        "mt-6 max-w-3xl text-lg leading-8 text-base-content/70 sm:text-xl",
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
            <span className="mb-2.5 block text-xs font-medium uppercase tracking-[0.06em] text-base-content/70">
                {badge}
            </span>
        )}
        <h3 className="text-2xl font-[330] text-base-content sm:text-3xl">
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
            <div className="relative overflow-hidden rounded-xl bg-accent p-8 text-center text-accent-content sm:p-10 lg:p-16">
                <h2 className="mx-auto max-w-4xl text-4xl font-[330] leading-[1.05] text-accent-content sm:text-5xl lg:text-[70px]">
                    {title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-accent-content/70">
                    {description}
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href={primaryHref} className="btn btn-lg invert">
                        {primaryLabel}
                    </Link>
                    <Link
                        href={secondaryHref}
                        className="btn btn-lg btn-outline border border-accent-content/30 bg-transparent text-accent-content hover:bg-accent-content hover:text-accent"
                    >
                        {secondaryLabel}
                    </Link>
                </div>
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
    <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-4 border-b border-base-300 bg-base-200 px-5 py-4 text-sm text-base-content/70">
            <div>
                <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-success" />
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
                    <div className="text-xs font-medium uppercase tracking-[0.06em] text-base-content/60">
                        {s.label}
                    </div>
                    <div className="mt-2 text-3xl font-[330] text-base-content">
                        {s.val}
                    </div>
                    <div
                        className={cn(
                            "mt-2 text-xs",
                            s.flat ? "text-base-content/70" : "text-success"
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
