import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    // Workspace root noto‘g‘ri aniqlanib qolmasligi uchun (ko‘p lockfile bo‘lsa ham)
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
