import type { AppProps } from 'next/app';
import { Raleway } from 'next/font/google';

import { Provider } from 'react-redux';
const raleway = Raleway({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    variable: '--raleway',
});

import store from '@/redux/store';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <main className={raleway.variable}>
                <Component {...pageProps} />
            </main>
        </Provider>
    );
}
