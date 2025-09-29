/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ВАЖНО: НЕ ставить output:'export'
  // experimental: {
  //   typedRoutes: true,
  // },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.freekassa.net',
      },
    ],
  },
  // Убираем хост-редиректы из кода - они будут только в Vercel Domains
  // async redirects() {
  //   return [];
  // },
  async headers() {
    return [
      {
        source: "/ok",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: https://cdn.freekassa.net; connect-src 'self' https://api.getlifeundo.com https://*.getlifeundo.com https://*.lifeundo.ru; frame-ancestors 'self' https://*.getlifeundo.com https://*.lifeundo.ru;"
          },
        ],
      },
    ];
  },
};

export default nextConfig;