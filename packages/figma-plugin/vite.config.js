import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./ui-src",
  plugins: [vanillaExtractPlugin(), reactRefresh(), viteSingleFile()],
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: false,
    outDir: "../dist",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
