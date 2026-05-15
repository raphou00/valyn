import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const provision = () => {
    const stack = pulumi.getStack();

    const appUser = new aws.iam.User(`valyn-app-user-${stack}`, {
        name: `valyn-app-${stack}`,
    });

    new aws.iam.UserPolicy(`valyn-app-policy-${stack}`, {
        user: appUser.name,
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "DynamoRateLimit",
                    Effect: "Allow",
                    Action: [
                        "dynamodb:GetItem",
                        "dynamodb:PutItem",
                        "dynamodb:UpdateItem",
                    ],
                    Resource: "*",
                },
                {
                    Sid: "InboundEmailRead",
                    Effect: "Allow",
                    Action: ["s3:GetObject"],
                    Resource: "*",
                },
                {
                    // WISMO intent classification. InvokeModel only — no
                    // training, no model management. Resource "*" because the
                    // model id is configurable via BEDROCK_MODEL_ID and may
                    // be a cross-region inference profile ARN.
                    Sid: "BedrockClassify",
                    Effect: "Allow",
                    Action: ["bedrock:InvokeModel"],
                    Resource: "*",
                },
            ],
        }),
    });

    const appKey = new aws.iam.AccessKey(`valyn-app-key-${stack}`, {
        user: appUser.name,
    });

    return appKey;
};

export default provision;
