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

export const verifySmtpConnection = async (smtp: ShopSmtpConfig): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
    });
    await transporter.verify();
};
