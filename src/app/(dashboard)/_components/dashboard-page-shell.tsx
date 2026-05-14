"use client";

import { Page } from "@shopify/polaris";
import DashboardView from "./dashboard-view";

const DashboardPageShell: React.FC<{ shop?: string }> = ({ shop }) => (
    <Page title="Valyn" subtitle={shop}>
        <DashboardView />
    </Page>
);

export default DashboardPageShell;
