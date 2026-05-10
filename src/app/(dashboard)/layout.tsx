"use client";

import Link from "next/link";
import { AppProvider } from "@shopify/polaris";
import { NavMenu } from "@shopify/app-bridge-react";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <AppProvider i18n={enTranslations}>
            <NavMenu>
                <Link href="/dashboard" rel="home">
                    Dashboard
                </Link>
                <Link href="/settings">Settings</Link>
            </NavMenu>
            {children}
        </AppProvider>
    );
};

export default Layout;
