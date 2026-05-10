import Link from "next/link";
import type { ReactNode } from "react";
import {
    Container,
    FeatureCard,
    FinalCta,
    PageHero,
    Section,
} from "./site-shell";

export type TextSection = {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
};

export const ContentSections = ({ sections }: { sections: TextSection[] }) => (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="space-y-10">
            {sections.map((section) => (
                <section
                    className="scroll-mt-24"
                    id={section.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")}
                    key={section.title}
                >
                    <h2 className="text-2xl font-bold text-slate-950">
                        {section.title}
                    </h2>
                    <div className="mt-4 space-y-4 text-lg leading-8 text-slate-700">
                        {section.paragraphs?.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                    {section.bullets && (
                        <ul className="mt-5 grid gap-3 text-slate-700">
                            {section.bullets.map((bullet) => (
                                <li className="flex gap-3" key={bullet}>
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
        </article>
        <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase text-primary">
                    On this page
                </p>
                <nav className="mt-3 grid gap-2 text-sm">
                    {sections.map((section) => (
                        <a
                            className="link-hover text-slate-600"
                            href={`#${section.title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")}`}
                            key={section.title}
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
        <PageHero eyebrow={eyebrow} title={title} description={description} />
        <Section className="bg-base-200">
            <Container>
                <ContentSections sections={sections} />
                {children}
            </Container>
        </Section>
        {cta && <FinalCta />}
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
            <Link className="group" href={item.href} key={item.href}>
                <FeatureCard title={item.title} badge={item.badge}>
                    <p>{item.description}</p>
                    <p className="mt-4 font-semibold text-primary group-hover:underline">
                        Learn more
                    </p>
                </FeatureCard>
            </Link>
        ))}
    </div>
);

export const FaqList = ({
    items,
}: {
    items: { question: string; answer: string }[];
}) => (
    <div className="mx-auto max-w-4xl space-y-3">
        {items.map((item, index) => (
            <div
                className="collapse collapse-arrow border border-base-300 bg-base-100"
                key={item.question}
            >
                <input
                    aria-label={item.question}
                    defaultChecked={index === 0}
                    name="faq"
                    type="radio"
                />
                <div className="collapse-title text-lg font-semibold text-slate-950">
                    {item.question}
                </div>
                <div className="collapse-content text-slate-700">
                    <p>{item.answer}</p>
                </div>
            </div>
        ))}
    </div>
);
