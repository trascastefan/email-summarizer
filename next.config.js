/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add any specific configuration options here
  reactStrictMode: true,
  // Optional: Configure webpack if needed
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  }
};

module.exports = nextConfig;
