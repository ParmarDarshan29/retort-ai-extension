import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "public/manifest.json", dest: "." },
        { src: "public/icon.png", dest: "." },
        { src: "public/popup.html", dest: "." },
        { src: "src/content/contentScript.js", dest: "."},
        { src: "src/background.js", dest: "." }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: "./public/popup.html", // 👈 Tell Vite this is the real HTML entry
    },
    outDir: "dist",
    emptyOutDir: true
  }
});
