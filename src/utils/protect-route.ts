import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getCurrentUser, signOutAdmin } from '@/service/firebase';

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
        const currentUser = getCurrentUser();
        if (currentUser === null) {
            await signOutAdmin();
            return {
                redirect: {
                    destination: '/admin/login',
                    permanent: false,
                },
            };
        } else {
            return getServerSideProps(context, currentUser);
        }
    };
}

export default ProtectDashboard;
