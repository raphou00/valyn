import keys from "./app/keys.js";
import rateLimit from "./dynamodb/rate-limits.js";
import inbound from "./ses/inbound.js";

const appKey = keys();
export const accessKeyId = appKey.id;
export const secretAccessKey = appKey.secret;

export const { rateLimitTableName } = rateLimit();
export const { inboundBucketName, inboundTopicArn, inboundDomain } = inbound();
