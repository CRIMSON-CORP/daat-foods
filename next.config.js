/** @type {import('next').NextConfig} */
const nextConfig = {
    dev: process.env.NODE_ENV !== 'production',
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
            },
        ],
    },
};

module.exports = nextConfig;
