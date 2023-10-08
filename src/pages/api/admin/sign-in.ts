import { appCookieName } from '@/config/app-config';
import { signInAdmin } from '@/service/firebase';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { email, password } = req.body;

    try {
        const userCredentials = await signInAdmin(email, password);
        res.setHeader(
            'Set-Cookie',
            serialize(appCookieName, await userCredentials.user.getIdToken(), {
                maxAge: 3 * 24 * 60, // three days,
                httpOnly: true,
                path: '/',
            }),
        );
        res.status(201).json({ success: true, user: userCredentials.user });
    } catch (error: any) {
        switch (error.code) {
            case 'auth/network-request-failed':
                res.status(503).json({
                    success: false,
                    message: 'Network Problem',
                });
                break;
            case 'auth/invalid-login-credentials':
                res.status(401).json({
                    success: false,
                    message: 'Incorrect credentials',
                });
                break;
            default:
                res.status(500).json({
                    success: false,
                    mesage: error.message,
                });
                break;
        }
    }
}
