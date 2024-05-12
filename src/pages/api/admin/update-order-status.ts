import { updateOrderStatus } from '@/service/firebase';
import orderCompletedTemplate from '@/templates/emails/completed';
import orderFailedTemplate from '@/templates/emails/failed';
import orderInprogressTemplate from '@/templates/emails/in-progress';
import newOrderTemplate from '@/templates/emails/new-order';
import orderCreatedTemplate from '@/templates/emails/order-created';
import transporter from '@/utils/nodemailer-transport';
import { NextApiRequest, NextApiResponse } from 'next';
import { Options } from 'nodemailer/lib/mailer';

const statusTemplateMap = {
    pending: {
        template: orderCreatedTemplate,
        subject: 'Your Order has been Taken',
    },
    inprogress: {
        template: orderInprogressTemplate,
        subject: 'Your Order is on the Way',
    },
    completed: {
        template: orderCompletedTemplate,
        subject: 'Your Order has been Completed',
    },
    failed: {
        template: orderFailedTemplate,
        subject: 'Your Order Failed',
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { status, orderId, user } = req.body;

    try {
        await updateOrderStatus(orderId, status);
        var mailOptions: Options = {
            from: process.env.NODEMAILER_SENDER,
            to: user.email,
            subject:
                statusTemplateMap[status as keyof typeof statusTemplateMap]
                    .subject,
            html: statusTemplateMap[
                status as keyof typeof statusTemplateMap
            ].template({ ...req.body, id: orderId }),
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, status });

        if (status === 'pending') {
            var mailOptionsAdmin: Options = {
                from: user.email,
                to: process.env.NODEMAILER_SENDER,
                subject: 'You have a new Order',
                html: newOrderTemplate({ ...req.body, id: orderId }),
            };
            transporter.sendMail(mailOptionsAdmin);
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Server error' });
    }
}
