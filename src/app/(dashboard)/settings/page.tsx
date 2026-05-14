import { isValidShop } from "@/lib/shopify-domain";
import SettingsPageShell from "../_components/settings-page-shell";

type Props = {
    searchParams: Promise<{ shop?: string; host?: string }>;
};

const SettingsPage: React.FC<Props> = async ({ searchParams }) => {
    const { shop } = await searchParams;
    return (
        <SettingsPageShell shop={isValidShop(shop) ? shop : undefined} />
    );
};

export default SettingsPage;
