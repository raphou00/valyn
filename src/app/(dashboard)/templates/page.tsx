import { redirect } from "next/navigation";
import { isValidShop } from "@/lib/shopify-domain";
import TemplatesPageShell from "../_components/templates-page-shell";

type Props = {
    searchParams: Promise<{ shop?: string; host?: string }>;
};

const TemplatesPage: React.FC<Props> = async ({ searchParams }) => {
    const { shop } = await searchParams;
    if (!isValidShop(shop)) redirect("/api/auth");

    return <TemplatesPageShell shop={shop} />;
};

export default TemplatesPage;
