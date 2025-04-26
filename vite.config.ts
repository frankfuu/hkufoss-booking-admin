import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/admin",
  plugins: [react()],

  // enable source maps for local development
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        sourcemap: true,
      },
    },
  },
  publicDir: 'public',
  assetsInclude: ['**/locales/**/*.json'],
});
