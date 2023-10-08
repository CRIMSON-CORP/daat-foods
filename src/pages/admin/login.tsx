import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import axios from '@/lib/axios';
import { addAdminToState } from '@/redux/admin/actions';
import { getCurrentUser } from '@/service/firebase';
import delay from '@/utils/delay';
import { GetServerSideProps } from 'next';

function Login() {
    return (
        <div className="flex items-stretch min-h-screen">
            <Form />
            <div className="grow w-full hidden justify-center items-center md:flex">
                <Image
                    alt="logo"
                    width={355}
                    height={610}
                    src="/daat_logo.png"
                />
            </div>
        </div>
    );
}

export default Login;

function Form() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [requestStatus, setRequestStatus] = useState('');

    const { push } = useRouter();

    const dispatch = useDispatch();

    const onSubmit: React.FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            setRequestStatus('Signing in...');
            const { data } = await axios.post('/admin/sign-in', {
                email,
                password,
            });
            setRequestStatus('Signing Successful...');

            const admin: Admin = {
                email: data.user.email,
                id: data.user.uid,
                image: data.user.photoURL,
                name: data.user.displayName,
            };
            dispatch(addAdminToState(admin));
            await delay(1000);
            push('/admin');
        } catch (error: any) {
            setRequestStatus(
                `Signing failed...${
                    error?.response?.data?.message ?? error.message
                }`,
            );
        } finally {
            await delay(3000);
            setRequestStatus(``);
        }
    };

    return (
        <div className="grow flex w-full flex-col gap-6 items-center justify-center px-5">
            <h1 className="text-3xl font-semibold text-slate-800">Login</h1>
            <form
                onSubmit={onSubmit}
                className="flex flex-col gap-4 max-w-md w-full"
            >
                <div className="flex flex-col gap-4 w-full">
                    <label htmlFor="full_name">
                        Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                    />
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <label htmlFor="full_name">
                        Password <span className="text-red-400">*</span>
                    </label>
                    <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-primary-100 text-primary-800 font-semibold text-lg rounded-md px-7 py-4 clickable"
                >
                    {requestStatus ? (
                        <span className="inline-flex items-center gap-4">
                            {requestStatus}{' '}
                            <span className="w-5 h-5  flex-none border-[length:3px] border-t-white rounded-full border-black/30 animate-spin duration-300" />
                        </span>
                    ) : (
                        <span>Sign in</span>
                    )}
                </button>
            </form>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if (getCurrentUser() !== null) {
        return {
            redirect: {
                destination: '/admin',
                statusCode: 301,
            },
        };
    } else {
        return {
            props: {},
        };
    }
};
