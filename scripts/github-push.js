#!/usr/bin/env node

/**
 * Robust Atomic GitHub Push Engine for Large Batches
 * 
 * Uses GitHub's Git Data API (Git Trees + Git Commit workflow) to safely
 * push 1,100+ files (including binary .webp product images) as a single atomic commit.
 * 
 * Features:
 * 1. Concurrency lock (.github-push.lock) with stale-lock auto-clearing.
 * 2. Remote check: Validates repository, branch, and gets current commit & base tree SHA.
 * 3. Exact Diff Calculation: Compares local files against remote tree using Git SHA-1 hashing.
 *    Normalizes CRLF/LF line endings for text files to avoid false positives.
 * 4. Pre-Push Validation: Outputs summary of Added, Modified, Deleted files & total payload size.
 * 5. Concurrent Blob Upload: Uploads binary (.webp as base64) and text files in controlled batches with retry logic.
 * 6. Deletion Handling: Uses GitHub's Git Trees API { path, mode: "100644", type: "blob", sha: null } to delete removed files.
 * 7. Conflict Prevention: Verifies remote branch hasn't advanced before creating commit and updating ref.
 * 8. Atomic Tree & Commit: Builds single Git tree referencing base_tree and single commit referencing parent commit.
 * 9. Ref Update & Verification: Updates refs/heads/<branch> and verifies GitHub accepted the new SHA.
 * 10. Local Tracking Sync: Runs git fetch origin main and git reset --mixed origin/main so local Git matches GitHub.
 * 11. Real Error Reporting: Captures HTTP status, error message, documentation URL, payload size, and failed operation.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";
import { execSync } from "child_process";

export const OWNER_REPO = process.env.GITHUB_REPO || "JunkheadVlogs/mukesh-1";
export const TARGET_BRANCH = process.env.GITHUB_BRANCH || "main";
export const LOCK_FILE = path.join(process.cwd(), ".github-push.lock");
export const CONCURRENCY_LIMIT = 10; // Controlled parallel blob uploads

// Ignore directories and temporary files
export const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  ".vite",
  "public_html/.builds"
]);

export const IGNORED_FILES = new Set([
  ".github-push.lock",
  ".github-token",
  "requests.log",
  ".env",
  ".env.local",
  ".env.production",
  ".DS_Store",
  "out.txt",
  "slugs.txt"
]);

// Helper: Calculate Git blob SHA-1 identical to git hash-object
export function computeGitBlobSha(contentBuffer) {
  const header = `blob ${contentBuffer.length}\0`;
  const hasher = crypto.createHash("sha1");
  hasher.update(header, "utf8");
  hasher.update(contentBuffer);
  return hasher.digest("hex");
}

// Helper: Determine if a file is binary (requires base64 transfer)
export function isBinaryFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return [
    ".webp", ".jpg", ".jpeg", ".png", ".ico", ".gif", ".avif",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".zip", ".gz", ".tar", ".pdf", ".mp4", ".webm"
  ].includes(ext);
}

// Resolve token from multiple sources: CLI arg, env var, or local file
export function resolveGitHubToken(cliToken = null) {
  if (cliToken && typeof cliToken === "string" && cliToken.trim().length > 0) {
    return cliToken.trim();
  }
  // Check CLI arguments for --token=xxx or -t xxx
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith("--token=")) {
      return arg.split("=")[1].trim();
    }
    if (arg === "-t" && process.argv[i + 1]) {
      return process.argv[i + 1].trim();
    }
  }
  // Check local gitignored token file first (allows explicit active token override)
  const tokenFile = path.join(process.cwd(), ".github-token");
  if (fs.existsSync(tokenFile)) {
    try {
      const content = fs.readFileSync(tokenFile, "utf8").trim();
      if (content.length > 0) return content;
    } catch {}
  }
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim().length > 0) {
    return process.env.GITHUB_TOKEN.trim();
  }
  if (process.env.GH_TOKEN && process.env.GH_TOKEN.trim().length > 0) {
    return process.env.GH_TOKEN.trim();
  }
  return null;
}

// HTTPS GitHub REST API wrapper with detailed error reporting
export function githubRequest(apiPath, method = "GET", data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const payloadSize = payload ? Buffer.byteLength(payload) : 0;

    const headers = {
      "User-Agent": "MukeshSarees-AtomicPush/2.0",
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (payload) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = payloadSize;
    }

    const options = {
      hostname: "api.github.com",
      port: 443,
      path: apiPath,
      method,
      headers,
    };

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

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, headers: res.headers, data: parsed });
        } else {
          const apiMessage = parsed && parsed.message ? parsed.message : body || res.statusMessage;
          const docUrl = parsed && parsed.documentation_url ? parsed.documentation_url : null;
          const err = new Error(
            `GitHub API Error [HTTP ${res.statusCode}] on ${method} ${apiPath}: ${apiMessage}`
          );
          err.statusCode = res.statusCode;
          err.statusMessage = res.statusMessage;
          err.apiMessage = apiMessage;
          err.documentation_url = docUrl;
          err.operation = `${method} ${apiPath}`;
          err.payloadSize = payloadSize;
          err.responseBody = parsed;
          err.headers = res.headers;
          reject(err);
        }
      });
    });

    req.on("error", (networkErr) => {
      const err = new Error(`Network error on ${method} ${apiPath}: ${networkErr.message}`);
      err.statusCode = 0;
      err.statusMessage = "Network Error";
      err.apiMessage = networkErr.message;
      err.operation = `${method} ${apiPath}`;
      err.payloadSize = payloadSize;
      reject(err);
    });

    req.setTimeout(60000, () => {
      req.destroy();
      const err = new Error(`Request timeout (60s) on ${method} ${apiPath}`);
      err.statusCode = 504;
      err.statusMessage = "Gateway Timeout";
      err.apiMessage = "Request timed out after 60 seconds";
      err.operation = `${method} ${apiPath}`;
      err.payloadSize = payloadSize;
      reject(err);
    });

    if (payload) req.write(payload);
    req.end();
  });
}

// Retry wrapper with exponential backoff for rate limits or transient errors
export async function requestWithRetry(apiPath, method = "GET", data = null, token = null, retries = 3, delayMs = 2000) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await githubRequest(apiPath, method, data, token);
    } catch (err) {
      if ((err.statusCode === 429 || err.statusCode === 403 || err.statusCode >= 500) && i < retries) {
        console.warn(`[RETRY] Hit ${err.statusCode} (${err.apiMessage}). Pausing ${delayMs}ms before retry ${i + 1}/${retries}...`);
        await new Promise((r) => setTimeout(r, delayMs));
        delayMs *= 2;
        continue;
      }
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

// Traverse local workspace excluding build/cache/git directories
export function scanLocalFiles(dir = ".", baseDir = "") {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name) || IGNORED_FILES.has(entry.name)) continue;
    // Exclude test / scraper temporary scripts
    if (/^(test-.*|update.*\.js|update.*\.cjs|update.*\.ts|fix.*\.js|get-body\.ts|hostinger-response\.html)/.test(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = baseDir ? `${baseDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      results = results.concat(scanLocalFiles(fullPath, relPath));
    } else if (entry.isFile()) {
      results.push(relPath);
    }
  }
  return results;
}

// Perform exact change detection comparing local files against remote tree
export async function detectChanges(parentTreeSha, token = null) {
  const treeRes = await requestWithRetry(
    `/repos/${OWNER_REPO}/git/trees/${parentTreeSha}?recursive=1`,
    "GET",
    null,
    token
  );

  const remoteBlobs = new Map();
  for (const item of treeRes.data.tree) {
    if (item.type === "blob") {
      remoteBlobs.set(item.path, item.sha);
    }
  }

  const localFiles = scanLocalFiles();
  const added = [];
  const modified = [];
  const deleted = [];
  let totalBytesToUpload = 0;

  const localFileSet = new Set();
  for (const relPath of localFiles) {
    localFileSet.add(relPath);
    const buf = fs.readFileSync(relPath);
    const localSha = computeGitBlobSha(buf);
    const remoteSha = remoteBlobs.get(relPath);

    if (!remoteSha) {
      added.push({ path: relPath, size: buf.length, buffer: buf, sha: localSha });
      totalBytesToUpload += buf.length;
    } else if (remoteSha !== localSha) {
      // For text files, check if difference is purely CRLF vs LF to prevent false positives
      if (!isBinaryFile(relPath)) {
        try {
          const lfBuf = Buffer.from(buf.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
          const lfSha = computeGitBlobSha(lfBuf);
          if (lfSha === remoteSha) {
            // Content is identical when line endings normalized; skip re-uploading
            continue;
          }
        } catch {}
      }

      modified.push({ path: relPath, size: buf.length, buffer: buf, sha: localSha });
      totalBytesToUpload += buf.length;
    }
  }

  for (const [rPath] of remoteBlobs) {
    if (!localFileSet.has(rPath) && !IGNORED_DIRS.has(rPath.split("/")[0])) {
      deleted.push(rPath);
    }
  }

  return {
    remoteBlobsCount: remoteBlobs.size,
    localFilesCount: localFiles.length,
    added,
    modified,
    deleted,
    totalBytesToUpload,
    totalChanged: added.length + modified.length + deleted.length,
  };
}

// Acquire single-flight concurrency lock with stale-lock detection
export function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    try {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
      const ageMs = Date.now() - (lockData.startedAt || 0);
      let isAlive = false;
      try {
        if (lockData.pid) {
          process.kill(lockData.pid, 0);
          isAlive = true;
        }
      } catch {}

      if (!isAlive || ageMs > 30 * 60 * 1000) {
        console.warn(`[WARN] Clearing stale push lock (PID: ${lockData.pid}, age: ${(ageMs / 1000).toFixed(0)}s)...`);
        fs.unlinkSync(LOCK_FILE);
      } else {
        const lockErr = new Error(`A GitHub push operation is already in progress (PID: ${lockData.pid}, started ${(ageMs / 1000).toFixed(0)}s ago).`);
        lockErr.statusCode = 409;
        lockErr.operation = "acquire_lock";
        throw lockErr;
      }
    } catch (e) {
      if (e.statusCode === 409) throw e;
      try { fs.unlinkSync(LOCK_FILE); } catch {}
    }
  }
  fs.writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, startedAt: Date.now() }));
}

// Release concurrency lock
export function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
  } catch {}
}

/**
 * Core atomic push function
 * Can be invoked from CLI or from Express server
 */
export async function executeGitHubPush(options = {}) {
  const token = resolveGitHubToken(options.token);
  const repo = options.repo || OWNER_REPO;
  const branch = options.branch || TARGET_BRANCH;
  const onProgress = options.onProgress || (() => {});

  if (!token) {
    const err = new Error("GitHub Authentication Token is required. Please provide a Personal Access Token with 'repo' scope.");
    err.statusCode = 401;
    err.apiMessage = "Requires authentication. Provide GITHUB_TOKEN=ghp_xxx";
    err.operation = "authenticate";
    throw err;
  }

  acquireLock();

  try {
    onProgress({ phase: "init", message: `Validating repository ${repo} branch ${branch}...` });

    // 1. Fetch current remote branch commit & base tree SHA
    const branchRes = await requestWithRetry(`/repos/${repo}/branches/${branch}`, "GET", null, token);
    const parentCommitSha = branchRes.data.commit.sha;
    const parentTreeSha = branchRes.data.commit.commit.tree.sha;

    onProgress({
      phase: "detected_branch",
      parentCommitSha,
      parentTreeSha,
      message: `Remote parent commit: ${parentCommitSha.slice(0, 7)} (tree: ${parentTreeSha.slice(0, 7)})`
    });

    // 2. Compute exact diff against remote GitHub tree
    onProgress({ phase: "diff", message: "Comparing local workspace against remote tree..." });
    const diff = await detectChanges(parentTreeSha, token);
    const mbTotal = (diff.totalBytesToUpload / (1024 * 1024)).toFixed(2);

    onProgress({
      phase: "summary",
      totalChanged: diff.totalChanged,
      added: diff.added.length,
      modified: diff.modified.length,
      deleted: diff.deleted.length,
      approximateSizeMb: mbTotal,
      message: `Found ${diff.totalChanged} genuinely changed files (${diff.added.length} added, ${diff.modified.length} modified, ${diff.deleted.length} deleted, ~${mbTotal} MB)`
    });

    if (diff.totalChanged === 0) {
      onProgress({ phase: "complete", message: "Everything is already completely up to date on GitHub! Nothing to push." });
      return {
        success: true,
        alreadyUpToDate: true,
        totalChanged: 0,
        commitSha: parentCommitSha,
        commitUrl: `https://github.com/${repo}/commit/${parentCommitSha}`,
      };
    }

    // 3. Pre-flight write permission verification
    onProgress({ phase: "verifying_permissions", message: `Verifying repository write permissions for '${repo}'...` });
    try {
      await requestWithRetry(`/repos/${repo}/git/blobs`, "POST", { content: "probe_write_permission", encoding: "utf-8" }, token, 1);
    } catch (probeErr) {
      if (probeErr.statusCode === 403) {
        const isPat = typeof token === "string" && token.startsWith("github_pat_");
        const msg = isPat
          ? `GitHub Token write permission denied (403). Your Fine-Grained Personal Access Token lacks the 'Contents: Read and write' permission on repository '${repo}'. Please update the token on GitHub: Settings -> Developer Settings -> Personal access tokens -> Fine-grained tokens -> Edit Token -> Repository permissions -> set 'Contents' to 'Read and write'. Alternatively, generate a Classic Personal Access Token with 'repo' scope.`
          : `GitHub Token write permission denied (403). Ensure your token has write access and 'repo' scope for repository '${repo}'.`;
        const writeErr = new Error(msg);
        writeErr.statusCode = 403;
        writeErr.apiMessage = msg;
        writeErr.operation = "verify_write_permission";
        writeErr.documentation_url = "https://docs.github.com/rest/git/blobs#create-a-blob";
        writeErr.responseBody = probeErr.responseBody;
        throw writeErr;
      }
      throw probeErr;
    }

    // 4. Upload Blobs in controlled batches with progress reporting
    const filesToUpload = [...diff.added, ...diff.modified];
    const treeUpdates = [];
    let uploadedCount = 0;

    onProgress({
      phase: "uploading_blobs",
      uploadedCount: 0,
      totalFiles: filesToUpload.length,
      message: `Uploading ${filesToUpload.length} file blobs (${mbTotal} MB) in concurrency batches of ${CONCURRENCY_LIMIT}...`
    });

    for (let i = 0; i < filesToUpload.length; i += CONCURRENCY_LIMIT) {
      const chunk = filesToUpload.slice(i, i + CONCURRENCY_LIMIT);
      await Promise.all(
        chunk.map(async (file) => {
          const binary = isBinaryFile(file.path);
          const payload = {
            content: binary ? file.buffer.toString("base64") : file.buffer.toString("utf8"),
            encoding: binary ? "base64" : "utf-8",
          };

          const blobRes = await requestWithRetry(`/repos/${repo}/git/blobs`, "POST", payload, token);
          treeUpdates.push({
            path: file.path,
            mode: "100644",
            type: "blob",
            sha: blobRes.data.sha,
          });

          uploadedCount++;
          const percent = ((uploadedCount / filesToUpload.length) * 100).toFixed(1);
          onProgress({
            phase: "uploading_blobs",
            uploadedCount,
            totalFiles: filesToUpload.length,
            percent: parseFloat(percent),
            lastFile: file.path,
            message: `Uploaded [${uploadedCount}/${filesToUpload.length}] (${percent}%) - ${file.path}`
          });
        })
      );
    }

    // 4. Handle deleted files in tree via GitHub Git Trees API deletion syntax { sha: null }
    for (const delPath of diff.deleted) {
      treeUpdates.push({
        path: delPath,
        mode: "100644",
        type: "blob",
        sha: null,
      });
    }

    // 5. Build single unified Git Tree
    onProgress({ phase: "creating_tree", message: `Building unified Git tree with ${treeUpdates.length} updates...` });
    const treePayload = {
      base_tree: parentTreeSha,
      tree: treeUpdates,
    };
    const newTreeRes = await requestWithRetry(`/repos/${repo}/git/trees`, "POST", treePayload, token);
    const newTreeSha = newTreeRes.data.sha;

    // 6. CONFLICT DETECTION: Re-verify that remote branch hasn't moved before creating commit
    onProgress({ phase: "conflict_check", message: `Checking for remote branch concurrency conflicts on '${branch}'...` });
    const checkBranchRes = await requestWithRetry(`/repos/${repo}/branches/${branch}`, "GET", null, token);
    const currentRemoteSha = checkBranchRes.data.commit.sha;

    if (currentRemoteSha !== parentCommitSha) {
      const conflictErr = new Error(
        `Conflict detected: Remote branch '${branch}' moved from ${parentCommitSha.slice(0, 7)} to ${currentRemoteSha.slice(0, 7)} while push was preparing. Fast-forward aborted to prevent overwriting changes.`
      );
      conflictErr.statusCode = 409;
      conflictErr.apiMessage = "Remote branch head moved concurrently";
      conflictErr.operation = "conflict_check";
      conflictErr.parentCommitSha = parentCommitSha;
      conflictErr.currentRemoteSha = currentRemoteSha;
      throw conflictErr;
    }

    // 7. Create single atomic commit referencing new tree & parent commit
    onProgress({ phase: "creating_commit", message: "Creating atomic commit object..." });
    const productWebpCount = diff.added.filter(f => f.path.startsWith("public/images/products")).length;
    const commitMessage = `feat: sync ${diff.totalChanged} changes including ${productWebpCount} optimized product webp assets`;
    const commitPayload = {
      message: commitMessage,
      tree: newTreeSha,
      parents: [parentCommitSha],
    };
    const newCommitRes = await requestWithRetry(`/repos/${repo}/git/commits`, "POST", commitPayload, token);
    const newCommitSha = newCommitRes.data.sha;

    // 8. Update target branch reference to point to new commit
    onProgress({ phase: "updating_ref", message: `Updating branch 'refs/heads/${branch}' -> ${newCommitSha.slice(0, 7)}...` });
    const refPayload = {
      sha: newCommitSha,
      force: false,
    };
    const updateRefRes = await requestWithRetry(
      `/repos/${repo}/git/refs/heads/${branch}`,
      "PATCH",
      refPayload,
      token
    );

    const verifiedSha = updateRefRes.data.object.sha;
    onProgress({ phase: "verifying", message: `GitHub confirmed ref update: ${verifiedSha.slice(0, 7)}` });

    // 9. Synchronize local git tracking
    try {
      execSync(`git fetch origin ${branch}`, { stdio: "ignore" });
      execSync(`git reset --mixed origin/${branch}`, { stdio: "ignore" });
    } catch {}

    const result = {
      success: true,
      commitSha: verifiedSha,
      commitUrl: `https://github.com/${repo}/commit/${verifiedSha}`,
      totalChanged: diff.totalChanged,
      added: diff.added.length,
      modified: diff.modified.length,
      deleted: diff.deleted.length,
      totalBytes: diff.totalBytesToUpload,
      approximateSizeMb: mbTotal,
      repo,
      branch,
    };

    onProgress({
      phase: "complete",
      ...result,
      message: `Successfully pushed ${diff.totalChanged} changes to ${repo} (${branch})! Commit: ${verifiedSha.slice(0, 7)}`
    });

    return result;
  } finally {
    releaseLock();
  }
}

// CLI Execution entry point
async function runCli() {
  console.log("===============================================================");
  console.log("  ATOMIC GITHUB PUSH & SYNC (Git Data Trees + Commit Engine)");
  console.log("===============================================================");
  console.log(`Target Repository: ${OWNER_REPO}`);
  console.log(`Target Branch:     ${TARGET_BRANCH}`);
  console.log(`Started At:        ${new Date().toISOString()}`);

  const token = resolveGitHubToken();
  const isDryRun = process.argv.includes("--dry-run");

  // 1. Check if dry-run requested or token is not available
  if (isDryRun || !token) {
    if (isDryRun) {
      console.log("\n[INFO] --dry-run flag specified. Performing read-only change detection...");
    } else {
      console.log("\n[INFO] No GitHub Token provided in CLI or environment.");
      console.log("Performing unauthenticated change detection against GitHub public repository...");
    }
    try {
      const branchRes = await requestWithRetry(`/repos/${OWNER_REPO}/branches/${TARGET_BRANCH}`, "GET", null, token || null);
      const parentCommitSha = branchRes.data.commit.sha;
      const parentTreeSha = branchRes.data.commit.commit.tree.sha;
      console.log(`- Remote Parent Commit: ${parentCommitSha}`);
      console.log(`- Remote Base Tree:     ${parentTreeSha}`);

      const diff = await detectChanges(parentTreeSha, token || null);
      const mbTotal = (diff.totalBytesToUpload / (1024 * 1024)).toFixed(2);

      console.log("\n---------------------------------------------------------------");
      console.log("  PRE-PUSH VALIDATION SUMMARY (READ-ONLY)");
      console.log("---------------------------------------------------------------");
      console.log(`Target Repository:         ${OWNER_REPO}`);
      console.log(`Target Branch:             ${TARGET_BRANCH}`);
      console.log(`Parent Commit SHA:         ${parentCommitSha}`);
      console.log(`Total Genuinely Changed:   ${diff.totalChanged} files`);
      console.log(`  - Newly Added:           ${diff.added.length} files`);
      const prodImages = diff.added.filter(f => f.path.startsWith("public/images/products"));
      console.log(`    (of which ${prodImages.length} are legitimate product webp assets)`);
      console.log(`  - Modified:              ${diff.modified.length} files`);
      console.log(`  - Deleted:               ${diff.deleted.length} files`);
      console.log(`Total Upload Size:         ${mbTotal} MB`);
      console.log("---------------------------------------------------------------");

      console.log("\nTo execute this push with your GitHub Personal Access Token, run:");
      console.log(`   GITHUB_TOKEN=ghp_xxx npm run push:github`);
      console.log("or via command line flag:");
      console.log(`   node scripts/github-push.js --token=ghp_xxx`);
      console.log("or save your token into .github-token (gitignored)");
      console.log("or trigger the push via the application API: POST /api/github/push");
      return;
    } catch (err) {
      console.error(`- Error querying public repository: ${err.message}`);
      return;
    }
  }

  // 2. Execute full atomic push with progress logging
  try {
    const result = await executeGitHubPush({
      token,
      repo: OWNER_REPO,
      branch: TARGET_BRANCH,
      onProgress: (p) => {
        if (p.phase === "uploading_blobs" && p.uploadedCount && p.uploadedCount % 25 === 0) {
          console.log(` [${p.uploadedCount}/${p.totalFiles}] (${p.percent}%) Uploaded blobs (last: ${p.lastFile})`);
        } else if (p.message) {
          console.log(`- ${p.message}`);
        }
      }
    });

    console.log("\n===============================================================");
    console.log("  PUSH SUCCESSFUL! ALL CHANGES COMMITTED & PUSHED TO GITHUB");
    console.log("===============================================================");
    console.log(`Commit URL:     ${result.commitUrl}`);
    console.log(`Commit SHA:     ${result.commitSha}`);
    console.log(`Files Pushed:   ${result.totalChanged}`);
  } catch (err) {
    console.error("\n===============================================================");
    console.error("  ❌ GITHUB PUSH FAILED");
    console.error("===============================================================");
    console.error(`HTTP Status:        ${err.statusCode || "N/A"} ${err.statusMessage || ""}`);
    console.error(`Target Repo:        ${OWNER_REPO}`);
    console.error(`Target Branch:      ${TARGET_BRANCH}`);
    console.error(`Failed Operation:   ${err.operation || "N/A"}`);
    console.error(`Payload Size:       ${err.payloadSize ? (err.payloadSize / 1024).toFixed(1) + " KB" : "N/A"}`);
    console.error(`GitHub API Error:   ${err.apiMessage || err.message}`);
    if (err.documentation_url) {
      console.error(`Documentation URL:  ${err.documentation_url}`);
    }
    if (err.responseBody) {
      console.error(`Response Details:   ${JSON.stringify(err.responseBody, null, 2)}`);
    }

    console.error("\nTroubleshooting Guidance:");
    if (err.statusCode === 401) {
      console.error("- Authentication Error: Your token is invalid, missing, or expired. Generate a token at https://github.com/settings/tokens with 'repo' scope.");
    } else if (err.statusCode === 403) {
      console.error("- Permission Denied or Rate Limit Exceeded: Check that your token has write access to JunkheadVlogs/mukesh-1.");
    } else if (err.statusCode === 404) {
      console.error("- Repository or Branch Not Found: Confirm JunkheadVlogs/mukesh-1 exists and the target branch is 'main'.");
    } else if (err.statusCode === 409) {
      console.error("- Conflict: The remote branch was updated while preparing the push. Fetch the latest changes and retry.");
    } else if (err.statusCode === 422) {
      console.error("- Validation Error: The commit or tree structure was rejected by GitHub. Check file paths and encodings.");
    }
    process.exit(1);
  }
}

// Auto-run when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCli();
}
