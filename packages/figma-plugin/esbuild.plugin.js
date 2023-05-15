const { build } = require("esbuild");

const watch = process.argv.includes("--watch");

build({
  entryPoints: ["./plugin-src/code.ts"],
  outfile: "dist/code.js",
  bundle: true,
  minify: !watch,
  plugins: [],
}).catch(() => process.exit(1));
