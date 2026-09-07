import { watch } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = process.cwd();
const ignored = [
  ".git/",
  ".next/",
  "node_modules/",
  ".env",
  ".env.",
  "dev-server.log",
];

let timer;
let running = false;
let pending = false;

function isRelevant(filename) {
  if (!filename) return true;
  const normalized = filename.replaceAll("\\", "/");
  return !ignored.some((entry) => normalized === entry || normalized.startsWith(entry));
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(syncChanges, 1000);
}

async function syncChanges() {
  if (running) {
    pending = true;
    return;
  }

  running = true;
  try {
    const { stdout: status } = await run("git", ["status", "--porcelain"], { cwd: root });
    if (!status.trim()) return;

    await run("git", ["add", "-A"], { cwd: root });
    await run("git", ["commit", "-m", "chore: sync saved changes"], { cwd: root });
    await run("git", ["push", "origin", "HEAD"], { cwd: root });
    console.log("Saved changes committed and pushed to GitHub.");
  } catch (error) {
    console.error(error?.stderr || error?.message || error);
  } finally {
    running = false;
    if (pending) {
      pending = false;
      schedule();
    }
  }
}

watch(root, { recursive: true }, (_event, filename) => {
  if (isRelevant(filename)) schedule();
});

console.log("Watching saved files for automatic GitHub sync.");
