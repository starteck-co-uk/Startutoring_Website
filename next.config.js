/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'star-tutoring.vercel.app' },
      { protocol: 'https', hostname: '*.startutoring.uk' },
      { protocol: 'https', hostname: 'startutoring.uk' }
    ]
  }
};

module.exports = nextConfig;
