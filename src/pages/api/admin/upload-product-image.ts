import { uploadImage } from '@/service/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const { imageBase64, filename } = req.body;

        const downloadUrl = await uploadImage(imageBase64, filename);
        res.status(200).json({ downloadUrl, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
}
