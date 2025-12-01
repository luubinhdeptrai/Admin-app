// next.config.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            // Domain cũ đã cấu hình
            {
                protocol: 'https',
                hostname: 'iguov8nhvyobj.vcdn.cloud',
            },
            // ⭐️ THÊM DOMAIN MỚI NÀY ⭐️
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
                port: '',
                pathname: '/images/**' // Cấu hình đường dẫn cụ thể hơn nếu cần
            },
        ],
    },
};

export default nextConfig;