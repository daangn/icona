const { build } = require("esbuild");

build({
  entryPoints: ["./plugin-src/code.ts"],
  outfile: "dist/code.js",
  bundle: true,
  plugins: [],
}).catch(() => process.exit(1));
