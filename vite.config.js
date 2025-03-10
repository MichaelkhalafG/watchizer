import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteImagemin from "vite-plugin-imagemin";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      svgo: { plugins: [{ removeViewBox: false }] },
    }),
    compression({ algorithm: "brotliCompress" }), // Brotli compression
    compression({ algorithm: "gzip" }),
  ],
  build: {
    target: "es2017",
    polyfillDynamicImport: false,
    chunkSizeWarningLimit: 500,
    minify: "esbuild",
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks: {
          react: ["react", "react-dom"],
          slick: ["react-slick", "slick-carousel"],
          utils: ["lodash", "dayjs"],
          styles: ["aos", "slick-carousel/slick/slick.css", "slick-carousel/slick/slick-theme.css"],
        },
      },
    },
  },
});
