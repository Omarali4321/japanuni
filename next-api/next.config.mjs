/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['data/**/*'],
    },
  },
}

export default nextConfig
