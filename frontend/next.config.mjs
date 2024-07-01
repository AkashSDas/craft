/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // disable it for React DnD
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
        domains: ['i.imgur.com'],
    },
};

export default nextConfig;
