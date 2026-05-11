import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    devIndicators: false,
    serverExternalPackages: [
        "@aws-sdk/lib-dynamodb",
        "@aws-sdk/client-dynamodb",
        "@aws-sdk/client-s3",
        "mailparser",
        "nodemailer",
    ],
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};

export default nextConfig;
