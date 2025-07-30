import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/django/:path*',
        destination: 'http://localhost:8000/api/:path*', // Django backend
      },
    ];
  },
};

export default nextConfig;
