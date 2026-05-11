type LayoutProps = { children: React.ReactNode };

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div className="min-h-screen bg-base-100 leading-normal text-base-content">
        {children}
    </div>
);

export default Layout;
