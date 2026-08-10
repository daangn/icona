import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, it } from "node:test";

import { generate, generateWebP } from "@icona/generator";
import sharp from "sharp";

const tempDirs: string[] = [];

async function makeTempDir() {
  const dir = await mkdtemp(join(tmpdir(), "icona-webp-"));
  tempDirs.push(dir);
  return dir;
}

async function makePngBase64() {
  const rgba = Buffer.from([17, 34, 51, 68, 170, 187, 204, 221]);
  const png = await sharp(rgba, {
    raw: { width: 2, height: 1, channels: 4 },
  })
    .png()
    .toBuffer();
  return png.toString("base64");
}

async function expectLosslessWebP(path: string, pngBase64: string) {
  const png = await sharp(Buffer.from(pngBase64, "base64"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const webp = await sharp(await readFile(path))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  assert.deepEqual(
    {
      width: webp.info.width,
      height: webp.info.height,
      channels: webp.info.channels,
    },
    {
      width: png.info.width,
      height: png.info.height,
      channels: png.info.channels,
    },
  );
  assert.deepEqual(webp.data, png.data);
  assert.deepEqual(
    webp.data,
    Buffer.from([17, 34, 51, 68, 170, 187, 204, 221]),
  );
}

async function iconFixture() {
  const png = await makePngBase64();
  return {
    icon_test: {
      name: "icon_test",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="1" />',
      png: { "1x": png, "2x": png, "3x": null, "4x": null },
    },
  };
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("generateWebP", () => {
  it("creates a lossless WebP for every non-null PNG scale and removes stale files in recreate mode", async () => {
    const root = await makeTempDir();
    const webpPath = join(root, "webp");
    await mkdir(join(webpPath, "3x"), { recursive: true });
    await writeFile(join(webpPath, "3x", "stale.webp"), "stale");

    const icons = await iconFixture();
    await generateWebP({
      icons,
      config: { active: true, genMode: "recreate", path: webpPath },
    });

    await expectLosslessWebP(
      join(webpPath, "1x", "icon_test.webp"),
      icons.icon_test.png["1x"]!,
    );
    await expectLosslessWebP(
      join(webpPath, "2x", "icon_test.webp"),
      icons.icon_test.png["2x"]!,
    );
    await assert.rejects(readFile(join(webpPath, "3x", "stale.webp")));
    await assert.rejects(readFile(join(webpPath, "3x", "icon_test.webp")));
    await assert.rejects(readFile(join(webpPath, "4x", "icon_test.webp")));
  });

  it("runs through the integrated generate function when WebP is active", async () => {
    const root = await makeTempDir();
    const webpPath = join(root, "webp");

    const icons = await iconFixture();
    await generate({
      icons,
      config: {
        svg: { path: join(root, "svg") },
        webp: { active: true, path: webpPath },
        png: { active: false },
        pdf: { active: false },
        drawable: { active: false },
        react: { active: false },
        vue2: { active: false },
        vue3: { active: false },
      },
    });

    await expectLosslessWebP(
      join(webpPath, "1x", "icon_test.webp"),
      icons.icon_test.png["1x"]!,
    );
  });
});
