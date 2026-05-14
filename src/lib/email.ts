import nodemailer from "nodemailer";
import { render } from "@react-email/render";

// Replies are sent via the merchant's own mail provider so customers see the
// store's address. Each Shop row stores SMTP credentials (encrypted at rest).
export type ShopSmtpConfig = {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromName: string;
    fromAddress: string;
};

const sendEmail = async (
    smtp: ShopSmtpConfig,
    to: string,
    subject: string,
    text: string,
    react: React.ReactElement,
    headers?: Record<string, string>
) => {
    const html = await render(react);

    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
    });

    return transporter.sendMail({
        from: `${smtp.fromName} <${smtp.fromAddress}>`,
        to,
        subject,
        text,
        html,
        headers,
    });
};

export default sendEmail;

export const verifySmtpConnection = async (
    smtp: ShopSmtpConfig
): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
    });
    await transporter.verify();
};

// Sends a real test email from the merchant to themselves. Used by the "Test
// & save" button so the merchant can confirm receipt in their inbox, not just
// that the connection authenticates.
export const sendSmtpTestEmail = async (
    smtp: ShopSmtpConfig
): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
    });
    await transporter.sendMail({
        from: `${smtp.fromName} <${smtp.fromAddress}>`,
        to: smtp.fromAddress,
        subject: "Valyn — outgoing email is working",
        text:
            "This is a test message sent by Valyn to confirm your outgoing email is configured correctly.\n\n" +
            "If you can read this, customers will receive your auto-replies from this address.\n\n" +
            "— Valyn",
    });
};
