import { restockProduct } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { amount, productId } = req.body;

    try {
        await restockProduct(productId as string, parseInt(amount as string));
        res.status(201).json({ success: true });
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
