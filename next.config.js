/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    domains: ['honorable-panther-60.convex.cloud'],
  },
};

module.exports = nextConfig;
