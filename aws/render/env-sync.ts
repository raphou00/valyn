import * as pulumi from "@pulumi/pulumi";
import * as command from "@pulumi/command";

// Reads app secrets from the repo-root .env (loaded by aws/index.ts via
// dotenv) and PUTs the full env-var set to the Render service. PUT replaces
// the entire envVars set, so anything not listed here gets removed — this
// list is the single source of truth for the deployed app's environment.
//
// Required in .env (local-only deploys):
//   RENDER_API_KEY, RENDER_SERVICE_ID
//   APP_URL                   (also used as SHOPIFY_APP_URL)
//   SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_SCOPES
//   DATABASE_URL
//   SMTP_CREDS_KEY

type Inputs = {
    awsRegion: pulumi.Input<string>;
    awsAccessKeyId: pulumi.Input<string>;
    awsSecretAccessKey: pulumi.Input<string>;
    rateLimitTableName: pulumi.Input<string>;
    inboundBucketName: pulumi.Input<string>;
    inboundTopicArn: pulumi.Input<string>;
    inboundDomain: pulumi.Input<string>;
};

const must = (k: string): string => {
    const v = process.env[k];
    if (!v) throw new Error(`Missing ${k} in .env`);
    return v;
};

const provision = (inputs: Inputs) => {
    const stack = pulumi.getStack();

    const apiKey = must("RENDER_API_KEY");
    const serviceId = must("RENDER_SERVICE_ID");

    const appUrl = must("APP_URL");
    const shopifyApiKey = must("SHOPIFY_API_KEY");
    const shopifyApiSecret = must("SHOPIFY_API_SECRET");
    const shopifyScopes = must("SHOPIFY_SCOPES");
    const databaseUrl = must("DATABASE_URL");
    const smtpCredsKey = must("SMTP_CREDS_KEY");

    const envBody = pulumi
        .all([
            inputs.awsRegion,
            inputs.awsAccessKeyId,
            inputs.awsSecretAccessKey,
            inputs.rateLimitTableName,
            inputs.inboundBucketName,
            inputs.inboundTopicArn,
            inputs.inboundDomain,
        ])
        .apply(([region, akid, sak, rateTable, bucket, topicArn, domain]) =>
            JSON.stringify(
                [
                    ["NODE_ENV", "production"],
                    ["APP_URL", appUrl],
                    ["SHOPIFY_APP_URL", appUrl],
                    ["SHOPIFY_API_KEY", shopifyApiKey],
                    ["SHOPIFY_API_SECRET", shopifyApiSecret],
                    ["SHOPIFY_SCOPES", shopifyScopes],
                    ["DATABASE_URL", databaseUrl],
                    ["SMTP_CREDS_KEY", smtpCredsKey],
                    ["AWS_REGION", region],
                    ["AWS_ACCESS_KEY_ID", akid],
                    ["AWS_SECRET_ACCESS_KEY", sak],
                    ["RATE_LIMITS_TABLE_NAME", rateTable],
                    ["INBOUND_EMAIL_BUCKET", bucket],
                    ["INBOUND_EMAIL_DOMAIN", domain],
                    ["INBOUND_SNS_TOPIC_ARN", topicArn],
                ].map(([key, value]) => ({ key, value }))
            )
        );

    // Trigger a re-run whenever the body changes.
    const sync = new command.local.Command(`valyn-render-env-${stack}`, {
        triggers: [envBody],
        environment: { RENDER_API_KEY: apiKey, RENDER_SERVICE_ID: serviceId },
        // Body via stdin keeps secrets out of `ps` listings.
        stdin: envBody,
        create: `curl -fsS -X PUT \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Content-Type: application/json" \
            -d @- \
            "https://api.render.com/v1/services/$RENDER_SERVICE_ID/env-vars"`,
        // Intentionally no `delete`: tearing down the stack shouldn't wipe
        // production env vars on Render.
    });

    return { renderEnvSyncId: sync.id };
};

export default provision;
