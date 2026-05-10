import { redirect } from "next/navigation";
import { isValidShop } from "@/lib/shopify-domain";
import SettingsPageShell from "../_components/settings-page-shell";

type Props = {
    searchParams: Promise<{ shop?: string; host?: string }>;
};

const SettingsPage: React.FC<Props> = async ({ searchParams }) => {
    const { shop } = await searchParams;
    if (!isValidShop(shop)) redirect("/api/auth");

    return <SettingsPageShell shop={shop} />;
};

export default SettingsPage;
