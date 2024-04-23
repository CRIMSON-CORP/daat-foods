import orderCompletedTemplate from '@/templates/emails/completed';
import transporter from '@/utils/nodemailer-transport';
import { NextApiRequest, NextApiResponse } from 'next';
import { Options } from 'nodemailer/lib/mailer';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { user } = req.body as Order;

    try {
        var mailOptions: Options = {
            from: process.env.NODEMAILER_SENDER,
            to: user.email,
            subject: 'Your Order has been Completed',
            html: orderCompletedTemplate(req.body),
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, error });
    }
}
