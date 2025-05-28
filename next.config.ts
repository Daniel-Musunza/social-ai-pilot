import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Add other image domains if needed, e.g., for user avatars from Google
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', 
      }
    ],
  },
  // For Next.js versions prior to 14.x where serverActions might not be enabled by default.
  // For Next.js 14 and later, this is typically enabled by default.
  // experimental: {
  //   serverActions: true,
  // },
};

export default nextConfig;
