import type { Metadata } from "next";
import { GenericContentPage } from "../_components/content-page";
import { comparisonPages } from "../_lib/content";
import { marketingMetadata } from "../_lib/metadata";

export const metadata: Metadata = marketingMetadata({
    title: "Simple Gorgias Alternative for Shopify Order Support | Valyn",
    description:
        "Valyn is a focused alternative for Shopify merchants who want simple order support automation without a full helpdesk.",
    path: "/gorgias-alternative",
});

const Page = () => (
    <GenericContentPage
        eyebrow="Comparison"
        title={comparisonPages.gorgias.title}
        description={comparisonPages.gorgias.description}
        sections={comparisonPages.gorgias.sections}
    >
        <div className="mt-12 overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
            <table className="table">
                <thead>
                    <tr>
                        <th>Need</th>
                        <th>Valyn</th>
                        <th>Full helpdesk</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Primary workflow</td>
                        <td>Automated order tracking replies</td>
                        <td>Broad customer service operations</td>
                    </tr>
                    <tr>
                        <td>Best fit</td>
                        <td>Merchants with repetitive WISMO emails</td>
                        <td>Teams managing many support channels</td>
                    </tr>
                    <tr>
                        <td>Setup focus</td>
                        <td>Shopify order lookup and SMTP sending</td>
                        <td>Ticketing, agents, channels, rules</td>
                    </tr>
                    <tr>
                        <td>Replacement claim</td>
                        <td>Not a full helpdesk replacement</td>
                        <td>Built as a full helpdesk</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </GenericContentPage>
);

export default Page;
