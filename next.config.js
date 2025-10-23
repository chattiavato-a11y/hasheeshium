/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  experimental: {
    optimizePackageImports: ['@headlessui/react']
  }
};

module.exports = nextConfig;
