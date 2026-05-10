import { redirect } from "next/navigation";
import { isValidShop } from "@/lib/shopify-domain";
import DashboardPageShell from "../_components/dashboard-page-shell";

type Props = {
    searchParams: Promise<{ shop?: string; host?: string; embedded?: string }>;
};

const Dashboard: React.FC<Props> = async ({ searchParams }) => {
    const { shop } = await searchParams;
    if (!isValidShop(shop)) redirect("/api/auth");

    return <DashboardPageShell shop={shop} />;
};

export default Dashboard;
