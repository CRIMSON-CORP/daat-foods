import newContactRequest from '@/templates/emails/contact';
import transporter from '@/utils/nodemailer-transport';
import { NextApiRequest, NextApiResponse } from 'next';
import { Options } from 'nodemailer/lib/mailer';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { email } = req.body;

    try {
        var mailOptionsAdmin: Options = {
            from: email,
            to: process.env.NODEMAILER_SENDER,
            subject: 'You have a Contact Request',
            html: newContactRequest({ ...req.body }),
        };
        transporter.sendMail(mailOptionsAdmin);
        res.status(200).json({
            success: true,
            message: 'Message Sent! - Thank you for contacting us!',
        });
    } catch (error: any) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: `Failed to send message ${error.message}`,
        });
    }
}
