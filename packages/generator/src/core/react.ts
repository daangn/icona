import type { GenerateReactConfig, IconaIconData } from "@icona/types";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import type { Config } from "@svgr/core";
import { transform } from "@svgr/core";
import { writeFileSync } from "fs";
import { resolve } from "path";

interface GenerateReactFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GenerateReactConfig;
}

export const generateReact = ({
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

  // TODO: Name transform option
  iconData.forEach(async ([name, data]) => {
    const { svg } = data;

    const componentName = name
      .replace(/^[a-z]/, (ch) => ch.toUpperCase())
      .replace(/_[a-z]/g, (ch) => ch[1].toUpperCase())
      .replace(/-[a-z]/g, (ch) => ch[1].toUpperCase());

    const component = await transform(svg, svgrConfig as Config, {
      componentName,
    });

    const svgPath = resolve(projectPath, path, `${componentName}.tsx`);

    writeFileSync(svgPath, component, "utf-8");
  });
};
