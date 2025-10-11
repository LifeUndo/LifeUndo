/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async headers() {
    const csp = [
      "default-src 'self';",
      "img-src 'self' https: data:;",
      "style-src 'self' 'unsafe-inline';",
      "script-src 'self' https://*.vercel-insights.com;",
      "connect-src 'self' https://api.fk.money https://pay.fk.money https://*.vercel-insights.com;",
      "frame-src https://pay.fk.money;",
      "font-src 'self' data:;",
      "object-src 'none';",
      "base-uri 'self';",
      "form-action 'self';",
      "frame-ancestors 'none';",
      "upgrade-insecure-requests;"
    ].join(" ");

    return [
      {
        // распространяем CSP на весь сайт (и ru/en)
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp }
        ],
      },
    ];
  },
};

export default nextConfig;
