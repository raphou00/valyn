import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";
import env from "./env";
import logger from "./logger";

const client = new DynamoDBClient({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = env.RATE_LIMITS_TABLE_NAME;

const GLOBAL_RATE_LIMIT = {
    maxRequests: 200,
    windowSeconds: 60,
};

const checkRateLimit = async (
    identifier: string,
    options?: { maxRequests?: number; windowSeconds?: number }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> => {
    const maxRequests = options?.maxRequests ?? GLOBAL_RATE_LIMIT.maxRequests;
    const windowSeconds =
        options?.windowSeconds ?? GLOBAL_RATE_LIMIT.windowSeconds;
    const now = Math.floor(Date.now() / 1000);
    const windowKey = `${identifier}:${Math.floor(now / windowSeconds)}`;
    const resetAt = (Math.floor(now / windowSeconds) + 1) * windowSeconds;

    try {
        const { Item } = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id: windowKey },
            })
        );

        const currentCount = Item?.count || 0;

        if (currentCount >= maxRequests) {
            return { allowed: false, remaining: 0, resetAt };
        }

        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: {
                    id: windowKey,
                    count: currentCount + 1,
                    ttl: now + windowSeconds + 86400,
                },
            })
        );

        return {
            allowed: true,
            remaining: maxRequests - currentCount - 1,
            resetAt,
        };
    } catch (error) {
        logger.error("rate limit check failed", {
            error: (error as Error).message,
        });
        return { allowed: true, remaining: maxRequests, resetAt };
    }
};

export default checkRateLimit;
