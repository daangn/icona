import type { GenerateReactConfig, IconaIconData } from "@icona/types";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import type { Config } from "@svgr/core";
import { transform } from "@svgr/core";
import { Presets, SingleBar } from "cli-progress";
import { writeFile } from "fs/promises";
import { resolve } from "path";

interface GenerateReactFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GenerateReactConfig;
}

export const generateReact = async ({
  icons = getIconaIconsFile(),
  config,
}: GenerateReactFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "react";
  const svgrConfig = config.svgrConfig || {};

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

  console.log(`\nReact Generate in \`${path}\` folder...`);

  const bar = new SingleBar(
    {
      format: "React Generate | {bar} | {percentage}% | {value}/{total}",
      hideCursor: true,
    },
    Presets.shades_grey,
  );

  bar.start(iconData.length, 0);

  // TODO: Name transform option
  for (const [name, data] of iconData) {
    const { svg } = data;

    const componentName = name
      .replace(/^[a-z]/, (ch) => ch.toUpperCase())
      .replace(/_[a-z]/g, (ch) => ch[1].toUpperCase())
      .replace(/-[a-z]/g, (ch) => ch[1].toUpperCase());

    const component = await transform(svg, svgrConfig as Config, {
      componentName,
    });

    const svgPath = resolve(projectPath, path, `${componentName}.tsx`);

    await writeFile(svgPath, component, "utf-8");
    bar.increment();
  }

  bar.stop();
};
