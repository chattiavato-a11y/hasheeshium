/** @type {import('next').NextConfig} */
const repo = 'hasheeshium';
const onCI = process.env.GITHUB_ACTIONS === 'true';

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  // ensure links/assets work at https://<user>.github.io/hasheeshium
  basePath: onCI ? `/${repo}` : '',
  assetPrefix: onCI ? `/${repo}/` : undefined,
  images: { unoptimized: true },
  experimental: { optimizePackageImports: ['@headlessui/react'] },
};
