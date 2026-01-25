
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // 1. The React Plugin: Essential for your site to work
  plugins: [react()],

  // 2. Path Alias: Ensures imports like '@/components/Header' work
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 3. Build Settings: Standard settings for Vercel
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});