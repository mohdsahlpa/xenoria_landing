import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  // Default config for SPA
  server: {
    allowedHosts: ['tech.mohdsahl.me'],
  },
});
