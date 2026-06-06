import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("[BUILD] Starting unified build process...");

try {
  // Step 1: Run Vite Build
  console.log("\n--- [BUILD] Step 1: Compiling frontend with Vite ---");
  execSync("vite build", { stdio: "inherit" });

  // Step 2: Bundle Server with esbuild
  console.log("\n--- [BUILD] Step 2: Bundling server.ts with esbuild ---");
  execSync("esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs", { stdio: "inherit" });

  // Step 3: Run products metadata compilation
  console.log("\n--- [BUILD] Step 3: Compiling products metadata ---");
  execSync("tsx scripts/build_meta.js", { stdio: "inherit" });

  // Step 4: Run pre-prerender routing
  console.log("\n--- [BUILD] Step 4: Running page static pre-rendering ---");
  execSync("tsx scripts/prerender.ts", { stdio: "inherit" });

  // Step 5: Run sitemap and robots generation
  console.log("\n--- [BUILD] Step 5: Generating sitemap.xml and robots.txt ---");
  execSync("tsx scripts/generate-sitemap.ts", { stdio: "inherit" });

  console.log("\n[BUILD] Unified build process completed successfully!");
} catch (error) {
  console.error("\n[BUILD] Build failed with error:");
  console.error(error);
  process.exit(1);
}
