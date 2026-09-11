#!/usr/bin/env node

/**
 * GitHub Connection & Push Diagnostics Tool
 * 
 * Diagnoses:
 * 1. GitHub Token validity & authentication scopes
 * 2. Repository existence, permissions & access rights
 * 3. Branch status and branch protection rules
 * 4. Commit SHA and fast-forward status
 * 5. Captures real HTTP status codes, error payloads, and headers
 */

import https from "https";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { resolveGitHubToken } from "./github-push.js";

const token = resolveGitHubToken();
const repoFullName = process.env.GITHUB_REPO || "JunkheadVlogs/mukesh-1";
const branch = process.env.GITHUB_BRANCH || "main";

console.log("==================================================");
console.log("  GitHub Connection & Push Diagnostic Tool");
console.log("==================================================");
console.log(`Repository: ${repoFullName}`);
console.log(`Branch:     ${branch}`);

function githubApiRequest(apiPath, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      "User-Agent": "MukeshSarees-Build-Diagnostic/2.0",
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      hostname: "api.github.com",
      port: 443,
      path: apiPath,
      method,
      headers,
    };

    if (data) {
      options.headers["Content-Type"] = "application/json";
      options.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on("error", (err) => reject(err));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runDiagnostics() {
  if (token) {
    console.log("\n[1/4] Checking GitHub Authentication & Token Scopes...");
    try {
      const userRes = await githubApiRequest("/user");
      console.log(`HTTP Status: ${userRes.statusCode} ${userRes.statusMessage}`);
      if (userRes.statusCode === 200) {
        console.log(` Authenticated as: ${userRes.data.login} (${userRes.data.name || "No name"})`);
        console.log(` OAuth Scopes: ${userRes.headers["x-oauth-scopes"] || "None"}`);
        console.log(` Rate Limit Remaining: ${userRes.headers["x-ratelimit-remaining"]} / ${userRes.headers["x-ratelimit-limit"]}`);
      } else {
        console.error(`❌ Authentication Failed!`);
        console.error(`   Error: ${JSON.stringify(userRes.data)}`);
      }
    } catch (err) {
      console.error(`❌ Network error contacting api.github.com:`, err.message);
    }
  } else {
    console.log("\n[1/4] GitHub Authentication Token: Not provided (running public repository check)");
  }

  console.log(`\n[2/5] Checking Repository: ${repoFullName}...`);
  try {
    const repoRes = await githubApiRequest(`/repos/${repoFullName}`);
    console.log(`HTTP Status: ${repoRes.statusCode} ${repoRes.statusMessage}`);
    if (repoRes.statusCode === 200) {
      console.log(` Repository found: ${repoRes.data.full_name} (${repoRes.data.visibility})`);
      console.log(` Default branch: ${repoRes.data.default_branch}`);
      if (repoRes.data.permissions) {
        console.log(` Permissions: Push=${repoRes.data.permissions?.push}, Admin=${repoRes.data.permissions?.admin}`);
      }
    } else {
      console.error(`❌ Repository lookup failed! Status: ${repoRes.statusCode}`);
      console.error(`   Message: ${repoRes.data.message || JSON.stringify(repoRes.data)}`);
    }
  } catch (err) {
    console.error(`❌ Error checking repo:`, err.message);
  }

  console.log(`\n[3/5] Testing Repository Write / Blob Creation Permission...`);
  if (token) {
    try {
      const probeRes = await githubApiRequest(`/repos/${repoFullName}/git/blobs`, "POST", {
        content: "diagnostic_write_probe",
        encoding: "utf-8",
      });
      if (probeRes.statusCode === 201) {
        console.log(`✅ Write Permission Confirmed! Token can create Git blobs and push commits.`);
      } else if (probeRes.statusCode === 403) {
        const isPat = typeof token === "string" && token.startsWith("github_pat_");
        console.error(`❌ WRITE PERMISSION DENIED (HTTP 403)!`);
        console.error(`   GitHub Message: ${probeRes.data?.message || "Forbidden"}`);
        if (isPat) {
          console.error(`   ⚠️  CAUSE: Your Fine-Grained Personal Access Token lacks the 'Contents: Read and write' permission.`);
          console.error(`   👉 RESOLUTION:`);
          console.error(`      1. Open GitHub: https://github.com/settings/tokens?type=beta`);
          console.error(`      2. Click on your active fine-grained token.`);
          console.error(`      3. Under "Repository access", ensure '${repoFullName}' is included.`);
          console.error(`      4. Under "Permissions" -> "Repository permissions", find "Contents".`);
          console.error(`      5. Change "Contents" from Read-only to "Read and write".`);
          console.error(`      6. Click "Generate token" / "Save changes" and update GITHUB_TOKEN.`);
          console.error(`      Or alternatively, generate a Classic Token with 'repo' scope at: https://github.com/settings/tokens`);
        } else {
          console.error(`   ⚠️  CAUSE: Your token does not have write/push access to '${repoFullName}'.`);
          console.error(`   👉 RESOLUTION: Ensure token has the 'repo' scope.`);
        }
      } else {
        console.warn(`⚠️  Unexpected write probe response: ${probeRes.statusCode} - ${JSON.stringify(probeRes.data)}`);
      }
    } catch (err) {
      console.error(`❌ Error probing write permissions:`, err.message);
    }
  } else {
    console.log(`⚠️  Skipped (no token provided)`);
  }

  console.log(`\n[4/5] Checking Branch '${branch}' & Latest Remote Commit...`);
  try {
    const branchRes = await githubApiRequest(`/repos/${repoFullName}/branches/${branch}`);
    console.log(`HTTP Status: ${branchRes.statusCode} ${branchRes.statusMessage}`);
    if (branchRes.statusCode === 200) {
      console.log(` Branch '${branch}' exists.`);
      console.log(` Latest remote commit SHA: ${branchRes.data.commit.sha}`);
      console.log(` Latest remote tree SHA:   ${branchRes.data.commit.commit.tree.sha}`);
      console.log(` Protected: ${branchRes.data.protected}`);
    } else {
      console.warn(` Branch check returned: ${branchRes.statusCode} - ${branchRes.data.message}`);
    }
  } catch (err) {
    console.error(`❌ Error checking branch:`, err.message);
  }

  console.log(`\n[5/5] Checking Local Git Tracking Status...`);
  try {
    const ahead = execSync(`git rev-list --count origin/${branch}..HEAD 2>/dev/null || echo "N/A"`).toString().trim();
    const behind = execSync(`git rev-list --count HEAD..origin/${branch} 2>/dev/null || echo "N/A"`).toString().trim();
    const localHead = execSync("git rev-parse HEAD").toString().trim();
    console.log(` Local HEAD SHA: ${localHead}`);
    console.log(` Commits ahead of origin/${branch}: ${ahead}`);
    console.log(` Commits behind origin/${branch}: ${behind}`);
  } catch (e) {
    console.log(` Local git status: ${e.message}`);
  }

  console.log("\n==================================================");
  console.log("  Diagnostics Complete");
  console.log("==================================================");
}

runDiagnostics();
