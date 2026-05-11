import Link from "next/link";
import type { ReactNode } from "react";
import {
    cardClass,
    Container,
    faqAnswerClass,
    faqDetailsClass,
    faqIconClass,
    faqSummaryClass,
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
    <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <article>
            {sections.map((section) => (
                <section
                    key={section.title}
                    id={slugify(section.title)}
                    className="mb-9 scroll-mt-24"
                >
                    <h2 className="mb-3.5 text-3xl font-semibold leading-tight text-base-content">
                        {section.title}
                    </h2>
                    {section.paragraphs?.map((p, i) => (
                        <p
                            key={i}
                            className="mt-3 text-[17px] leading-8 text-base-content/80"
                        >
                            {p}
                        </p>
                    ))}
                    {section.bullets && (
                        <ul className="mt-4 grid gap-2.5">
                            {section.bullets.map((b) => (
                                <li
                                    key={b}
                                    className="flex items-start gap-2.5 text-base leading-7 text-base-content/80"
                                >
                                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
        </article>
        <aside className="relative hidden lg:block">
            <div className="sticky top-24 rounded-box bg-base-200 p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-normal text-base-content/60">
                    On this page
                </p>
                <nav className="grid gap-2">
                    {sections.map((section) => (
                        <a
                            key={section.title}
                            href={`#${slugify(section.title)}`}
                            className="text-sm text-base-content/80 hover:text-base-content"
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
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
            <Link className={cardClass} href={item.href} key={item.href}>
                {item.badge && (
                    <span className="mb-2.5 block text-xs font-semibold uppercase tracking-normal text-base-content/70">
                        {item.badge}
                    </span>
                )}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="mt-3.5 text-sm font-semibold text-primary">
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
    <div className="grid gap-3">
        {items.map((item, i) => (
            <details
                className={faqDetailsClass}
                key={item.question}
                open={i === 0}
            >
                <summary className={faqSummaryClass}>
                    {item.question}
                    <span className={faqIconClass} />
                </summary>
                <div className={faqAnswerClass}>{item.answer}</div>
            </details>
        ))}
    </div>
);
