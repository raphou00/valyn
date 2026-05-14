"use client";

import { Page } from "@shopify/polaris";
import SettingsForm from "./settings-form";

const SettingsPageShell: React.FC<{ shop?: string }> = ({ shop }) => (
    <Page title="Settings" subtitle={shop} backAction={{ url: "/dashboard" }}>
        <SettingsForm />
    </Page>
);

export default SettingsPageShell;
