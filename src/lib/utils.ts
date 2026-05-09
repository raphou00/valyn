import axios, { type ResponseType } from "axios";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import type { ActionsState } from "./types";

export const cn = (...args: ClassValue[]): string | undefined =>
    twMerge(clsx(args));

// Adapt a `setX(null)` setter to a `setIsOpen(boolean)`-style modal API:
// when the modal closes (next === false), the target state is cleared.
// Use as: <Modal setIsOpen={closingSetter(setRenameTarget)} />
import type { Dispatch, SetStateAction } from "react";

export const closingSetter =
    <T>(
        setter: Dispatch<SetStateAction<T | null>>
    ): Dispatch<SetStateAction<boolean>> =>
    (value) => {
        const next = typeof value === "function" ? value(true) : value;
        if (!next) setter(null);
    };

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const requestAPI = async <T>(
    method: string,
    url: string,
    body: unknown = null,
    headers: Record<string, string> = {},
    responseType: ResponseType = "json"
): Promise<ActionsState<T>> => {
    const isFormData = body instanceof FormData;

    const res = await axios.request<ActionsState<T>>({
        method,
        url,
        data: body || null,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
        responseType: responseType || "json",
    });

    const data = res.data;

    if (responseType !== "json") {
        return data;
    }

    if (!data.success && data.message) {
        toast.error(data.message!);
    }

    if (data.redirect) {
        window.location.href = data.redirect;
    }

    return data;
};

export const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return [
        h > 0 ? h.toString().padStart(2, "0") : null,
        m.toString().padStart(2, "0"),
        s.toString().padStart(2, "0"),
    ]
        .filter(Boolean)
        .join(":");
};

export const humanizeDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
};

export const formatAge = (date: Date): string => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
};

export const formatBytes = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
    return `${(n / 1024 ** 3).toFixed(2)} GB`;
};
