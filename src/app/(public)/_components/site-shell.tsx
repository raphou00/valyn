import Link from "next/link";
import type { ReactNode } from "react";
import { DEMO_HREF, INSTALL_HREF, SUPPORT_EMAIL } from "../_lib/metadata";

type NavItem = { label: string; href: string };

const productNav: NavItem[] = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demo", href: "/demo" },
    { label: "FAQ", href: "/faq" },
];

const footerGroups: { title: string; links: NavItem[] }[] = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Demo", href: "/demo" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Blog", href: "/blog" },
            { label: "FAQ", href: "/faq" },
            {
                label: "Shopify support automation",
                href: "/shopify-customer-support-automation",
            },
            {
                label: "Reduce WISMO tickets",
                href: "/reduce-wismo-tickets-shopify",
            },
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

export const PublicHeader = () => (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
        <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <button
                        className="btn btn-ghost btn-square lg:hidden"
                        type="button"
                        aria-label="Open navigation"
                    >
                        <span
                            className="flex flex-col gap-1"
                            aria-hidden="true"
                        >
                            <span className="block h-0.5 w-5 rounded-full bg-current" />
                            <span className="block h-0.5 w-5 rounded-full bg-current" />
                            <span className="block h-0.5 w-5 rounded-full bg-current" />
                        </span>
                    </button>
                    <ul className="menu dropdown-content z-50 mt-3 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                        {productNav.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <Link className="btn btn-ghost px-2 text-xl font-bold" href="/">
                    Valyn
                </Link>
            </div>
            <nav className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-1 px-1">
                    {productNav.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="navbar-end gap-2">
                <Link
                    className="btn btn-ghost hidden sm:inline-flex"
                    href={DEMO_HREF}
                >
                    View Demo
                </Link>
                <Link className="btn btn-primary" href={INSTALL_HREF}>
                    Install on Shopify
                </Link>
            </div>
        </div>
    </header>
);

export const PublicFooter = () => (
    <footer className="border-t border-base-300 bg-base-200">
        <div className="footer mx-auto max-w-7xl px-4 py-12 text-base-content sm:px-6 lg:px-8">
            <aside className="max-w-sm">
                <Link className="text-2xl font-bold" href="/">
                    Valyn
                </Link>
                <p className="mt-3 text-sm text-base-content/70">
                    Focused Shopify automation for repetitive order support
                    emails.
                </p>
                <Link
                    className="btn btn-primary btn-sm mt-4"
                    href={INSTALL_HREF}
                >
                    Install on Shopify
                </Link>
            </aside>
            {footerGroups.map((group) => (
                <nav key={group.title}>
                    <h2 className="footer-title">{group.title}</h2>
                    {group.links.map((link) => (
                        <Link
                            className="link link-hover"
                            href={link.href}
                            key={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            ))}
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-base-300 px-4 py-6 text-sm text-base-content/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>&copy; 2026 Valyn. All rights reserved.</p>
            <a className="link link-hover" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
            </a>
        </div>
    </footer>
);

export const Container = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
    </div>
);

export const Section = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => <section className={`py-16 lg:py-24 ${className}`}>{children}</section>;

export const SectionIntro = ({
    eyebrow,
    title,
    children,
}: {
    eyebrow?: string;
    title: string;
    children?: ReactNode;
}) => (
    <div className="mx-auto mb-10 max-w-3xl text-center">
        {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase text-primary">
                {eyebrow}
            </p>
        )}
        <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            {title}
        </h2>
        {children && (
            <div className="mt-4 text-lg text-slate-600">{children}</div>
        )}
    </div>
);

export const PrimaryActions = () => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link className="btn btn-primary btn-lg" href={INSTALL_HREF}>
            Install on Shopify
        </Link>
        <Link className="btn btn-outline btn-lg" href={DEMO_HREF}>
            View Demo
        </Link>
    </div>
);

export const PageHero = ({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow?: string;
    title: string;
    description: string;
    children?: ReactNode;
}) => (
    <section className="relative overflow-hidden border-b border-base-300 bg-base-100">
        <HeroBackground />
        <Container className="relative py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
                {eyebrow && (
                    <p className="mb-4 text-sm font-semibold uppercase text-primary">
                        {eyebrow}
                    </p>
                )}
                <h1 className="text-4xl font-bold text-slate-950 sm:text-5xl lg:text-6xl">
                    {title}
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-700">
                    {description}
                </p>
                <div className="mt-8">
                    <PrimaryActions />
                </div>
                {children}
            </div>
        </Container>
    </section>
);

const HeroBackground = () => (
    <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
    >
        <div className="absolute right-4 top-20 hidden w-[520px] rotate-1 rounded-box border border-base-300 bg-white/80 p-4 shadow-2xl lg:block">
            <div className="mb-4 flex items-center justify-between border-b border-base-300 pb-3">
                <div>
                    <div className="h-3 w-28 rounded-full bg-slate-900" />
                    <div className="mt-2 h-2 w-40 rounded-full bg-slate-200" />
                </div>
                <div className="badge badge-success badge-outline">Live</div>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {["2,418", "631", "584", "12"].map((value, index) => (
                    <div
                        className="rounded-lg border border-base-300 bg-base-100 p-3"
                        key={value}
                    >
                        <div className="h-2 w-16 rounded-full bg-slate-200" />
                        <div className="mt-3 text-xl font-bold text-slate-950">
                            {value}
                        </div>
                        <div
                            className={`mt-2 h-1.5 rounded-full ${
                                index === 3 ? "bg-amber-300" : "bg-blue-300"
                            }`}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-4 space-y-2">
                {[
                    "Where is my order #1042?",
                    "Tracking for #1038",
                    "Address change",
                ].map((item, index) => (
                    <div
                        className="flex items-center justify-between rounded-lg border border-base-300 bg-base-100 p-3"
                        key={item}
                    >
                        <div>
                            <div className="text-sm font-semibold text-slate-800">
                                {item}
                            </div>
                            <div className="text-xs text-slate-500">
                                support@customer.com
                            </div>
                        </div>
                        <div
                            className={`badge ${
                                index === 2 ? "badge-ghost" : "badge-info"
                            }`}
                        >
                            {index === 2 ? "Ignored" : "Replied"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const FeatureCard = ({
    title,
    children,
    badge,
}: {
    title: string;
    children: ReactNode;
    badge?: string;
}) => (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
            {badge && (
                <div className="badge badge-primary badge-outline">{badge}</div>
            )}
            <h3 className="card-title text-xl text-slate-950">{title}</h3>
            <div className="text-slate-600">{children}</div>
        </div>
    </div>
);

export const DashboardMockup = () => (
    <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-xl">
        <div className="mb-4 flex flex-col gap-3 border-b border-base-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-semibold text-primary">
                    Valyn dashboard
                </p>
                <h3 className="text-2xl font-bold text-slate-950">
                    Order support overview
                </h3>
            </div>
            <div className="badge badge-success badge-lg">
                Automation enabled
            </div>
        </div>
        <div className="stats stats-vertical w-full border border-base-300 lg:stats-horizontal">
            {[
                ["Emails processed", "2,418"],
                ["WISMO detected", "631"],
                ["Replies sent", "584"],
                ["Failed lookups", "12"],
            ].map(([label, value]) => (
                <div className="stat" key={label}>
                    <div className="stat-title">{label}</div>
                    <div className="stat-value text-slate-950">{value}</div>
                    <div className="stat-desc">Last 30 days</div>
                </div>
            ))}
        </div>
        <div className="mt-4 overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Intent</th>
                        <th>Order</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        ["sarah@example.com", "WISMO", "#1042", "Replied"],
                        ["marc@example.com", "WISMO", "#1038", "Replied"],
                        ["lena@example.com", "Other", "-", "Ignored"],
                    ].map(([customer, intent, order, status]) => (
                        <tr key={customer}>
                            <td>{customer}</td>
                            <td>
                                <span
                                    className={`badge ${
                                        intent === "WISMO" ? "badge-info" : (
                                            "badge-ghost"
                                        )
                                    }`}
                                >
                                    {intent}
                                </span>
                            </td>
                            <td>{order}</td>
                            <td>
                                <span
                                    className={`badge ${
                                        status === "Replied" ? "badge-success"
                                        :   "badge-ghost"
                                    }`}
                                >
                                    {status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const InstallPanel = () => (
    <div
        className="rounded-box border border-base-300 bg-slate-950 p-6 text-white shadow-xl sm:p-8"
        id="install"
    >
        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
                <p className="text-sm font-semibold uppercase text-blue-200">
                    Shopify install
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                    Start automating order support today.
                </h2>
                <p className="mt-4 max-w-2xl text-slate-300">
                    Enter your Shopify store domain to start the OAuth install
                    flow. You can configure forwarding and SMTP after
                    installation.
                </p>
            </div>
            <form action="/api/auth" className="join w-full" method="get">
                <input
                    aria-label="Shopify store domain"
                    className="input join-item input-bordered w-full text-slate-950"
                    name="shop"
                    placeholder="your-store.myshopify.com"
                    required
                    type="text"
                />
                <button className="btn btn-primary join-item" type="submit">
                    Install
                </button>
            </form>
        </div>
    </div>
);

export const FinalCta = () => (
    <Section className="bg-base-100">
        <Container>
            <InstallPanel />
        </Container>
    </Section>
);
