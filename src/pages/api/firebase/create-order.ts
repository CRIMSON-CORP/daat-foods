import { createOrder } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const order = req.body;

    try {
        const docRefId = await createOrder(order);
        res.status(201).json({ success: true, refId: docRefId });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}
