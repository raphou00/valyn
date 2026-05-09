import { redirect } from "next/navigation";
import { Page } from "@shopify/polaris";
import { isValidShop } from "@/lib/shopify";
import SettingsForm from "../_components/settings-form";

type Props = {
    searchParams: Promise<{ shop?: string; host?: string }>;
};

const SettingsPage: React.FC<Props> = async ({ searchParams }) => {
    const { shop } = await searchParams;
    if (!isValidShop(shop)) redirect("/api/auth");

    return (
        <Page title="Settings" subtitle={shop} backAction={{ url: "/" }}>
            <SettingsForm />
        </Page>
    );
};

export default SettingsPage;
