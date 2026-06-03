#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const sourceRoot = resolve(process.cwd());
const args = process.argv.slice(2);
const force = args.includes("--force");
const targetArg = args.find((arg) => arg !== "--force");

if (!targetArg) {
  console.error("Usage: node scripts/export-lovable-new-site.mjs <target-directory> [--force]");
  process.exit(1);
}

const targetRoot = resolve(targetArg);

if (targetRoot === sourceRoot || targetRoot.startsWith(`${sourceRoot}/`)) {
  console.error("Refusing to export into this repository. Choose a sibling or separate directory.");
  process.exit(1);
}

const entriesToCopy = [
  "src",
  "public",
  "scripts",
  "supabase",
  "components.json",
  "eslint.config.js",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "wrangler.jsonc",
  "bunfig.toml",
];

const optionalEntries = ["bun.lock", "bun.lockb", "PROJECT_IDENTITY.md", "FINAL_AUDIT_2026-04-30.md"];

if (existsSync(targetRoot)) {
  const isDirectory = statSync(targetRoot).isDirectory();
  if (!isDirectory) {
    console.error(`Target exists and is not a directory: ${targetRoot}`);
    process.exit(1);
  }
  if (!force) {
    console.error(`Target already exists. Re-run with --force to replace it: ${targetRoot}`);
    process.exit(1);
  }
  rmSync(targetRoot, { recursive: true, force: true });
}

mkdirSync(targetRoot, { recursive: true });

for (const entry of [...entriesToCopy, ...optionalEntries]) {
  const from = resolve(sourceRoot, entry);
  if (!existsSync(from)) continue;
  const to = resolve(targetRoot, entry);
  cpSync(from, to, { recursive: true, errorOnExist: false, force: true });
}

writeFileSync(
  resolve(targetRoot, "README.md"),
  `# Decoded Housing New Site\n\nThis is a clean export intended for a new repository and Lovable project.\n\n## Start\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Environment\n\n- VITE_SUPABASE_URL\n- VITE_SUPABASE_PUBLISHABLE_KEY\n- SUPABASE_URL\n- SUPABASE_PUBLISHABLE_KEY\n- VITE_MAPBOX_TOKEN\n\n## Product scope\n\nHousing search, basic-needs navigation, tenant-rights education, application assistance, shelter routing, and Stable Housing Navigator workflows.\n`,
);

writeFileSync(
  resolve(targetRoot, ".gitignore"),
  `node_modules\ndist\n.vite\n.env\n.env.*\n!.env.example\n.DS_Store\n`,
);

console.log(`Exported ${basename(targetRoot)} to ${targetRoot}`);
console.log("Next: cd into the target, run git init, commit, and connect that repository to a new Lovable project.");
