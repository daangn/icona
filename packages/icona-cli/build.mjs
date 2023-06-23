import esbuild from "esbuild";

import pkg from "./package.json" assert { type: "json" };

esbuild.build({
  entryPoints: ["./src/cli.ts"],
  outfile: "./bin/index.mjs",
  bundle: true,
  write: true,
  treeShaking: true,
  sourcemap: false,
  minify: true,
  format: "esm",
  platform: "node",
  target: ["node16"],
  external: [...Object.keys(pkg.dependencies)],
});

esbuild.build({
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/src/index.mjs",
  bundle: true,
  write: true,
  treeShaking: true,
  sourcemap: false,
  minify: false,
  format: "esm",
  platform: "node",
  target: ["node16"],
  external: [...Object.keys(pkg.dependencies)],
});

esbuild.build({
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/src/index.js",
  bundle: true,
  write: true,
  treeShaking: true,
  sourcemap: false,
  minify: false,
  format: "cjs",
  platform: "node",
  target: ["node16"],
  external: [...Object.keys(pkg.dependencies)],
});
