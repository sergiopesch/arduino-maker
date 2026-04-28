import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];
const pluginId = "arduino-maker";
const githubUrl = "https://github.com/sergiopesch/arduino-maker";

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return null;
  }
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function walk(dir) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return [];

  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relativePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(relativePath);
    if (entry.isFile()) return [relativePath];
    return [];
  });
}

function parseFrontmatter(relativePath) {
  const content = fs.readFileSync(path.join(root, relativePath), "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    errors.push(`${relativePath}: missing YAML frontmatter`);
    return { content };
  }

  const metadata = {};
  for (const line of match[1].split("\n")) {
    const item = line.match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (!item) {
      errors.push(`${relativePath}: unsupported frontmatter line: ${line}`);
      continue;
    }
    metadata[item[1]] = item[2].trim();
  }

  return { metadata, content };
}

function validateMarkdownLinks(relativePath, content) {
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of content.matchAll(linkPattern)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;

    const decoded = decodeURIComponent(target);
    const fullTarget = path.resolve(path.dirname(path.join(root, relativePath)), decoded);
    if (!fullTarget.startsWith(root + path.sep) && fullTarget !== root) {
      errors.push(`${relativePath}: link escapes plugin root: ${match[1]}`);
      continue;
    }
    if (!fs.existsSync(fullTarget)) {
      errors.push(`${relativePath}: broken link: ${match[1]}`);
    }
  }
}

function validateCodeFences(relativePath, content) {
  const fenceCount = content.split("\n").filter((line) => line.startsWith("```")).length;
  if (fenceCount % 2 !== 0) {
    errors.push(`${relativePath}: unmatched fenced code block`);
  }
}

const manifest = readJson("openclaw.plugin.json");
if (manifest) {
  if (manifest.id !== pluginId) {
    errors.push(`openclaw.plugin.json: id must be ${pluginId}`);
  }
  for (const key of ["name", "description", "version"]) {
    if (typeof manifest[key] !== "string" || !manifest[key].trim()) {
      errors.push(`openclaw.plugin.json: ${key} must be a non-empty string`);
    }
  }
  if (!Array.isArray(manifest.skills) || manifest.skills.length !== 1 || manifest.skills[0] !== "./skills") {
    errors.push('openclaw.plugin.json: skills must be ["./skills"]');
  }
  if (manifest.configSchema?.type !== "object" || manifest.configSchema?.additionalProperties !== false) {
    errors.push("openclaw.plugin.json: configSchema must be a closed object");
  }
}

const packageJson = readJson("package.json");
if (packageJson) {
  if (packageJson.name !== "@sergiopesch/arduino-maker") {
    errors.push("package.json: name must be @sergiopesch/arduino-maker");
  }
  if (packageJson.type !== "module") errors.push("package.json: type must be module");
  if (packageJson.main !== "./index.js" || packageJson.exports !== "./index.js") {
    errors.push('package.json: main and exports must point to "./index.js"');
  }
  if (packageJson.license !== "MIT") {
    errors.push("package.json: license must be MIT");
  }
  if (packageJson.private === true) {
    errors.push("package.json: package must not be private for plugin sharing");
  }
  if (packageJson.homepage !== githubUrl) {
    errors.push(`package.json: homepage must be ${githubUrl}`);
  }
  if (packageJson.repository?.url !== "git+https://github.com/sergiopesch/arduino-maker.git") {
    errors.push("package.json: repository.url must use npm-normalized git+https form");
  }
  if (packageJson.bugs?.url !== `${githubUrl}/issues`) {
    errors.push("package.json: bugs.url must point to the GitHub issues page");
  }
  if (!packageJson.files?.includes("openclaw.plugin.json")) {
    errors.push("package.json: files must include openclaw.plugin.json");
  }
  if (!packageJson.files?.includes("assets/**")) {
    errors.push("package.json: files must include assets/**");
  }
  if (!packageJson.files?.includes("index.js")) {
    errors.push("package.json: files must include index.js");
  }
  if (!packageJson.files?.includes("skills/")) {
    errors.push("package.json: files must include skills/");
  }
  for (const requiredFile of ["LICENSE", "CONTRIBUTING.md", "CHANGELOG.md", "SECURITY.md"]) {
    if (!packageJson.files?.includes(requiredFile)) {
      errors.push(`package.json: files must include ${requiredFile}`);
    }
  }
  if (!Array.isArray(packageJson.openclaw?.extensions) || packageJson.openclaw.extensions[0] !== "./index.js") {
    errors.push('package.json: openclaw.extensions must include "./index.js"');
  }
  if (packageJson.openclaw?.compat?.pluginApi !== ">=2026.4.24") {
    errors.push("package.json: openclaw.compat.pluginApi must be >=2026.4.24");
  }
  if (packageJson.peerDependencies?.openclaw !== ">=2026.4.24") {
    errors.push("package.json: peerDependencies.openclaw must be >=2026.4.24");
  }
  if (packageJson.scripts?.test !== "node scripts/validate-plugin.mjs") {
    errors.push("package.json: test script must run scripts/validate-plugin.mjs");
  }
  if (packageJson.scripts?.prepack !== "npm test && node --check index.js") {
    errors.push("package.json: prepack must run validation and JS syntax checks");
  }
  if (packageJson.scripts?.prepublishOnly !== "npm test && node --check index.js && npm pack --dry-run") {
    errors.push("package.json: prepublishOnly must run validation, JS check, and pack dry-run");
  }
}

if (!exists("index.js")) {
  errors.push("index.js: missing native plugin entrypoint");
} else {
  try {
    const entry = await import(path.join(root, "index.js"));
    if (entry.default?.id !== pluginId) {
      errors.push(`index.js: default export id must be ${pluginId}`);
    }
    if (typeof entry.default?.register !== "function") {
      errors.push("index.js: default export must provide register()");
    }
    if (entry.default?.configSchema?.type !== "object") {
      errors.push("index.js: default export must provide an object configSchema");
    }
  } catch (error) {
    errors.push(`index.js: failed to import plugin entrypoint: ${error.message}`);
  }
}

if (!exists("skills/arduino-maker/SKILL.md")) {
  errors.push("skills/arduino-maker/SKILL.md: missing skill entrypoint");
}

const skillFiles = walk("skills").filter((file) => path.basename(file) === "SKILL.md");
if (skillFiles.length !== 1) {
  errors.push(`skills: expected exactly one SKILL.md, found ${skillFiles.length}`);
}

for (const skillFile of skillFiles) {
  const { metadata, content } = parseFrontmatter(skillFile);
  if (metadata) {
    if (metadata.name !== pluginId) {
      errors.push(`${skillFile}: frontmatter name must be ${pluginId}`);
    }
    if (!metadata.description || metadata.description.length < 40) {
      errors.push(`${skillFile}: description is missing or too short`);
    }
    if (metadata.homepage !== githubUrl) {
      errors.push(`${skillFile}: homepage must be ${githubUrl}`);
    }
  }

  validateMarkdownLinks(skillFile, content);
  validateCodeFences(skillFile, content);

  for (const phrase of [
    "Safety Rules",
    "3.3V logic",
    "current-limiting resistor",
    "common ground",
    "flyback diode",
    "mains voltage"
  ]) {
    if (!content.includes(phrase)) {
      errors.push(`${skillFile}: missing required safety phrase: ${phrase}`);
    }
  }

  const bannedPhrases = [
    "Claude (you)",
    "codex exec",
    "Spawn Codex"
  ];
  for (const phrase of bannedPhrases) {
    if (content.includes(phrase)) {
      errors.push(`${skillFile}: contains outdated orchestration phrase: ${phrase}`);
    }
  }
}

for (const requiredFile of ["LICENSE", "CONTRIBUTING.md", "CHANGELOG.md", "SECURITY.md", ".npmignore", "assets/arduino-maker-hero.png"]) {
  if (!exists(requiredFile)) {
    errors.push(`${requiredFile}: missing release file`);
  }
}

if (exists("assets/arduino-maker-hero.png")) {
  const heroPath = path.join(root, "assets/arduino-maker-hero.png");
  const signature = fs.readFileSync(heroPath).subarray(0, 8);
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!signature.equals(pngSignature)) {
    errors.push("assets/arduino-maker-hero.png: must be a PNG image");
  }
  if (fs.statSync(heroPath).size > 3_000_000) {
    errors.push("assets/arduino-maker-hero.png: should stay under 3 MB for README and package usability");
  }
}

const releaseTextChecks = {
  "README.md": [
    "assets/arduino-maker-hero.png",
    "Safety Scope",
    "OpenClaw Plugin Format",
    "npm test",
    "prepublishOnly",
    "Contributing",
    "Security",
    "License"
  ],
  "LICENSE": [
    "MIT License",
    "Copyright (c) 2026 Sergio Pesch"
  ],
  "CONTRIBUTING.md": [
    "Arduino Maker",
    "3.3V logic",
    "npm test"
  ],
  "SECURITY.md": [
    "Security Policy",
    "Hardware Safety",
    "3.3V logic"
  ],
  "CHANGELOG.md": [
    "# Changelog",
    "1.0.0",
    "hero image"
  ]
};

for (const [file, phrases] of Object.entries(releaseTextChecks)) {
  if (!exists(file)) continue;
  const content = fs.readFileSync(path.join(root, file), "utf8");
  for (const phrase of phrases) {
    if (!content.includes(phrase)) {
      errors.push(`${file}: missing required phrase: ${phrase}`);
    }
  }
}

const markdownFiles = walk(".").filter((file) => {
  if (file.startsWith(`node_modules${path.sep}`)) return false;
  if (file.startsWith(`.git${path.sep}`)) return false;
  return file.endsWith(".md");
});
for (const file of markdownFiles) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  validateMarkdownLinks(file, content);
  validateCodeFences(file, content);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${skillFiles.length} skill and ${markdownFiles.length} markdown files.`);
