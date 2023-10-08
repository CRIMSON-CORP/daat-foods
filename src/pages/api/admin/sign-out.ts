import { appCookieName } from '@/config/app-config';
import { signOutAdmin } from '@/service/firebase';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        await signOutAdmin();
        res.setHeader(
            'Set-Cookie',
            serialize(appCookieName, 'deleted', {
                maxAge: -1,
                httpOnly: true,
                path: '/',
            }),
        );
        res.status(200).json({ status: true });
    } catch (error) {
        res.status(500).json({ status: false });
    }
}
