import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import * as aws from "@pulumi/aws";
import keys from "./app/keys.js";
import rateLimit from "./dynamodb/rate-limits.js";
import inbound from "./ses/inbound.js";
import renderEnvSync from "./render/env-sync.js";

const appKey = keys();
export const accessKeyId = appKey.id;
export const secretAccessKey = appKey.secret;

export const { rateLimitTableName } = rateLimit();

export const { inboundBucketName, inboundTopicArn, inboundDomain } = inbound();

const region = aws.config.requireRegion();

renderEnvSync({
    awsRegion: region,
    awsAccessKeyId: accessKeyId,
    awsSecretAccessKey: secretAccessKey,
    rateLimitTableName,
    inboundBucketName,
    inboundTopicArn,
    inboundDomain,
});
