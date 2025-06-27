import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths()
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
});
