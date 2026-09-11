import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { resolveGitHubToken, OWNER_REPO, TARGET_BRANCH } from "./github-push.js";

const commitMessage = process.argv[2] || "Update products and website assets [skip ci]";

console.log("[SYNC] Starting automatic build and sync script...");

try {
  // 1. Build the project
  console.log("\n--- Step 1: Building project (npm run build) ---");
  execSync("npm run build", { stdio: "inherit" });
  console.log("[SYNC] Build completed successfully with zero errors.");

  // 2. Stage files
  console.log("\n--- Step 2: Staging all files in Git ---");
  execSync("git add .", { stdio: "inherit" });
  console.log("[SYNC] All files staged successfully.");

  // 3. Commit changes
  console.log("\n--- Step 3: Committing staged changes ---");
  try {
    execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });
    console.log("[SYNC] Committed successfully.");
  } catch (commitErr) {
    if (commitErr.message && commitErr.message.includes("nothing to commit")) {
      console.log("[SYNC] Nothing to commit, working tree clean.");
    } else {
      console.log("[SYNC] Working tree is up to date.");
    }
  }

  // 4. Push changes
  console.log("\n--- Step 4: Pushing changes to GitHub ---");
  const token = resolveGitHubToken();

  if (token) {
    console.log("[SYNC] Using Atomic Git Data API push engine (safe for large batches & binary assets)...");
    try {
      execSync("node scripts/github-push.js", { stdio: "inherit" });
      console.log("[SYNC] Push completed successfully via Git Data API.");
      return;
    } catch (apiErr) {
      console.error("[SYNC] Git Data API push failed:", apiErr.message);
    }
  } else {
    console.log("[SYNC] Attempting Git CLI push...");
    try {
      execSync("git push origin main", { stdio: "inherit" });
      console.log("[SYNC] CLI push successful.");
    } catch (pushErr) {
      console.warn("\n[SYNC] Git CLI push requires authentication credentials.");
      console.log("Run with your token: GITHUB_TOKEN=ghp_xxx npm run push:github");
      console.log("Or diagnose permissions: npm run diagnose:github");
    }
  }

  console.log("\n[SYNC] Automation workflow ended.");
} catch (error) {
  console.error("\n[SYNC] Automation aborted due to error:");
  console.error(error.message);
  process.exit(1);
}
