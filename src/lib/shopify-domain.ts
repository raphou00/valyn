export const SHOP_REGEX = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;

export const isValidShop = (shop: string | null | undefined): shop is string =>
    typeof shop === "string" && SHOP_REGEX.test(shop);
