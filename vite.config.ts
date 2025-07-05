import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { splitVendorChunkPlugin } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    splitVendorChunkPlugin(),
  ],
  ssr: {
    // Ensure PostHog's CommonJS bundle isn't evaluated by Node-SSR.
    // This avoids "Named export not found" errors at runtime.
    noExternal: [
      "posthog-js",
      "posthog-js/react",
    ],
  },
  server: {
    hmr: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "src/client"),
      "@server": path.resolve(__dirname, "src/server"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      onwarn(warning, rollupWarn) {
        if (warning.code === "EMPTY_BUNDLE") return;
        rollupWarn(warning);
      },
    },
  },
});
