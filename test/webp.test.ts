import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, it } from "node:test";

import { generate, generateWebP } from "@icona/generator";
import sharp from "sharp";

const tempDirs: string[] = [];

// A representative antialiased icon with fully transparent edge pixels. WebP's
// default transparent-area cleanup changes their hidden RGB values unless the
// encoder's `exact` option is actually supported and enabled.
const EXACT_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAA+1JREFUeAG9VU1oXFUUPue+n0kyE2awgi6MecnGItLQgJviTxZWdx11Y1NDMy3FtYVScKFpcaG7Km7FtCjiqtZuRAplAm7cJNWNKQGttaAgOgkkM+//+J37pkOSSZuo2AuX+96bc893zne+c4bof168V8Oll+drw2W5nIm75oXxm+OXT/2yl3t7Avjx6HtByatcF3LHRDzKxb3lijc1/vnru4KY3QzuzLw9MeTl1x0KA6YOLsRiOBlNnbh587VPJ/4TwJ3jp2eF0yZzNEbcYUMJUo5wCVviwPGS5sqxS/V/BfDb8VNzDifzhsOqkVAcSUSdM4VdkBjvcZU4+/LmzPy5fwTwR2P6gjHxOWMdYpuEmUN65K0Zqr56iA3H5LD+VpyOpO+s3ANkS5F/bkzVhqkyz+TXM/FJ2GcRVwTPbjDGD58/S3k7pN/PfEDpeiZCPgrukVAJt1F8Ml+tr5sTB6+cWO3LoNWYCqrMTaReJ47ZQZRKjeUbz5XDz4q9MDRAwy89TagLd6nCc8hKnZG0Xh7Ol3469vHoFoBWY39gTLvpUHRAU1bH9oI+c0L+/nH2Jyd62ZYPH6LKcwfEGWQ4B00U2fqQidihOEgpb94F4VYjCHxTWiIqVaFvm64gXaWnVD8p/gtH2AyV6V6r/e0NWf3sG0rbov2BL6AWOyNnLSdnylQGadQxCdQQsjHdomI7I4/TwJHp+zrXNTD5BJuyIdsjEIKlDieoq3Gu1G1bGyefmkPHzmnxeN8I+S9Oszv5DJl9j26xi5eXKVr8ARksUtZOIAREz4MfPnbp/OnNdjvINKa78pQ/b1P4xQVZP3tU0uXvexbZ7Vu09v670rn2NXG7JSyhlSzLxup2b30ASDNg1bZuY8GsQqKrn/RsOteuFsqRqCuGmIozCXYFgHMAxKgHxgIiA5DoiMiXv5P81xVrky4uWHWZTVI12owSVbf7c7d/8KhTzSRHE+VA87gAFTjJJPzojNDIk8ydvxC5D43miDwntdbfc5Mf7At484s0qJZ5Ay2VGYkneXHCBWSLbs5tt6K77XdXCjkCyNqWbNdvsP/Q2MWLqztnMEgTJo2hCEEfZKAo1xMJYLGwkUzACV4QNZfwROKQ5pqBLryQyxVOdIQv7FyDlBqsaesgk+4gI0xR1g5Fd4N3orDLe1Fgq3ktsu1+DS56he5T5OcRhuVNi0gSqUMYqXMUnqLeFC0aMyn+IzQAiAJjAjlks5hrtT4AeYNmcQS4zd3qYCxnNhuNEFs0WoZDCyIFcLFVcZGC6ncoyZvtrwHTDewFFU8PFlAmRx0kUbpJSSerm4Jza2BP/AZqjb3MkIJzhR7U+htjLeGlp+tctgAAAABJRU5ErkJggg==";

async function makeTempDir() {
  const dir = await mkdtemp(join(tmpdir(), "icona-webp-"));
  tempDirs.push(dir);
  return dir;
}

async function makePngBase64() {
  return EXACT_PNG_BASE64;
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
}

async function iconFixture() {
  const png = await makePngBase64();
  return {
    icon_test: {
      name: "icon_test",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" />',
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
    const pngPath = join(root, "png");
    const webpPath = join(root, "webp");

    const icons = await iconFixture();
    await generate({
      icons,
      config: {
        svg: { path: join(root, "svg") },
        webp: { active: true, path: webpPath },
        png: { active: true, path: pngPath },
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
    assert.deepEqual(
      await readFile(join(pngPath, "1x", "icon_test.png")),
      Buffer.from(icons.icon_test.png["1x"]!, "base64"),
    );
  });

  it("keeps WebP optional in the integrated generate function", async () => {
    const root = await makeTempDir();
    const icons = await iconFixture();

    await generate({
      icons,
      config: {
        svg: { path: join(root, "svg") },
        png: { active: false },
        pdf: { active: false },
        drawable: { active: false },
        react: { active: false },
        vue2: { active: false },
        vue3: { active: false },
      },
    });

    assert.match(
      await readFile(join(root, "svg", "icon_test.svg"), "utf8"),
      /<svg/,
    );
  });

  it("rejects when recreate mode cannot remove stale output", async () => {
    const root = await makeTempDir();
    const webpPath = join(root, "webp");
    await mkdir(join(webpPath, "1x", "nested"), { recursive: true });

    await assert.rejects(
      generateWebP({
        icons: await iconFixture(),
        config: { active: true, genMode: "recreate", path: webpPath },
      }),
      /Failed to recreate WebP output directory/,
    );
  });
});
