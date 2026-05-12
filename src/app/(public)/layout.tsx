import { OrganizationJsonLd, WebSiteJsonLd } from "./_components/jsonld";

type LayoutProps = { children: React.ReactNode };

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div className="min-h-screen bg-base-100 leading-normal text-base-content">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {children}
    </div>
);

export default Layout;
