import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./ui-src",
  plugins: [react(), viteSingleFile()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: "../dist",
  },
});
