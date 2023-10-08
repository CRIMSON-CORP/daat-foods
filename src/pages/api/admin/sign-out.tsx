import { appCookieName } from '@/config/app-config';
import { signOutAdmin } from '@/service/firebase';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    res: NextApiRequest,
    req: NextApiResponse,
) {
    try {
        await signOutAdmin();
        req.setHeader(
            'Set-Cookie',
            serialize(appCookieName, 'deleted', {
                maxAge: -1,
                httpOnly: true,
                path: '/',
            }),
        );
        req.status(200).json({ status: true });
    } catch (error) {
        req.status(500).json({ status: false });
    }
}
