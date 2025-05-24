/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['127.0.0.1', 'api.plottwist-ai.com', 'lh3.googleusercontent.com', 'graph.microsoft.com', 'api.qrserver.com'],
  },
  webpack: (config, { dev, isServer }) => {
    config.externals = [...(config.externals || []), 'stripe']
    return config
  },
  // Increase logging in production
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://apis.google.com https://www.googleapis.com https://*.google.com https://www.gstatic.com",
              "frame-src 'self' https://js.stripe.com https://accounts.google.com",
              "connect-src 'self' https://api.stripe.com https://js.stripe.com",
              "img-src 'self' data: https://*.stripe.com",
              "style-src 'self' 'unsafe-inline' https://js.stripe.com"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ]
  }
};

export default nextConfig;
