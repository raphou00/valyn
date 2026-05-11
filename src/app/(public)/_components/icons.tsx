import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
});

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} strokeWidth={2.2}>
        <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
);

export const Play = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="currentColor" stroke="none">
        <path d="M8 5v14l11-7z" />
    </svg>
);

export const Check = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} strokeWidth={2.5}>
        <path d="M5 12l5 5L20 7" />
    </svg>
);

export const ShopifyBox = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="currentColor" stroke="none">
        <path d="M14.7 2.3c-.4 0-.7.3-.7.7v2c0 .4.3.7.7.7h2c.4 0 .7-.3.7-.7v-2c0-.4-.3-.7-.7-.7h-2zm-7 0c-.4 0-.7.3-.7.7v2c0 .4.3.7.7.7h2c.4 0 .7-.3.7-.7v-2c0-.4-.3-.7-.7-.7h-2zM4 7c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1H4zm8 3.5l4 4h-2.5v4h-3v-4H8l4-4z" />
    </svg>
);

export const AlertCircle = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M12 8v4M12 16h.01" />
        <circle cx="12" cy="12" r="9" />
    </svg>
);

export const Clock = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </svg>
);

export const TrendUp = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
    </svg>
);

export const Inbox = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

export const Clipboard = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
    </svg>
);

export const Mail = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M3 7l9 6 9-6" />
        <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
);

export const Activity = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
);

export const Search = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
    </svg>
);

export const Send = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
);

export const Cog = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

export const FileText = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
    </svg>
);

export const Mailbox = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
        <path d="M3 8l9 6 9-6" />
        <rect x="3" y="6" width="18" height="12" rx="2" />
    </svg>
);
