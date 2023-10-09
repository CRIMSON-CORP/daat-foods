import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { appCookieName } from '@/config/app-config';
import { signOutAdmin } from '@/service/firebase';
import { parse } from 'cookie';

function ProtectDashboard(
    getServerSideProps: any = () => {
        return {
            props: {},
        };
    },
): GetServerSideProps {
    return async function getServerSidePropsHOC(
        context: GetServerSidePropsContext,
    ) {
        const cookie = parse(context.req.headers.cookie || '')[appCookieName];
        if (cookie === undefined) {
            await signOutAdmin();
            return {
                redirect: {
                    destination: '/admin/login',
                    permanent: false,
                },
            };
        } else {
            return getServerSideProps(context);
        }
    };
}

export default ProtectDashboard;
