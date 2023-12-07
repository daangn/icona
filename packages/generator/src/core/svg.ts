import type { GenerateSVGConfig, IconaIconData } from "@icona/types";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { Presets, SingleBar } from "cli-progress";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { optimize } from "svgo";

interface GenerateSVGFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GenerateSVGConfig;
}

export const generateSVG = async ({
  icons = getIconaIconsFile(),
  config,
}: GenerateSVGFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "svg";
  const svgoConfig = config.svgoConfig || {};

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

  console.log(`\nSVG Generate in \`${path}\` folder...`);

  const bar = new SingleBar(
    {
      format: "SVG Generate | {bar} | {percentage}% | {value}/{total}",
      hideCursor: true,
    },
    Presets.shades_grey,
  );

  bar.start(iconData.length, 0);

  // TODO: Name transform option
  for (const [name, data] of iconData) {
    const { svg } = data;

    if (!svg) {
      console.log(`There is no svg data in ${name}`);
      return;
    }

    const { data: optimizedSvg } = optimize(svg, svgoConfig);
    const svgPath = resolve(projectPath, path, `${name}.svg`);
    await writeFile(svgPath, optimizedSvg, "utf-8");
    bar.increment();
  }

  bar.stop();
};
