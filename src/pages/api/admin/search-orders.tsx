import { searchOrders } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { search_queary } = req.query;
    try {
        const orders = await searchOrders(search_queary as string);
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
