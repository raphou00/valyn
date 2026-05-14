// Turn raw nodemailer / SMTP error strings into something a non-technical
// merchant can act on. Used by smtp/test route and by sendReplyForLog before
// writing EmailLog.errorMessage.

const RULES: { match: RegExp; message: string }[] = [
    {
        match: /ECONNREFUSED/i,
        message:
            "Couldn't connect to your mail server. Check your host and port.",
    },
    {
        match: /ETIMEDOUT|ESOCKETTIMEDOUT|timeout/i,
        message:
            "Connection timed out. Your mail server may be blocking the connection.",
    },
    {
        match: /\bEAUTH\b|535|invalid login|authentication failed/i,
        message:
            "Wrong email or password. Double-check your app password — Gmail and Outlook require an app password, not your normal one.",
    },
    {
        match: /CERT_HAS_EXPIRED|self.signed certificate|unable to verify the first certificate|SSL/i,
        message:
            "Your mail server has an SSL issue. Try turning off TLS or contact your host.",
    },
    {
        match: /ENOTFOUND|getaddrinfo/i,
        message:
            "We couldn't find that mail server. Double-check the host name.",
    },
    {
        match: /smtp not configured/i,
        message:
            "You haven't set up outgoing email yet. Go to Settings → Outgoing email.",
    },
];

export const humanizeSmtpError = (raw: string | null | undefined): string => {
    if (!raw) return "Something went wrong while sending the email.";
    for (const r of RULES) if (r.match.test(raw)) return r.message;
    return "Sending failed. Check your outgoing email settings and try again.";
};
