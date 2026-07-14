import { defineConfig } from 'vite';
import { resolve } from 'path';
import { localDataApiPlugin } from './vite-local-data.js';

export default defineConfig({
  plugins: [localDataApiPlugin()],
  root: '.',
  // Relative base works for GitHub Pages subfolder deployments (e.g. /sgs_portail/)
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'assets')
    }
  }
});
