import { redirect } from "next/navigation";
import { Page } from "@shopify/polaris";
import { isValidShop } from "@/lib/shopify";
import DashboardView from "./_components/dashboard-view";

type Props = {
    searchParams: Promise<{ shop?: string; host?: string; embedded?: string }>;
};

const Dashboard: React.FC<Props> = async ({ searchParams }) => {
    const { shop } = await searchParams;
    if (!isValidShop(shop)) redirect("/api/auth");

    return (
        <Page title="Valyn" subtitle={shop}>
            <DashboardView />
        </Page>
    );
};

export default Dashboard;
