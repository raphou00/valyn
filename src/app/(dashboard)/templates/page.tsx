import { isValidShop } from "@/lib/shopify-domain";
import TemplatesPageShell from "../_components/templates-page-shell";

type Props = {
    searchParams: Promise<{ shop?: string; host?: string }>;
};

const TemplatesPage: React.FC<Props> = async ({ searchParams }) => {
    const { shop } = await searchParams;
    return (
        <TemplatesPageShell shop={isValidShop(shop) ? shop : undefined} />
    );
};

export default TemplatesPage;
