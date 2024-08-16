/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ]
  }
}

export default nextConfig
