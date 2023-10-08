import { updateProduct } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        req.body.price = parseFloat(req.body.price);
        req.body.quantity_in_stock = parseFloat(req.body.quantity_in_stock);
        await updateProduct(req.body as ProductItem);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
}
