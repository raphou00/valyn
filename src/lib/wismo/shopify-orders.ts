// Minimal Shopify Admin GraphQL client for the WISMO pipeline.

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

export type WismoOrder = {
    id: string;
    name: string;
    email: string | null;
    fulfillmentStatus: string | null;
    financialStatus: string | null;
    tracking: {
        number: string | null;
        url: string | null;
        company: string | null;
    } | null;
};

const ORDER_FIELDS = `
    id
    name
    email
    displayFulfillmentStatus
    displayFinancialStatus
    fulfillments(first: 1) {
        trackingInfo(first: 1) {
            number
            url
            company
        }
    }
`;

type RawOrder = {
    id: string;
    name: string;
    email: string | null;
    displayFulfillmentStatus: string | null;
    displayFinancialStatus: string | null;
    fulfillments: {
        trackingInfo: {
            number: string | null;
            url: string | null;
            company: string | null;
        }[];
    }[];
};

const normalize = (o: RawOrder): WismoOrder => {
    const t = o.fulfillments[0]?.trackingInfo[0] ?? null;
    return {
        id: o.id,
        name: o.name,
        email: o.email,
        fulfillmentStatus: o.displayFulfillmentStatus,
        financialStatus: o.displayFinancialStatus,
        tracking:
            t ?
                { number: t.number, url: t.url, company: t.company }
            :   null,
    };
};

export const findOrderByName = async (
    shopDomain: string,
    accessToken: string,
    name: string
): Promise<WismoOrder | null> => {
    const data = await adminGql<{ orders: { nodes: RawOrder[] } }>(
        shopDomain,
        accessToken,
        `query OrderByName($q: String!) {
            orders(first: 1, query: $q) { nodes { ${ORDER_FIELDS} } }
        }`,
        { q: `name:${name}` }
    );
    const node = data.orders.nodes[0];
    return node ? normalize(node) : null;
};

export const findRecentOrdersByEmail = async (
    shopDomain: string,
    accessToken: string,
    email: string,
    limit = 5
): Promise<WismoOrder[]> => {
    const data = await adminGql<{ orders: { nodes: RawOrder[] } }>(
        shopDomain,
        accessToken,
        `query OrdersByEmail($q: String!, $first: Int!) {
            orders(first: $first, query: $q, sortKey: PROCESSED_AT, reverse: true) {
                nodes { ${ORDER_FIELDS} }
            }
        }`,
        { q: `email:${email}`, first: limit }
    );
    return data.orders.nodes.map(normalize);
};
