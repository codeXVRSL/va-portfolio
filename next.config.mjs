/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: false },
  transpilePackages: ['three'],
};
export default nextConfig;
