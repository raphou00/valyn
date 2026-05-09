import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { simpleParser, type ParsedMail } from "mailparser";
import env from "./env";

const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

// SES + S3 action stores raw MIME under <prefix><messageId>. The SNS
// notification payload `mail.messageId` matches the S3 object key (with the
// receipt-rule prefix prepended).
export const fetchAndParseEmail = async (
    bucket: string,
    key: string
): Promise<ParsedMail> => {
    const res = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    if (!res.Body) throw new Error(`Empty body for s3://${bucket}/${key}`);
    const bytes = await res.Body.transformToByteArray();
    return simpleParser(Buffer.from(bytes));
};

// Recipients are addressed as wismo+<shopId>@<INBOUND_EMAIL_DOMAIN>. Extract
// the shopId from a To: header value.
export const extractShopId = (recipient: string): string | null => {
    const match = recipient.match(/wismo\+([^@]+)@/i);
    return match ? match[1] : null;
};
