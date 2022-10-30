import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import nodePolyfills from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
    process: { env: {} },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: "@root-entry-name: default;",
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills({ sourceMap: false })],
    },
  },
});
