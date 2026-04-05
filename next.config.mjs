/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    basePath: '/kevin-homepage',
    assetPrefix: '/kevin-homepage/',
    images: {
      unoptimized: true,
    },
  };

  export default nextConfig;
