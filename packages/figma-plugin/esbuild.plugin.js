const esbuild = require("esbuild");

const commonOpts = {
  entryPoints: ["./plugin-src/code.ts"],
  outfile: "dist/code.js",
  bundle: true,
  plugins: [],
};

async function watch() {
  let ctx = await esbuild.context(commonOpts);

  await ctx.watch();
  console.log("Watching Plugin Code...");
}

function build() {
  esbuild.build(commonOpts).catch(() => process.exit(1));
}

function main() {
  const isWatch = process.env.WATCH;

  if (isWatch) {
    watch();
  } else {
    build();
  }
}

main();
