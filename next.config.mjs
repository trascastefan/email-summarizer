/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  async rewrites() {
    return [];
  },
  server: {
    port: 3001
  }
};

export default nextConfig;
