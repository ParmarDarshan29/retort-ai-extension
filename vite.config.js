import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Note: `vite-plugin-static-copy` caused an esbuild resolution error in some
// environments because its published package lacked built files. Instead of
// relying on that plugin, static extension assets are placed in `public/`
// where Vite will copy them to `dist/` automatically.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "./public/popup.html",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
