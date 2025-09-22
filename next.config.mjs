import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // outputFileTracingIncludes: {
  //   '/admin/*': ['../../node_modules/@libsql/**/*'],
  //   '/admin/*': ['../../node_modules/libsql/**/*'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'manajemeninformatika.polsri.ac.id',
      },
    ],
  },
}

export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
