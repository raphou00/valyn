"use client";

import Link from "next/link";
import { AppProvider } from "@shopify/polaris";
import { NavMenu } from "@shopify/app-bridge-react";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

// Client half of the embedded admin shell: Polaris provider + App Bridge
// nav. Split out so the dashboard root layout can stay a server component
// (required to export `metadata` and render <html>/<head>).
const DashboardShell: React.FC<React.PropsWithChildren> = ({ children }) => (
    <AppProvider i18n={enTranslations}>
        <NavMenu>
            <Link href="/dashboard" rel="home">
                Dashboard
            </Link>
            <Link href="/templates">Templates</Link>
            <Link href="/settings">Settings</Link>
        </NavMenu>
        <div style={{ backgroundColor: "#F1F1F1" }}>{children}</div>
    </AppProvider>
);

export default DashboardShell;
