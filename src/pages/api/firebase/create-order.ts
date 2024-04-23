import { createOrder } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const order = req.body;

    try {
        const doc = await createOrder(order);
        res.status(201).json({ success: true, ...doc });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}
