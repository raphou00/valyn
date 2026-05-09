"use client";

import { useCallback } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

export const useAuthedFetch = () => {
    const shopify = useAppBridge();
    return useCallback(
        async (input: string, init: RequestInit = {}) => {
            const send = async () => {
                const token = await shopify.idToken();
                return fetch(input, {
                    ...init,
                    headers: {
                        ...(init.headers ?? {}),
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            };
            const res = await send();
            // App Bridge will mint a fresh token on the second call; one
            // retry is enough to recover from a token that expired between
            // the time the page loaded and the time the user clicked.
            if (res.status === 401) return send();
            return res;
        },
        [shopify]
    );
};
