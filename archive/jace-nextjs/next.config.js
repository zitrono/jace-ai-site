/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://jace.ai/:path*',
      },
    ]
  },
}

module.exports = nextConfig