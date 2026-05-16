import "@/styles/globals.css";

// Global 404 for routes outside any route group. With multiple root layouts
// there is no shared layout wrapping this, so it renders its own document.
const RootNotFound: React.FC = () => (
    <html lang="en">
        <body>
            <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-4">
                <h1 className="text-5xl">404</h1>
                <p>Page not found</p>
            </div>
        </body>
    </html>
);

export const dynamic = "force-static";
export default RootNotFound;
