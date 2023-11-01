import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Raleway } from 'next/font/google';
import { Provider } from 'react-redux';

import store from '@/redux/store';
import '@/styles/globals.css';

const raleway = Raleway({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    variable: '--raleway',
});

type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement, pageProps: any) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <SessionProvider session={pageProps.session}>
            <Provider store={store}>
                <main className={raleway.variable}>
                    {getLayout(<Component {...pageProps} />, pageProps)}
                </main>
            </Provider>
        </SessionProvider>
    );
}
