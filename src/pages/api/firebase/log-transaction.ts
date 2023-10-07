import { addTransactionRecord } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const transaction = req.body;

    try {
        await addTransactionRecord(transaction);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}
