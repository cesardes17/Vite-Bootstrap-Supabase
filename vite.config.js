import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname, "src"),
  envDir: resolve(__dirname), // Point to the root directory where .env is located
  build: {
    outDir: "../dist",
  },
  server: {
    port: 8080,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        logger: {
          warn: () => {},
        },
      },
    },
  },
});
