/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ВАЖНО: НЕ ставить output:'export'
  // experimental: {
  //   typedRoutes: true,
  // },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
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
    ];
  },
};

export default nextConfig;