import { ImageResponse } from "next/og";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

const Image = () =>
    new ImageResponse(
        <div
            style={{
                alignItems: "center",
                background: "#f8fafc",
                color: "#0f172a",
                display: "flex",
                fontFamily: "Inter, Arial, sans-serif",
                height: "100%",
                justifyContent: "center",
                padding: 72,
                width: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 32,
                    width: "100%",
                }}
            >
                <div
                    style={{
                        color: "#2563eb",
                        fontSize: 36,
                        fontWeight: 800,
                    }}
                >
                    Valyn
                </div>
                <div
                    style={{
                        fontSize: 78,
                        fontWeight: 800,
                        lineHeight: 1.03,
                        maxWidth: 900,
                    }}
                >
                    Shopify order support automation
                </div>
                <div
                    style={{
                        color: "#475569",
                        fontSize: 34,
                        lineHeight: 1.25,
                        maxWidth: 900,
                    }}
                >
                    Automatically answer repetitive order tracking emails using
                    Shopify order data.
                </div>
            </div>
        </div>,
        size
    );

export default Image;
