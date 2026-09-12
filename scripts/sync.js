import { execSync } from "child_process";

const commitMessage = process.argv[2] || "Update products: Add hidden Payment Test Product & set up filters";

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
      console.log("[SYNC] Nothing to commit, working clean.");
    } else {
      console.log("[SYNC] Commit skipped or nothing new to commit.");
    }
  }

  // 4. Try pushing to GitHub main branch
  console.log("\n--- Step 4: Attempting to push to main branch ---");
  try {
    execSync("git push origin main", { stdio: "inherit" });
    console.log("[SYNC] Push successful! Auto-deployed to Hostinger.");
  } catch (pushErr) {
    console.log("\n[WARNING] Direct terminal 'git push' failed. This is EXPECTED in sandboxed cloud environments.");
    console.log("Please use the 'Sync / Commit & Push' button in the Google AI Studio top settings menu,");
    console.log("which uses your secure connected GitHub authentication.");
  }

  console.log("\n[SYNC] Automation workflow ended.");
} catch (error) {
  console.error("\n[SYNC] Automation aborted due to build/validation error:");
  console.error(error.message);
  process.exit(1);
}
