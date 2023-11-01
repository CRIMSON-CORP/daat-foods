import { signInAdmin } from '@/service/firebase';
import { UserCredential } from 'firebase/auth';
import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';

export const NextAuthOptions: AuthOptions = {
    providers: [
        Credentials({
            name: 'admin-login',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (
                    credentials?.email === '' ||
                    credentials?.email === undefined ||
                    credentials.password === '' ||
                    credentials.password === undefined
                )
                    return null;
                const user: UserCredential = await signInAdmin(
                    credentials?.email,
                    credentials?.password,
                );
                if (user !== undefined || user !== null) {
                    return {
                        email: user.user.email,
                        name: user.user.displayName,
                        image: user.user.photoURL,
                    };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
};

export default NextAuth(NextAuthOptions);
