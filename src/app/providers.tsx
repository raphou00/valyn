"use client";

import { Toaster } from "react-hot-toast";

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
            {children}
        </>
    );
};

export default Providers;
