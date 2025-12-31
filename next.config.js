/** @type {import('next').NextConfig} */
const nextConfig = {
  // Дозволяємо використання proxy.ts для Next.js 15+
  experimental: {
    proxy: true,
  },
  async rewrites() {
    return [
      {
        // Перенаправляє всі запити /auth/... на бекенд Railway
        source: "/auth/:path*",
        destination:
          "https://auth-backend-production-c662.up.railway.app/auth/:path*",
      },
      {
        // Перенаправляє всі запити до API нотаток на бекенд Railway
        source: "/api/:path*",
        destination:
          "https://auth-backend-production-c662.up.railway.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
