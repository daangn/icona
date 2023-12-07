import type { GenerateDrawableConfig, IconaIconData } from "@icona/types";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { Presets, SingleBar } from "cli-progress";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import svg2vectordrawable from "svg2vectordrawable";

interface GenerateDrawableFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GenerateDrawableConfig;
}

export const generateDrawable = async ({
  icons = getIconaIconsFile(),
  config,
}: GenerateDrawableFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "drawable";
  const drawableConfig = config.svg2vectordrawableConfig || {};
  const defaultColor = config.defaultColor;

  if (!icons) {
    throw new Error("There is no icons data");
  }

  const iconData = Object.entries(icons);
  if (iconData.length !== 0) {
    makeFolderIfNotExistFromRoot(path);
  }

  if (config.genMode === "recreate") {
    deleteAllFilesInDir(resolve(projectPath, path));
  }

  console.log(`\nDrawable Generate in \`${path}\` folder...`);

  const bar = new SingleBar(
    {
      format: "Drawable Generate | {bar} | {percentage}% | {value}/{total}",
      hideCursor: true,
    },
    Presets.shades_grey,
  );

  bar.start(iconData.length, 0);

  // TODO: Name transform option
  for (const [name, data] of iconData) {
    const { svg } = data;

    const drawablePath = resolve(projectPath, path, `${name}.xml`);
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
