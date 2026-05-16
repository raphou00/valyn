"use client";

import "@/styles/globals.css";

// Global error boundary. With multiple root layouts nothing wraps this, so
// it renders its own document.
const RootError: React.FC = () => (
    <html lang="en">
        <body>
            <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-4">
                <h1 className="text-5xl">500</h1>
                <p>Something went wrong.</p>
            </div>
        </body>
    </html>
);

export default RootError;
