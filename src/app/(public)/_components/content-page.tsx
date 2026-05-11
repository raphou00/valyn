import Link from "next/link";
import type { ReactNode } from "react";
import {
    Container,
    FinalCta,
    PageHead,
    PublicFooter,
    PublicHeader,
    Section,
} from "./site-shell";

export type TextSection = {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
};

const slugify = (s: string) =>
    s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export const ContentSections = ({ sections }: { sections: TextSection[] }) => (
    <div
        style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 40,
        }}
        className="content-layout"
    >
        <article style={{ maxWidth: 760 }}>
            {sections.map((section) => (
                <section
                    key={section.title}
                    id={slugify(section.title)}
                    style={{ marginBottom: 36, scrollMarginTop: 96 }}
                >
                    <h2
                        style={{
                            fontSize: 28,
                            marginBottom: 14,
                            color: "var(--ink)",
                        }}
                    >
                        {section.title}
                    </h2>
                    {section.paragraphs?.map((p, i) => (
                        <p
                            key={i}
                            style={{
                                fontSize: 17,
                                lineHeight: 1.65,
                                color: "var(--ink-2)",
                                marginTop: 12,
                            }}
                        >
                            {p}
                        </p>
                    ))}
                    {section.bullets && (
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: "16px 0 0",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            {section.bullets.map((b) => (
                                <li
                                    key={b}
                                    style={{
                                        display: "flex",
                                        gap: 10,
                                        alignItems: "flex-start",
                                        fontSize: 16,
                                        color: "var(--ink-2)",
                                    }}
                                >
                                    <span
                                        style={{
                                            marginTop: 8,
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: "var(--green)",
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
        </article>
        <aside style={{ position: "relative" }}>
            <div
                style={{
                    position: "sticky",
                    top: 100,
                    background: "var(--bg-soft)",
                    borderRadius: 12,
                    padding: 22,
                }}
            >
                <p
                    style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--muted)",
                        fontWeight: 540,
                        marginBottom: 12,
                    }}
                >
                    On this page
                </p>
                <nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    {sections.map((section) => (
                        <a
                            key={section.title}
                            href={`#${slugify(section.title)}`}
                            style={{ fontSize: 14, color: "var(--ink-2)" }}
                        >
                            {section.title}
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    </div>
);

export const GenericContentPage = ({
    eyebrow,
    title,
    description,
    sections,
    children,
    cta = true,
}: {
    eyebrow?: string;
    title: string;
    description: string;
    sections: TextSection[];
    children?: ReactNode;
    cta?: boolean;
}) => (
    <>
        <PublicHeader />
        <PageHead eyebrow={eyebrow} title={title} description={description} />
        <Section bg="soft">
            <Container>
                <ContentSections sections={sections} />
                {children}
            </Container>
        </Section>
        {cta && <FinalCta />}
        <PublicFooter />
    </>
);

export type ListingItem = {
    title: string;
    description: string;
    href: string;
    badge?: string;
};

export const ListingGrid = ({ items }: { items: ListingItem[] }) => (
    <div className="grid-3">
        {items.map((item) => (
            <Link className="card" href={item.href} key={item.href}>
                {item.badge && (
                    <span className="kicker" style={{ marginBottom: 10 }}>
                        {item.badge}
                    </span>
                )}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p
                    style={{
                        marginTop: 14,
                        fontWeight: 540,
                        fontSize: 14,
                        color: "var(--green-deep)",
                    }}
                >
                    Read →
                </p>
            </Link>
        ))}
    </div>
);

export const FaqList = ({
    items,
}: {
    items: { question: string; answer: string }[];
}) => (
    <div className="faq" style={{ maxWidth: 760, margin: "0 auto" }}>
        {items.map((item, i) => (
            <details key={item.question} open={i === 0}>
                <summary>
                    {item.question}
                    <span className="ico" />
                </summary>
                <div className="answer">{item.answer}</div>
            </details>
        ))}
    </div>
);
