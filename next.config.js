const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["bcryptjs"],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Serve the whole app under `/hoa/*`
  // Example: `/escrow-account` → `/hoa/escrow-account`
  basePath: "/hoa",

  async redirects() {
    return [
      {
        source: "/",
        destination: "/hoa",
        permanent: false,
        // Apply this rule to incoming raw paths (without automatically prefixing `/hoa`)
        basePath: false,
      },
      {
        // Redirect any non-basePath route to `/hoa/*` (but don't interfere with other apps/static/api)
        source: "/:path((?!hoa|_next|next|api|favicon\\.ico).+)",
        destination: "/hoa/:path",
        permanent: false,
        basePath: false,
      },
    ];
  },
  // Updated images configuration for Next.js 15
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.builder.io",
        pathname: "/**",
      },
    ],
  },

  transpilePackages: [
    "@mui/material",
    "@mui/icons-material",
    "@mui/x-date-pickers",
  ],

  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/x-date-pickers",
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
