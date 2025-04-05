/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Only apply these changes for client-side builds
    if (!isServer) {
      // Avoid SSR errors with MongoDB by handling Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // MongoDB optional dependencies
        'mongodb-client-encryption': false,
        'kerberos': false,
        '@mongodb-js/zstd': false,
        '@aws-sdk/credential-providers': false,
        'gcp-metadata': false,
        'snappy': false,
        'socks': false,
        'aws4': false,
        
        // Node.js core modules
        'zlib': false,
        'stream': false,
        'buffer': false,
        'util': false,
        'process': false,
        'path': false,
        'crypto': false,
        'fs': false,
        'dns': false,
        'net': false,
        'tls': false,
        'child_process': false,
        'os': false,
      };
    }
    
    return config;
  },
  // Disable MongoDB on the client side entirely by treating its imports as external
  // in client components (we'll use API routes for data access)
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['randomuser.me', 'api.qrserver.com'],
  },
};

module.exports = nextConfig; 