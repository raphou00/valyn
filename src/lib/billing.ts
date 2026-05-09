import env from "./env";
import { PLAN, isTestCharge } from "@/config/billing";

const API_VERSION = "2024-10";

type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

const adminGql = async <T,>(
    shopDomain: string,
    accessToken: string,
    query: string,
    variables: Record<string, unknown>
): Promise<T> => {
    const res = await fetch(
        `https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            body: JSON.stringify({ query, variables }),
        }
    );
    const json = (await res.json()) as GqlResponse<T>;
    if (json.errors?.length) {
        throw new Error(json.errors.map((e) => e.message).join("; "));
    }
    if (!json.data) throw new Error("empty admin response");
    return json.data;
};

type CreateResult = {
    appSubscriptionCreate: {
        userErrors: { field: string[]; message: string }[];
        confirmationUrl: string;
        appSubscription: { id: string };
    };
};

export const createAppSubscription = async (
    shopDomain: string,
    accessToken: string
): Promise<{ confirmationUrl: string; subscriptionId: string }> => {
    const returnUrl = `${env.SHOPIFY_APP_URL}/api/billing/callback?shop=${encodeURIComponent(shopDomain)}`;

    const data = await adminGql<CreateResult>(
        shopDomain,
        accessToken,
        `mutation Create(
            $name: String!,
            $returnUrl: URL!,
            $trialDays: Int!,
            $test: Boolean!,
            $lineItems: [AppSubscriptionLineItemInput!]!
        ) {
            appSubscriptionCreate(
                name: $name,
                returnUrl: $returnUrl,
                trialDays: $trialDays,
                test: $test,
                lineItems: $lineItems
            ) {
                userErrors { field message }
                confirmationUrl
                appSubscription { id }
            }
        }`,
        {
            name: PLAN.name,
            returnUrl,
            trialDays: PLAN.trialDays,
            test: isTestCharge,
            lineItems: [
                {
                    plan: {
                        appRecurringPricingDetails: {
                            price: {
                                amount: PLAN.amount,
                                currencyCode: PLAN.currency,
                            },
                            interval: PLAN.interval,
                        },
                    },
                },
            ],
        }
    );

    const errs = data.appSubscriptionCreate.userErrors;
    if (errs.length) throw new Error(errs.map((e) => e.message).join("; "));

    return {
        confirmationUrl: data.appSubscriptionCreate.confirmationUrl,
        subscriptionId: data.appSubscriptionCreate.appSubscription.id,
    };
};

export type FetchedSubscription = {
    id: string;
    status:
        | "PENDING"
        | "ACTIVE"
        | "CANCELLED"
        | "DECLINED"
        | "EXPIRED"
        | "FROZEN";
    trialDays: number;
    currentPeriodEnd: string | null;
    createdAt: string;
};

export const fetchAppSubscription = async (
    shopDomain: string,
    accessToken: string,
    subscriptionGid: string
): Promise<FetchedSubscription | null> => {
    const data = await adminGql<{
        node:
            | (FetchedSubscription & { __typename: "AppSubscription" })
            | null;
    }>(
        shopDomain,
        accessToken,
        `query Sub($id: ID!) {
            node(id: $id) {
                ... on AppSubscription {
                    id
                    status
                    trialDays
                    currentPeriodEnd
                    createdAt
                }
            }
        }`,
        { id: subscriptionGid }
    );
    if (!data.node) return null;
    const { id, status, trialDays, currentPeriodEnd, createdAt } = data.node;
    return { id, status, trialDays, currentPeriodEnd, createdAt };
};

export const isSubscriptionActive = (
    status: string | null | undefined
): boolean => status === "ACTIVE";
