import { PublicFooter, PublicHeader } from "./_components/site-shell";

type LayoutProps = { children: React.ReactNode };

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div
            className="min-h-screen bg-base-100 text-base-content"
            data-theme="light"
        >
            <PublicHeader />
            <main>{children}</main>
            <PublicFooter />
        </div>
    );
};

export default Layout;
