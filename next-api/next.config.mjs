import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

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

export default withNextIntl(nextConfig)
