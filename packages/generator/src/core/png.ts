import type { IconaIconData, PNGConfig } from "@icona/types";
import { writeFile } from "fs/promises";
import { resolve } from "path";

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

  config: PNGConfig;
}

export const generatePNG = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  const targetPath = getTargetPath(config.path || "png");
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

  console.log(`\nPNG Generate in \`${targetPath}\` folder...`);

  const iconaData = Object.entries(icons);
  // TODO: Name transform option
  for (const scale of scales) {
    const iconaScaleData = iconaData.filter(([, data]) => data.png[scale]);
    if (iconaScaleData.length === 0) continue;

    const bar = createBar({
      name: `PNG ${scale}`,
      total: iconaScaleData.length,
    });

    bar.start();

    for (const [name, data] of iconaScaleData) {
      const base64 = data.png[scale];
      if (!base64) return;

      const buffer = Buffer.from(base64, "base64");
      const filePath = resolve(targetPath, scale, `${name}.png`);

      await writeFile(filePath, buffer);
      bar.increment();
    }

    bar.stop();
  }
};
