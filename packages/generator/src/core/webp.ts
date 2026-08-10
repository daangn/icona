import type { IconaIconData, WebPConfig } from "@icona/types";
import { resolve } from "path";
import sharp from "sharp";

import { createBar } from "../utils/bar";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getTargetPath,
  makeFolderIfNotExistFromRoot,
} from "../utils/file";

interface Props {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;

  config: WebPConfig;
}

const WEBP_OPTIONS = {
  lossless: true,
  effort: 6,
  preset: "icon",
  exact: true,
} as sharp.WebpOptions;

export const generateWebP = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  const targetPath = getTargetPath(config.path || "webp");
  const scales = ["1x", "2x", "3x", "4x"] as const;

  if (!icons) {
    throw new Error("There is no icons data");
  }

  const iconData = Object.entries(icons);
  if (iconData.length !== 0) {
    makeFolderIfNotExistFromRoot(targetPath);
    scales.forEach((scale) => {
      makeFolderIfNotExistFromRoot(resolve(targetPath, scale));
    });
  }

  if (config.genMode === "recreate") {
    scales.forEach((scale) => {
      deleteAllFilesInDir(resolve(targetPath, scale));
    });
  }

  console.log(`\nWebP Generate in \`${targetPath}\` folder...`);

  for (const scale of scales) {
    const iconaScaleData = iconData.filter(([, data]) => data.png[scale]);
    if (iconaScaleData.length === 0) continue;

    const bar = createBar({
      name: `WebP ${scale}`,
      total: iconaScaleData.length,
    });

    bar.start();

    for (const [name, data] of iconaScaleData) {
      const base64 = data.png[scale];
      if (!base64) continue;

      const buffer = Buffer.from(base64, "base64");
      const filePath = resolve(targetPath, scale, `${name}.webp`);

      await sharp(buffer).webp(WEBP_OPTIONS).toFile(filePath);
      bar.increment();
    }

    bar.stop();
  }
};
