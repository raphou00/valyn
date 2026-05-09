import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import env from "./env";

const shopify = shopifyApi({
    apiKey: env.SHOPIFY_API_KEY,
    apiSecretKey: env.SHOPIFY_API_SECRET,
    scopes: env.SHOPIFY_SCOPES.split(",").map((s) => s.trim()),
    hostName: new URL(env.SHOPIFY_APP_URL).host,
    apiVersion: ApiVersion.January26,
    isEmbeddedApp: true,
});

export default shopify;

export const SHOP_REGEX = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;

export const isValidShop = (shop: string | null | undefined): shop is string =>
    typeof shop === "string" && SHOP_REGEX.test(shop);
