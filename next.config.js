/** @type {import('next').NextConfig} */
const nextConfig = {
    dev: process.env.NODE_ENV !== 'production',
    reactStrictMode: true,
    images: {
        unoptimized: true,
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
