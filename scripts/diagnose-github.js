#!/usr/bin/env node

/**
 * Diagnostic utility for GitHub connection & authentication
 */

import https from "https";
import fs from "fs";
import path from "path";
import { resolveGitHubToken, OWNER_REPO, TARGET_BRANCH } from "./github-push.js";

async function makeRequest(apiPath, token = null) {
  return new Promise((resolve) => {
    const headers = {
      "User-Agent": "MukeshSarees-Diagnostics/1.0",
      Accept: "application/vnd.github.v3+json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const req = https.request(
      {
        hostname: "api.github.com",
        path: apiPath,
        method: "GET",
        headers,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch {
            parsed = body;
          }
          resolve({ statusCode: res.statusCode, data: parsed });
        });
      }
    );

    req.on("error", (err) => {
      resolve({ statusCode: 0, error: err.message });
    });

    req.end();
  });
}

async function runDiagnostics() {
  console.log("===============================================================");
  console.log("             GITHUB CONNECTION & AUTH DIAGNOSTICS              ");
  console.log("===============================================================");
  console.log(`Repository:    ${OWNER_REPO}`);
  console.log(`Target Branch: ${TARGET_BRANCH}\n`);

  // 1. Check Public Repo Connectivity
  console.log("1. Checking GitHub API public access...");
  const publicRes = await makeRequest(`/repos/${OWNER_REPO}`);
  if (publicRes.statusCode === 200) {
    console.log(`   ✔ Repository is reachable publicly (Default branch: ${publicRes.data.default_branch})`);
  } else {
    console.log(`   ✖ Could not reach repository publicly (HTTP ${publicRes.statusCode})`);
  }

  // 2. Check Token Resolution
  console.log("\n2. Checking GitHub Token configuration...");
  const tokenFile = path.join(process.cwd(), ".github-token");
  const hasTokenFile = fs.existsSync(tokenFile);
  const token = resolveGitHubToken();

  if (!token) {
    console.log("   ✖ No GitHub token found.");
    console.log("   -> Provide via CLI: npm run push:github -- --token=<token>");
    console.log("   -> Or save to local gitignored file: .github-token");
    return;
  }

  console.log(`   ✔ Token resolved (Length: ${token.length}, Source: ${hasTokenFile ? ".github-token file" : "process.env.GITHUB_TOKEN"})`);

  // 3. Authenticate with Token
  console.log("\n3. Validating Token with GitHub API...");
  const authRes = await makeRequest("/user", token);

  if (authRes.statusCode === 200) {
    console.log(`   ✔ Token is valid! Authenticated as: ${authRes.data.login}`);
  } else if (authRes.statusCode === 401) {
    console.log("   ✖ HTTP 401 Unauthorized: Bad credentials");
    console.log("   REASON: The provided GitHub token is expired, revoked, or invalid.");
    console.log("\n   HOW TO FIX:");
    console.log("   1. Go to https://github.com/settings/tokens (Personal access tokens -> Classic or Fine-grained)");
    console.log("   2. Generate a new token with 'repo' scope (Read and Write access to repository contents)");
    console.log("   3. Run push with the new token:");
    console.log("      npm run push:github -- --token=YOUR_NEW_TOKEN");
    console.log("      OR write the token into .github-token (which is in .gitignore):");
    console.log("      echo 'YOUR_NEW_TOKEN' > .github-token");
    return;
  } else {
    console.log(`   ✖ GitHub API responded with status ${authRes.statusCode}:`, authRes.data);
    return;
  }

  // 4. Check Repo Permissions with Token
  console.log("\n4. Checking repository write permissions...");
  const repoRes = await makeRequest(`/repos/${OWNER_REPO}`, token);
  if (repoRes.statusCode === 200) {
    const perms = repoRes.data.permissions || {};
    console.log(`   Permissions: push=${perms.push}, admin=${perms.admin}`);
    if (perms.push) {
      console.log("   ✔ You have push/write access to this repository!");
    } else {
      console.log("   ✖ Your token does NOT have push/write permission to this repository.");
    }
  } else {
    console.log(`   ✖ Could not verify permissions (HTTP ${repoRes.statusCode})`);
  }
}

runDiagnostics();
