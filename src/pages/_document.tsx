import { Head, Html, Main, NextScript } from 'next/document';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    variable: '--roboto',
});

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body className={roboto.variable}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
