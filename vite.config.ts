// Lovable's wrapper provides TanStack Start, React, Tailwind, aliases, and diagnostics.
// For cPanel/Passenger self-hosting we explicitly select Nitro's standard Node server
// output so the production entry is always .output/server/index.mjs.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
    output: {
      dir: ".output",
      serverDir: ".output/server",
      publicDir: ".output/public",
    },
  },
});
