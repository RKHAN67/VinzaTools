import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(projectRoot, "cpanel-package");

const copyItems = [
  "server.mjs",
  "package-lock.json",
  "requirements.txt",
  "CPANEL-DEPLOY.md",
  "dist",
  "scripts",
  "themes",
];

await fs.rm(outputRoot, { recursive: true, force: true });
await fs.mkdir(outputRoot, { recursive: true });

for (const item of copyItems) {
  const source = path.join(projectRoot, item);
  const destination = path.join(outputRoot, item);
  await fs.cp(source, destination, { recursive: true });
}

const sourcePackageJson = JSON.parse(
  await fs.readFile(path.join(projectRoot, "package.json"), "utf8")
);

delete sourcePackageJson.type;
sourcePackageJson.scripts = {
  start: "node app.js",
};

await fs.writeFile(
  path.join(outputRoot, "package.json"),
  `${JSON.stringify(sourcePackageJson, null, 2)}\n`,
  "utf8"
);

await fs.writeFile(
  path.join(outputRoot, "app.js"),
  `process.env.NODE_ENV = process.env.NODE_ENV || "production";
import("./server.mjs").catch((error) => {
  console.error("Failed to start VinzaTools:", error);
  process.exit(1);
});
`,
  "utf8"
);

await fs.mkdir(path.join(outputRoot, "uploads"), { recursive: true });
await fs.writeFile(path.join(outputRoot, "uploads", ".gitkeep"), "", "utf8");

console.log(`cPanel package ready at ${outputRoot}`);
