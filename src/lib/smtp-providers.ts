// Known-good SMTP settings for the providers most merchants use. Lets the UI
// hide host/port/TLS and ask only for email + app password.

export type SmtpProviderKey = "gmail" | "outlook" | "other";

export type SmtpProvider = {
    key: SmtpProviderKey;
    label: string;
    host: string;
    port: number;
    secure: boolean;
};

export const SMTP_PROVIDERS: Record<
    Exclude<SmtpProviderKey, "other">,
    SmtpProvider
> = {
    gmail: {
        key: "gmail",
        label: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
    },
    outlook: {
        key: "outlook",
        label: "Outlook / Microsoft 365",
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: true,
    },
};

export const detectSmtpProvider = (
    host: string | null | undefined
): SmtpProviderKey => {
    if (!host) return "other";
    const h = host.toLowerCase();
    if (h === SMTP_PROVIDERS.gmail.host) return "gmail";
    if (h === SMTP_PROVIDERS.outlook.host) return "outlook";
    return "other";
};
