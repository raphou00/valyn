import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export default createEnv({
    skipValidation: false,
    server: {
        NODE_ENV: z.enum(["development", "production"]).default("development"),
        APP_URL: z.string().min(1),

        AWS_REGION: z.string().min(1),
        AWS_ACCESS_KEY_ID: z.string().min(1),
        AWS_SECRET_ACCESS_KEY: z.string().min(1),

        RATE_LIMITS_TABLE_NAME: z.string().min(1),

        DATABASE_URL: z.string().min(1),

        SHOPIFY_API_KEY: z.string().min(1),
        SHOPIFY_API_SECRET: z.string().min(1),
        SHOPIFY_SCOPES: z.string().min(1),
        SHOPIFY_APP_URL: z.string().min(1),

        INBOUND_EMAIL_BUCKET: z.string().min(1),
        INBOUND_EMAIL_DOMAIN: z.string().min(1),
        INBOUND_SNS_TOPIC_ARN: z.string().min(1),

        SMTP_CREDS_KEY: z.string().min(1),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        APP_URL: process.env.APP_URL,

        AWS_REGION: process.env.AWS_REGION,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

        RATE_LIMITS_TABLE_NAME: process.env.RATE_LIMITS_TABLE_NAME,

        DATABASE_URL: process.env.DATABASE_URL,

        SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
        SHOPIFY_SCOPES: process.env.SHOPIFY_SCOPES,
        SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,

        INBOUND_EMAIL_BUCKET: process.env.INBOUND_EMAIL_BUCKET,
        INBOUND_EMAIL_DOMAIN: process.env.INBOUND_EMAIL_DOMAIN,
        INBOUND_SNS_TOPIC_ARN: process.env.INBOUND_SNS_TOPIC_ARN,

        SMTP_CREDS_KEY: process.env.SMTP_CREDS_KEY,
    },
});
