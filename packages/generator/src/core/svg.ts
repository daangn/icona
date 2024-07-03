import type { IconaIconData, SVGConfig } from "@icona/types";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { optimize } from "svgo";

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

  config: SVGConfig;
}

export const generateSVG = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  const targetPath = getTargetPath(config.path || "svg");
  const svgoConfig = config.svgoConfig || {};

  if (!icons) {
    throw new Error("There is no icons data");
  }

  const iconData = Object.entries(icons);
  if (iconData.length !== 0) {
    makeFolderIfNotExistFromRoot(targetPath);
  }

  if (config.genMode === "recreate") {
    deleteAllFilesInDir(targetPath);
  }

  console.log(`\nSVG Generate in \`${targetPath}\` folder...`);

  const bar = createBar({
    name: "SVG",
    total: iconData.length,
  });

  bar.start();

  // TODO: Name transform option
  for (const [name, data] of iconData) {
    const { svg } = data;

    if (!svg) {
      console.log(`There is no svg data in ${name}`);
      return;
    }

    const { data: optimizedSvg } = optimize(svg, svgoConfig);
    const svgPath = resolve(targetPath, `${name}.svg`);
    await writeFile(svgPath, optimizedSvg, "utf-8");
    bar.increment();
  }

  bar.stop();
};
