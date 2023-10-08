import { updateOrderStatus } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { status, orderId } = req.body;
    try {
        await updateOrderStatus(orderId, status);
        res.status(200).json({ success: true, status });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
