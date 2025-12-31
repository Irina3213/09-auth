import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Додано типізацію тут
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination:
          "https://auth-backend-production-c662.up.railway.app/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination:
          "https://auth-backend-production-c662.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
