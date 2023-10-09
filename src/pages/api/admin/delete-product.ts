import { deleteProduct } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { productId } = req.body;
    try {
        await deleteProduct(productId);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}
