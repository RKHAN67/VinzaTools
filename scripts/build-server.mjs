import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

await esbuild.build({
  entryPoints: [path.join(projectRoot, "server.ts")],
  outfile: path.join(projectRoot, "server.mjs"),
  platform: "node",
  format: "esm",
  target: "node20",
  bundle: false,
  sourcemap: false,
  tsconfig: path.join(projectRoot, "tsconfig.json"),
});

console.log("Built server.mjs for cPanel/production startup.");
