/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['127.0.0.1', 'api.plottwist-ai.com', 'lh3.googleusercontent.com', 'graph.microsoft.com', 'api.qrserver.com'],
  },
  webpack: (config, { dev, isServer }) => {
    config.externals = [...(config.externals || []), 'stripe']
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com"
          }
        ],
      },
    ]
  }
};

export default nextConfig;
