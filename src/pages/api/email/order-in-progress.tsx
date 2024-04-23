import orderInprogressTemplate from '@/templates/emails/in-progress';
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
            subject: 'Your Order is in progress',
            html: orderInprogressTemplate(req.body),
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, error });
    }
}
