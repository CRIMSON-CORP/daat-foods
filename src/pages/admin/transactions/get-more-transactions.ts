import { getPaginatedTransactions } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { start_at, end_at } = req.query;
    try {
        const orders = await getPaginatedTransactions(
            Number(start_at),
            Number(end_at),
        );
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
