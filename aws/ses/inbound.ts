import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Provisions SES inbound email receiving:
//   - S3 bucket for raw MIME bodies
//   - SNS topic the app subscribes to (HTTPS) for arrival notifications
//   - SES receipt rule set + rule that writes to S3 and publishes to SNS
//
// MX records for the inbound domain must point at:
//   inbound-smtp.<region>.amazonaws.com (priority 10)
// SES inbound is only available in us-east-1, us-west-2, eu-west-1.
//
// Inputs from Pulumi config:
//   inbound:domain      e.g. "inbound.valyn.app" (must be a subdomain
//                       of the Route53 hosted zone)
//   inbound:zoneName    Route53 hosted-zone apex, e.g. "valyn.app"
//   inbound:webhookUrl  HTTPS URL the app exposes for SNS notifications,
//                       e.g. "https://valyn.app/api/webhooks/inbound-email"

const provision = () => {
    const stack = pulumi.getStack();
    const config = new pulumi.Config("inbound");
    const domain = config.require("domain");
    const zoneName = config.require("zoneName");
    const webhookUrl = config.require("webhookUrl");
    const region = aws.config.requireRegion();

    const bucket = new aws.s3.BucketV2(`valyn-inbound-emails-${stack}`, {
        bucket: `valyn-inbound-emails-${stack}`,
        forceDestroy: stack !== "prod",
    });

    new aws.s3.BucketLifecycleConfigurationV2(
        `valyn-inbound-emails-lifecycle-${stack}`,
        {
            bucket: bucket.id,
            rules: [
                {
                    id: "expire-30d",
                    status: "Enabled",
                    expiration: { days: 30 },
                    filter: {},
                },
            ],
        }
    );

    const topic = new aws.sns.Topic(`valyn-inbound-${stack}`, {
        name: `valyn-inbound-${stack}`,
    });

    new aws.sns.TopicSubscription(`valyn-inbound-sub-${stack}`, {
        topic: topic.arn,
        protocol: "https",
        endpoint: webhookUrl,
        endpointAutoConfirms: true,
        rawMessageDelivery: false,
    });

    new aws.s3.BucketPolicy(`valyn-inbound-emails-policy-${stack}`, {
        bucket: bucket.id,
        policy: pulumi
            .all([bucket.arn, pulumi.output(aws.getCallerIdentity({}))])
            .apply(([arn, caller]) =>
                JSON.stringify({
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Sid: "AllowSESPuts",
                            Effect: "Allow",
                            Principal: { Service: "ses.amazonaws.com" },
                            Action: "s3:PutObject",
                            Resource: `${arn}/*`,
                            Condition: {
                                StringEquals: {
                                    "AWS:SourceAccount": caller.accountId,
                                },
                            },
                        },
                    ],
                })
            ),
    });

    const ruleSet = new aws.ses.ReceiptRuleSet(`valyn-rule-set-${stack}`, {
        ruleSetName: `valyn-rule-set-${stack}`,
    });

    new aws.ses.ActiveReceiptRuleSet(`valyn-active-rule-set-${stack}`, {
        ruleSetName: ruleSet.ruleSetName,
    });

    new aws.ses.ReceiptRule(`valyn-inbound-rule-${stack}`, {
        ruleSetName: ruleSet.ruleSetName,
        name: `valyn-inbound-${stack}`,
        enabled: true,
        scanEnabled: true,
        recipients: [domain],
        s3Actions: [
            {
                bucketName: bucket.bucket,
                objectKeyPrefix: "incoming/",
                position: 1,
            },
        ],
        snsActions: [
            {
                topicArn: topic.arn,
                position: 2,
            },
        ],
    });

    // Route53 + SES domain verification + MX. The hosted zone must already
    // exist for `zoneName`.
    const zone = aws.route53.getZoneOutput({ name: zoneName });

    const identity = new aws.ses.DomainIdentity(
        `valyn-inbound-identity-${stack}`,
        { domain }
    );

    new aws.route53.Record(`valyn-inbound-verification-${stack}`, {
        zoneId: zone.zoneId,
        name: pulumi.interpolate`_amazonses.${domain}`,
        type: "TXT",
        ttl: 600,
        records: [identity.verificationToken],
    });

    new aws.ses.DomainIdentityVerification(
        `valyn-inbound-identity-verify-${stack}`,
        { domain: identity.domain }
    );

    new aws.route53.Record(`valyn-inbound-mx-${stack}`, {
        zoneId: zone.zoneId,
        name: domain,
        type: "MX",
        ttl: 600,
        records: [`10 inbound-smtp.${region}.amazonaws.com`],
    });

    return {
        inboundBucketName: bucket.bucket,
        inboundTopicArn: topic.arn,
        inboundDomain: domain,
    };
};

export default provision;
