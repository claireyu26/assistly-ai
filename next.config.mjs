/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    images: {
        remotePatterns: [],
        unoptimized: false,
        formats: ['image/avif', 'image/webp'],
    },
};

export default nextConfig;
