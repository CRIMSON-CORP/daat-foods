import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: 'hsl(82.26deg 52.1% 70.67%)',
                    800: 'hsl(82.26deg 52.1% 10.67%)',
                },
            },
            fontFamily: {
                header: ['var(--raleway)', 'sans-serif'],
                body: ['var(--raleway)', 'sans-serif'],
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '20px',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
};
export default config;
