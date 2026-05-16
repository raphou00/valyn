import type { MetadataRoute } from "next";

// Generates /manifest.webmanifest. Icons already live in /public.
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Valyn",
        short_name: "Valyn",
        description:
            'Automated "Where is my order?" support for Shopify stores.',
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
            {
                src: "/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
