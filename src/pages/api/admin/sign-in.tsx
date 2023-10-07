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
            serialize(
                'daat-foods-auth-token',
                await userCredentials.user.getIdToken(),
                {
                    maxAge: 3 * 24 * 60, // three days,
                    httpOnly: true,
                    path: '/admin',
                },
            ),
        );
        res.status(201).json({ success: true, user: userCredentials.user });
    } catch (error: any) {
        if (error.code === 'auth/invalid-login-credentials') {
            res.status(401).json({
                success: false,
                message: 'Incorrect credentials',
            });
            return;
        }
        res.status(500).json({
            success: false,
            mesage: error.message,
        });
    }
}
