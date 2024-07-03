import type { DrawableConfig, IconaIconData } from "@icona/types";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import svg2vectordrawable from "svg2vectordrawable";

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

  config: DrawableConfig;
}

export const generateDrawable = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  const targetPath = getTargetPath(config.path || "drawable");
  const drawableConfig = config.svg2vectordrawableConfig || {};
  const defaultColor = config.defaultColor;

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

  console.log(`\nDrawable Generate in \`${targetPath}\` folder...`);

  const bar = createBar({
    name: "Drawable",
    total: iconData.length,
  });

  bar.start();

  // TODO: Name transform option
  for (const [name, data] of iconData) {
    const { svg } = data;

    const drawablePath = resolve(targetPath, `${name}.xml`);
    let drawable = await svg2vectordrawable(svg, drawableConfig);

    // NOTE(@junghyeonsu): DRAWABLE_DEFAULT_COLOR = "#FF212124"
    if (defaultColor) {
      drawable = drawable.replace(/#FF212124/g, defaultColor);
    }

    await writeFile(drawablePath, drawable);
    bar.increment();
  }

  bar.stop();
};
