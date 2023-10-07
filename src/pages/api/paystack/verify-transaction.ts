import { NextApiRequest, NextApiResponse } from 'next';

import { verifyTransaction } from '@/service/paystack';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { reference } = req.body;

    try {
        const data = await verifyTransaction(reference);
        if (data.data.status === 'success') {
            res.status(200).json({ success: true, data });
        } else throw new Error('Failed to Verify transaction');
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
