import { defineConfig } from "vitest/config";
import path from "node:path";

// 32 zero bytes, base64-encoded — valid SMTP_CREDS_KEY format.
const TEST_SMTP_KEY = Buffer.alloc(32).toString("base64");

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        // env.ts validates with @t3-oss/env-nextjs at module load. Tests need
        // every key set, even with throwaway values.
        env: {
            NODE_ENV: "development",
            APP_URL: "http://localhost:3000",
            AWS_REGION: "us-east-1",
            AWS_ACCESS_KEY_ID: "test",
            AWS_SECRET_ACCESS_KEY: "test",
            RATE_LIMITS_TABLE_NAME: "test",
            DATABASE_URL: "postgres://test",
            SHOPIFY_API_KEY: "test-api-key",
            SHOPIFY_API_SECRET: "test-api-secret-must-be-long",
            SHOPIFY_SCOPES: "read_orders,read_fulfillments",
            SHOPIFY_APP_URL: "http://localhost:3000",
            INBOUND_EMAIL_BUCKET: "test-bucket",
            INBOUND_EMAIL_DOMAIN: "inbound.test",
            INBOUND_SNS_TOPIC_ARN: "arn:aws:sns:us-east-1:1:test",
            SMTP_CREDS_KEY: TEST_SMTP_KEY,
        },
    },
});
