type LayoutProps = { children: React.ReactNode };

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div
            style={{
                maxWidth: 720,
                margin: "0 auto",
                padding: "48px 24px",
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                lineHeight: 1.6,
                color: "#202124",
            }}
        >
            {children}
        </div>
    );
};

export default Layout;
