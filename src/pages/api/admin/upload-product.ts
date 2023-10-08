import { uploadProduct } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    req.body.price = parseFloat(req.body.price);
    req.body.quantity_in_stock = parseFloat(req.body.quantity_in_stock);
    try {
        const fullPath = await uploadProduct(
            req.body as Omit<ProductItem, 'created_at'>,
        );
        res.status(200).json({ fullPath, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
}
