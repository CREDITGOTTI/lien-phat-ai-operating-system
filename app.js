// cPanel / Phusion Passenger startup shim for the built TanStack/Nitro app.
// Passenger looks for app.js by default.
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnvFile } from "node:process";

const appRoot = dirname(fileURLToPath(import.meta.url));
process.chdir(appRoot);

const envPath = join(appRoot, ".env");
if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

const serverEntry = join(appRoot, ".output", "server", "index.mjs");
if (!existsSync(serverEntry)) {
  throw new Error(
    "Missing .output/server/index.mjs. Run the cPanel deployment/build before starting the application.",
  );
}

await import(pathToFileURL(serverEntry).href);
