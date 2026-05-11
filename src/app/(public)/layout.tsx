import { Geist, Geist_Mono } from "next/font/google";
import "./marketing.css";

const geist = Geist({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-geist",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-geist-mono",
});

type LayoutProps = { children: React.ReactNode };

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div
        className={`marketing ${geist.variable} ${geistMono.variable}`}
        style={
            {
                ["--font-sans" as string]: `${geist.style.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
                ["--font-mono" as string]: `${geistMono.style.fontFamily}, ui-monospace, "SF Mono", Menlo, monospace`,
            } as React.CSSProperties
        }
    >
        {children}
    </div>
);

export default Layout;
